import { useState, useMemo, useEffect } from 'react';
import { supabaseAdmin as supabase } from '../../../lib/supabase';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Download, Layers } from 'lucide-react';
import { formatCurrency } from '../../../data/demoData';
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
}

export function StatementsTab({ customerId }: { customerId: string }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('all');
  const [selectedMonthOffset, setSelectedMonthOffset] = useState<number>(0);
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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

  // Load customer accounts, transactions, profile, and branding settings
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [custRes, accsRes, settingsRes] = await Promise.all([
        supabase.from('customers').select('*').eq('id', customerId).single(),
        supabase.from('accounts').select('*').eq('customer_id', customerId),
        supabase.from('settings').select('*').eq('key', 'statement_settings').single()
      ]);

      if (custRes.data) setCustomer(custRes.data);
      if (settingsRes.data && settingsRes.data.value) {
        setBrandingSettings({ ...brandingSettings, ...settingsRes.data.value });
      }

      if (accsRes.data) {
        setAccounts(accsRes.data);
        if (accsRes.data.length > 0) {
          const accIds = accsRes.data.map(a => a.id);
          const { data: txs } = await supabase.from('transactions').select('*').in('account_id', accIds);
          if (txs) setTransactions(txs);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [customerId]);

  // Generate rolling 12 months array
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
      if (selectedAccount !== 'all' && tx.account_id !== selectedAccount) return false;
      const txDate = new Date(tx.date);
      return txDate >= activeMonth.startDate && txDate <= activeMonth.endDate;
    });

    const totalDeposits = filtered.filter(tx => tx.type === 'credit').reduce((sum, tx) => sum + Number(tx.amount), 0);
    const totalWithdrawals = filtered.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + Number(tx.amount), 0);

    let openingBalance = filtered.length > 0 ? filtered[filtered.length - 1].running_balance - (filtered[filtered.length - 1].type === 'credit' ? filtered[filtered.length - 1].amount : -filtered[filtered.length - 1].amount) : workingBalance;
    let closingBalance = workingBalance;

    return {
      filteredTxs: filtered,
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

    // Watermark Opacity and Drawing
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
      `${customer?.first_name} ${customer?.last_name}`,
      customer?.address || '500 Madison Avenue, New York, NY 10022',
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
    ]).reverse();

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

    doc.save(`Statement_${customer?.first_name}_${activeMonth.label.replace(/ /g, '_')}.pdf`);
  };

  if (loading) return <div className="text-secondary-500 py-6">Loading customer statements...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900 dark:text-white font-serif">Official Statements</h2>
          <p className="text-sm text-secondary-500 mt-1">Select account and month to generate and review dynamic secure PDF records.</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="input-premium py-1.5 text-xs max-w-[180px]"
          >
            <option value="all">All Accounts</option>
            {accounts.map(acc => (
              <option key={acc.id} value={acc.id}>{acc.name} (...{acc.number.slice(-4)})</option>
            ))}
          </select>
          <select
            value={selectedMonthOffset}
            onChange={(e) => setSelectedMonthOffset(Number(e.target.value))}
            className="input-premium py-1.5 text-xs max-w-[180px]"
          >
            {monthsList.map((m) => (
              <option key={m.offset} value={m.offset}>{m.label}</option>
            ))}
          </select>
          <Button variant="primary" size="sm" onClick={generatePDF}>
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-5 md:col-span-1 border border-secondary-200 dark:border-secondary-800 text-center">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mx-auto mb-2 text-primary-700 dark:text-primary-300">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-secondary-400 uppercase">Starting Balance</p>
          <p className="text-xl font-bold text-primary-900 dark:text-white mt-1">{formatCurrency(processedData.summary.openingBalance)}</p>
        </Card>
        <Card className="p-5 md:col-span-1 border border-secondary-200 dark:border-secondary-800 text-center">
          <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900/40 flex items-center justify-center mx-auto mb-2 text-success-700 dark:text-success-300">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-secondary-400 uppercase">Total Deposits</p>
          <p className="text-xl font-bold text-success-600 dark:text-success-400 mt-1">+{formatCurrency(processedData.summary.totalDeposits)}</p>
        </Card>
        <Card className="p-5 md:col-span-1 border border-secondary-200 dark:border-secondary-800 text-center">
          <div className="w-10 h-10 rounded-lg bg-error-100 dark:bg-error-900/40 flex items-center justify-center mx-auto mb-2 text-error-700 dark:text-error-300">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-secondary-400 uppercase">Total Withdrawals</p>
          <p className="text-xl font-bold text-error-600 dark:text-error-400 mt-1">-{formatCurrency(processedData.summary.totalWithdrawals)}</p>
        </Card>
        <Card className="p-5 md:col-span-1 border border-secondary-200 dark:border-secondary-800 text-center">
          <div className="w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-900/40 flex items-center justify-center mx-auto mb-2 text-accent-700 dark:text-accent-300">
            <Layers className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-secondary-400 uppercase">Ending Balance</p>
          <p className="text-xl font-bold text-primary-900 dark:text-white mt-1">{formatCurrency(processedData.summary.closingBalance)}</p>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-primary-50 dark:bg-primary-900/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Post Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-secondary-500 uppercase">Description</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-secondary-500 uppercase">Credits</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-secondary-500 uppercase">Debits</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-secondary-500 uppercase">Running Balance</th>
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
      </Card>
    </div>
  );
}
