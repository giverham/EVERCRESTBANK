import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Layers } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../data/demoData';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { supabaseCustomer as supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Account {
  id: string;
  name: string;
  number: string;
  routing: string;
  current_balance?: number;
  available_balance?: number;
}

interface Transaction {
  id: string;
  account_id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
  status: string;
  merchant?: string;
  created_at?: string;
}

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export function StatementsPage() {
  const { user } = useAuth();
  const { data: transactions } = useSupabaseData<Transaction>('transactions');
  const { data: accounts } = useSupabaseData<Account>('accounts');
  
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [customerAddress, setCustomerAddress] = useState('500 Madison Avenue, New York, NY 10022');
  const [brandingSettings, setBrandingSettings] = useState<any>({
    bankName: 'Everest Bank',
    bankWebsite: 'www.everestbank.com',
    bankPhone: '1-800-555-0199',
    bankEmail: 'support@everestbank.com',
    logoUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=150&h=150&q=80',
    sealUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=150&h=150&q=80',
    signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Signature_of_John_Hancock.svg',
    footerText: 'Member FDIC. Equal Housing Lender. This statement is computer generated.',
    disclaimer: 'Please report any discrepancies within 60 days.',
    watermark: 'EVEREST BANK OFFICIAL ACCOUNT STATEMENT CONFIDENTIAL',
    dateFormat: 'MMM DD, YYYY',
    themeColor: '#1e293b'
  });

  // Load custom address from Profile & dynamic statement settings from Supabase
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem('profile_' + user.id);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.address) setCustomerAddress(parsed.address);
        } catch (e) { }
      }
    }

    const loadSettings = async () => {
      const { data: settingsRes } = await supabase.from('settings').select('*').eq('key', 'statement_settings').single();
      if (settingsRes && settingsRes.value) {
        setBrandingSettings((prev: any) => ({ ...prev, ...settingsRes.value }));
      }
    };
    loadSettings();
  }, [user]);

  // Rolling 12 months array
  const monthsList = useMemo(() => {
    const months = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
      const startDate = new Date(d.getFullYear(), d.getMonth(), 1);
      const endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      months.push({ label, startDate, endDate, offset: i });
    }
    return months;
  }, []);

  const activeMonth = monthsList[selectedMonthOffset];

  // Helper date formatter
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    
    let normalizedStr = dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      normalizedStr = `${dateStr}T12:00:00`;
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateStr)) {
      normalizedStr = `${dateStr}:00`;
    } else if (dateStr.endsWith('Z')) {
      normalizedStr = dateStr.slice(0, -1);
    }
    
    const d = new Date(normalizedStr);
    if (isNaN(d.getTime())) return dateStr;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const day = d.getDate();
    const year = d.getFullYear();
    
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${month} ${day}, ${year} • ${hours}:${minutes} ${ampm}`;
  };

  const processedData = useMemo(() => {
    if (accounts.length === 0 || !activeMonth) {
      return { filteredTxs: [], summary: { openingBalance: 0, closingBalance: 0, totalDeposits: 0, totalWithdrawals: 0 } };
    }

    const selectedAccId = selectedAccount === 'all' ? accounts[0]?.id : selectedAccount;
    const account = accounts.find(a => a.id === selectedAccId) || accounts[0];
    const workingBalance = Number(account?.current_balance || 0);

    const filtered = transactions.filter(tx => {
      if (selectedAccount !== 'all' && tx.account_id !== selectedAccId) return false;
      const txDate = new Date(tx.date);
      return txDate >= activeMonth.startDate && txDate <= activeMonth.endDate;
    });

    const totalDeposits = filtered.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
    const totalWithdrawals = filtered.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    // Dynamic reverse calculation of closing balance at end of statement month
    const txsAfterSelectedMonth = transactions.filter(tx => {
      if (selectedAccount !== 'all' && tx.account_id !== selectedAccId) return false;
      const txDate = new Date(tx.date);
      return txDate > activeMonth.endDate;
    });

    let closingBalance = workingBalance;
    txsAfterSelectedMonth.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'credit') {
        closingBalance -= amt;
      } else {
        closingBalance += amt;
      }
    });

    const openingBalance = Number((closingBalance - totalDeposits + totalWithdrawals).toFixed(2));

    // Sort transactions chronologically (oldest first) to compute running balance
    const sortedChronologically = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      // Stably fallback to created_at or id
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (timeA !== timeB) return timeA - timeB;
      return a.id.localeCompare(b.id);
    });

    let currentRunningBal = openingBalance;
    const computedTxs = sortedChronologically.map(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'credit') {
        currentRunningBal = Number((currentRunningBal + amt).toFixed(2));
      } else {
        currentRunningBal = Number((currentRunningBal - amt).toFixed(2));
      }
      return {
        ...tx,
        running_balance: currentRunningBal
      };
    });

    // Stably sort from newest to oldest for display/rendering
    const sortedNewestToOldest = [...computedTxs].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateB - dateA;
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return b.id.localeCompare(a.id);
    });

    return {
      filteredTxs: sortedNewestToOldest,
      summary: {
        openingBalance,
        closingBalance,
        totalDeposits,
        totalWithdrawals,
      }
    };
  }, [transactions, accounts, selectedAccount, activeMonth]);

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: brandingSettings.layoutOrientation === 'landscape' ? 'landscape' : 'portrait',
      format: brandingSettings.paperSize === 'letter' ? 'letter' : 'a4'
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Draw Watermark
    doc.saveGraphicsState();
    doc.setFontSize(16);
    doc.setTextColor(220, 225, 230);
    doc.setFont("helvetica", "bold");
    doc.text(brandingSettings.watermark || 'CONFIDENTIAL STATEMENT', pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
    doc.restoreGraphicsState();

    // Helper image safe drawing
    const addImageToDoc = (url: string, x: number, y: number, w: number, h: number) => {
      try {
        if (url && (url.startsWith('data:image/') || url.startsWith('http'))) {
          doc.addImage(url, 'PNG', x, y, w, h);
        }
      } catch (err) {
        console.warn("Failed to embed image inside PDF builder:", err);
      }
    };

    // Draw Bank Logo
    if (brandingSettings.logoUrl) {
      addImageToDoc(brandingSettings.logoUrl, 14, 12, 18, 18);
    }

    // Bank Header Information
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.setFont("times", "bold");
    doc.text(brandingSettings.bankName, brandingSettings.logoUrl ? 36 : 14, 20);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text([
      brandingSettings.bankWebsite,
      `Phone: ${brandingSettings.bankPhone}`,
      `Email: ${brandingSettings.bankEmail}`,
    ].filter(Boolean), brandingSettings.logoUrl ? 36 : 14, 25);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("ACCOUNT STATEMENT", pageWidth - 14, 20, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text([
      `Page: 1 of 1`
    ], pageWidth - 14, 26, { align: 'right' });

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 45, pageWidth - 14, 45);

    // Customer Detail and Account Row
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text("ACCOUNT STATEMENT FOR:", 14, 52);

    doc.setFont("helvetica", "normal");
    doc.text([
      `${user?.firstName} ${user?.lastName}`,
      customerAddress,
    ], 14, 58);

    const selectedAccId = selectedAccount === 'all' ? accounts[0]?.id : selectedAccount;
    const account = accounts.find(a => a.id === selectedAccId) || accounts[0];

    doc.setFont("helvetica", "bold");
    doc.text("ACCOUNT DETAILS:", 115, 52);

    const finalAccountNum = brandingSettings.accountNumber || account?.number || '********4582';
    const accountType = account?.type || 'Checking';
    const rPeriod = `${activeMonth.startDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} - ${activeMonth.endDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}`;
    const rDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

    const accountDetails = [
      ["Account Number", finalAccountNum],
      ["Routing Number", account?.routing || brandingSettings.routing || '121000248'],
      ["Statement Period", rPeriod],
      ["Statement Date", rDate],
      ["Account Type", accountType]
    ];

    let startY = 58;
    const rowHeight = 5.2; // Spaced out elegantly
    accountDetails.forEach(([label, val]) => {
      doc.setFont("helvetica", "bold");
      doc.text(label + ":", 115, startY);
      doc.setFont("helvetica", "normal");
      doc.text(val, 150, startY);
      startY += rowHeight;
    });

    // Summary Box
    doc.setDrawColor(203, 213, 225);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 76, pageWidth - 28, 28, 2, 2, 'FD');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text("Account Summary", 20, 83);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`Starting Balance: ${formatCurrency(processedData.summary.openingBalance)}`, 20, 91);
    doc.text(`Total Deposits/Credits: +${formatCurrency(processedData.summary.totalDeposits)}`, 20, 97);

    doc.text(`Total Withdrawals/Debits: -${formatCurrency(processedData.summary.totalWithdrawals)}`, 110, 91);
    doc.setFont("helvetica", "bold");
    doc.text(`Ending Balance: ${formatCurrency(processedData.summary.closingBalance)}`, 110, 97);

    // Transactions Table
    const tableData = processedData.filteredTxs.map(tx => [
      formatDate(tx.date),
      tx.description,
      tx.type === 'credit' ? `+${formatCurrency(tx.amount)}` : '',
      tx.type === 'debit' ? `-${formatCurrency(tx.amount)}` : '',
      formatCurrency(tx.running_balance)
    ]);

    // Convert hex color to RGB
    const hexToRgb = (hex: string) => {
      const match = hex.replace('#','').match(/.{1,2}/g);
      if (match) return [parseInt(match[0], 16), parseInt(match[1], 16), parseInt(match[2], 16)];
      return [30, 41, 59];
    };

    autoTable(doc, {
      startY: 112,
      head: [['Post Date', 'Description', 'Deposits/Credits', 'Withdrawals/Debits', 'Ending Balance']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: hexToRgb(brandingSettings.themeColor), textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 8, cellPadding: 3.5, textColor: [51, 65, 85] },
      columnStyles: {
        0: { cellWidth: 32 },
        1: { cellWidth: 63 },
        2: { cellWidth: 32, halign: 'right' },
        3: { cellWidth: 32, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    if (finalY < pageHeight - 45) {
      if (brandingSettings.signatureUrl) {
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.text("Authorized Signature", 14, finalY);
        addImageToDoc(brandingSettings.signatureUrl, 14, finalY + 2, 40, 10);
        doc.line(14, finalY + 14, 74, finalY + 14);
      }

      if (brandingSettings.sealUrl) {
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.text("Official Stamp", 110, finalY);
        addImageToDoc(brandingSettings.sealUrl, 110, finalY + 2, 16, 16);
      }
    }

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(brandingSettings.footerText, pageWidth / 2, pageHeight - 16, { align: 'center' });
    doc.text(brandingSettings.disclaimer, pageWidth / 2, pageHeight - 11, { align: 'center' });

    doc.save(`Statement_${activeMonth.label.replace(/ /g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <SectionHeading center={false} eyebrow="Records" title="Statement Generator" subtitle="Generate dynamic, high-fidelity PDF statements configured directly by the bank's system administrators." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <motion.div {...fadeUp}>
            <Card className="p-6">
              <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white mb-4">Statement Options</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Select Account</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 text-sm text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    value={selectedAccount} 
                    onChange={(e) => setSelectedAccount(e.target.value)}
                  >
                    {accounts.length > 0 && <option value="all">All Accounts</option>}
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>{acc.name} (...{acc.number.slice(-4)})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Statement Period</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 text-sm text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    value={selectedMonthOffset} 
                    onChange={(e) => setSelectedMonthOffset(Number(e.target.value))}
                  >
                    {monthsList.map((m) => (
                      <option key={m.offset} value={m.offset}>{m.label}</option>
                    ))}
                  </select>
                </div>

                <Button variant="primary" className="w-full py-3" onClick={generatePDF} disabled={accounts.length === 0}>
                  <Download className="w-4 h-4 mr-2" /> Download Statement PDF
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="p-4 border border-secondary-200 dark:border-secondary-800 text-center">
                <p className="text-xs font-bold text-secondary-400 uppercase">Starting Balance</p>
                <p className="text-lg font-bold text-primary-900 dark:text-white mt-1">{formatCurrency(processedData.summary.openingBalance)}</p>
              </Card>
              <Card className="p-4 border border-secondary-200 dark:border-secondary-800 text-center">
                <p className="text-xs font-bold text-secondary-400 uppercase">Deposits & Credits</p>
                <p className="text-lg font-bold text-success-600 dark:text-success-400 mt-1">+{formatCurrency(processedData.summary.totalDeposits)}</p>
              </Card>
              <Card className="p-4 border border-secondary-200 dark:border-secondary-800 text-center">
                <p className="text-xs font-bold text-secondary-400 uppercase">Ending Balance</p>
                <p className="text-lg font-bold text-primary-900 dark:text-white mt-1">{formatCurrency(processedData.summary.closingBalance)}</p>
              </Card>
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
            <Card className="overflow-hidden">
              <div className="p-4 bg-secondary-50 dark:bg-secondary-900/30 border-b border-secondary-200 dark:border-secondary-800">
                <h4 className="font-serif text-sm font-bold text-primary-900 dark:text-white">Statement Activity Review</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-50 dark:bg-primary-900/10">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Post Date</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-secondary-500 uppercase">Credits</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-secondary-500 uppercase">Debits</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-secondary-500 uppercase">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200 dark:divide-secondary-800">
                    {processedData.filteredTxs.map((tx) => (
                      <tr key={tx.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/30">
                        <td className="px-4 py-3 text-sm">{formatDate(tx.date)}</td>
                        <td className="px-4 py-3 text-sm text-primary-900 dark:text-white font-medium">{tx.description}</td>
                        <td className="px-4 py-3 text-sm text-right text-success-600 font-bold">{tx.type === 'credit' ? `+${formatCurrency(tx.amount)}` : ''}</td>
                        <td className="px-4 py-3 text-sm text-right text-error-600 font-bold">{tx.type === 'debit' ? `-${formatCurrency(tx.amount)}` : ''}</td>
                        <td className="px-4 py-3 text-sm text-right text-secondary-600 font-semibold">{formatCurrency(tx.running_balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {processedData.filteredTxs.length === 0 && (
                  <div className="p-8 text-center text-secondary-500 font-medium">No transactions reported for the selected account during this statement cycle.</div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
