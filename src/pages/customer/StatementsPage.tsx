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

// Type definitions to keep TypeScript happy
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

  // Load custom address from Profile localStorage if exists
  useEffect(() => {
    if (user?.id) {
      const saved = localStorage.getItem('profile_' + user.id);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.address) setCustomerAddress(parsed.address);
        } catch (e) { }
      } else {
        // Fallback or fetch from DB
        const fetchCust = async () => {
          const { data } = await supabase.from('customers').select('address').eq('id', user.id).single();
          if (data?.address) setCustomerAddress(data.address);
        };
        fetchCust();
      }
    }
  }, [user]);

  // Generate 12 months rolling array (e.g. July 2026, June 2026)
  const rollingMonths = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      list.push({
        offset: i,
        label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
        month: d.getMonth(),
        year: d.getFullYear(),
        startDate: new Date(d.getFullYear(), d.getMonth(), 1),
        endDate: new Date(d.getFullYear(), d.getMonth() + 1, 0)
      });
    }
    return list;
  }, []);

  const activeMonth = rollingMonths[selectedMonthOffset] || rollingMonths[0];

  // Compute transactions with perfect running balances
  const processedData = useMemo(() => {
    if (accounts.length === 0) return { filteredTxs: [], summary: { openingBalance: 0, closingBalance: 0, totalDeposits: 0, totalWithdrawals: 0, netChange: 0, txCount: 0 } };

    const selectedAccId = selectedAccount === 'all' ? accounts[0]?.id : selectedAccount;
    const account = accounts.find(a => a.id === selectedAccId) || accounts[0];
    if (!account) return { filteredTxs: [], summary: { openingBalance: 0, closingBalance: 0, totalDeposits: 0, totalWithdrawals: 0, netChange: 0, txCount: 0 } };

    // Get all transactions for this specific account, sorted chronologically descending
    const accTxs = transactions
      .filter(tx => tx.account_id === selectedAccId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.id.localeCompare(a.id));

    // Calculate exact running balances working backward from the account's current balance
    let workingBalance = account.current_balance || 0;
    const txsWithBalances = accTxs.map(tx => {
      const balanceAfterTx = workingBalance;
      // Adjust working balance backward
      if (tx.type === 'credit') {
        workingBalance = parseFloat((workingBalance - tx.amount).toFixed(2));
      } else {
        workingBalance = parseFloat((workingBalance + tx.amount).toFixed(2));
      }
      return {
        ...tx,
        running_balance: balanceAfterTx
      };
    });

    // Filter transactions to just the selected month
    const startLimit = activeMonth.startDate;
    const endLimit = activeMonth.endDate;

    const filtered = txsWithBalances.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startLimit && txDate <= endLimit;
    });

    // Compute month-specific summary details
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    filtered.forEach(tx => {
      if (tx.type === 'credit') totalDeposits += tx.amount;
      else totalWithdrawals += tx.amount;
    });

    // Opening Balance is the running balance BEFORE the earliest transaction in this month,
    // or if no transactions, it's just the calculated working balance at the end of the previous month.
    let closingBalance = filtered.length > 0 ? filtered[0].running_balance : workingBalance;
    let openingBalance = filtered.length > 0 ? filtered[filtered.length - 1].running_balance - (filtered[filtered.length - 1].type === 'credit' ? filtered[filtered.length - 1].amount : -filtered[filtered.length - 1].amount) : workingBalance;

    openingBalance = parseFloat(openingBalance.toFixed(2));
    closingBalance = parseFloat(closingBalance.toFixed(2));

    return {
      filteredTxs: filtered,
      summary: {
        openingBalance,
        closingBalance,
        totalDeposits,
        totalWithdrawals,
        netChange: totalDeposits - totalWithdrawals,
        txCount: filtered.length
      }
    };
  }, [transactions, accounts, selectedAccount, activeMonth]);

  const generatePDF = () => {
    // Load branding settings from localStorage or fallback
    const savedSettings = localStorage.getItem('statement_settings');
    const branding = savedSettings ? JSON.parse(savedSettings) : {
      bankName: 'Everest Bank',
      bankWebsite: 'www.everestbank.com',
      bankPhone: '1-800-555-0199',
      bankEmail: 'support@everestbank.com',
      iban: 'US89 EVER 1234 5678 9012 34',
      swift: 'EVERUS33',
      logoUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=150&h=150&q=80',
      sealUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=150&h=150&q=80',
      signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Signature_of_John_Hancock.svg',
      footerText: 'Member FDIC. Equal Housing Lender. This statement is computer generated.',
      disclaimer: 'Please report any discrepancies within 60 days.',
      watermark: 'EVEREST BANK OFFICIAL ACCOUNT STATEMENT CONFIDENTIAL',
    };

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Load watermark across all pages
    const drawWatermark = () => {
      doc.saveGraphicsState();
      doc.setFontSize(16);
      doc.setTextColor(220, 225, 230);
      doc.setFont("helvetica", "bold");
      
      // Draw diagonal watermark text
      doc.text(branding.watermark, pageWidth / 2, pageHeight / 2, {
        align: 'center',
        angle: 45
      });
      doc.restoreGraphicsState();
    };

    drawWatermark();

    // 1. Bank Header & Info
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59); // Sleek slate color
    doc.setFont("times", "bold");
    doc.text(branding.bankName, 14, 22);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text([
      branding.bankWebsite,
      `Phone: ${branding.bankPhone}`,
      `Email: ${branding.bankEmail}`,
      branding.swift ? `SWIFT/BIC: ${branding.swift}` : '',
      branding.iban ? `IBAN: ${branding.iban}` : ''
    ].filter(Boolean), 14, 28);

    // Document type / Meta right-aligned
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("ACCOUNT STATEMENT", pageWidth - 14, 22, { align: 'right' });

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text([
      `Statement Period: ${activeMonth.startDate.toLocaleDateString()} - ${activeMonth.endDate.toLocaleDateString()}`,
      `Generation Date: ${new Date().toLocaleDateString()}`,
      `Page: 1 of 1`
    ], pageWidth - 14, 28, { align: 'right' });

    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 45, pageWidth - 14, 45);

    // 2. Customer Profile and Account Info
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text("PREPARED FOR:", 14, 52);

    doc.setFont("helvetica", "normal");
    doc.text([
      `${user?.firstName} ${user?.lastName}`,
      customerAddress,
    ], 14, 58);

    const selectedAccId = selectedAccount === 'all' ? accounts[0]?.id : selectedAccount;
    const account = accounts.find(a => a.id === selectedAccId) || accounts[0];

    doc.setFont("helvetica", "bold");
    doc.text("ACCOUNT DETAILS:", pageWidth - 14, 52, { align: 'right' });

    doc.setFont("helvetica", "normal");
    doc.text([
      `Account Name: ${account?.name || 'Primary Checking'}`,
      `Account Number: ${account?.number || 'N/A'}`,
      `Routing Number: ${account?.routing || 'N/A'}`,
    ], pageWidth - 14, 58, { align: 'right' });

    // 3. Summary Box
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

    // 4. Transactions Table
    const tableData = processedData.filteredTxs.map(tx => [
      tx.date,
      tx.description,
      tx.type === 'credit' ? `+${formatCurrency(tx.amount)}` : '',
      tx.type === 'debit' ? `-${formatCurrency(tx.amount)}` : '',
      formatCurrency(tx.running_balance)
    ]).reverse(); // Reverse so chronologically ascending

    autoTable(doc, {
      startY: 112,
      head: [['Post Date', 'Description', 'Deposits/Credits', 'Withdrawals/Debits', 'Ending Balance']],
      body: tableData,
      theme: 'grid',
      headStyles: { 
        fillColor: [30, 41, 59], 
        textColor: 255, 
        fontStyle: 'bold',
        fontSize: 8.5
      },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { 
        fontSize: 8, 
        cellPadding: 3.5,
        textColor: [51, 65, 85]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 70 },
        2: { cellWidth: 32, halign: 'right' },
        3: { cellWidth: 32, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      }
    });

    // 5. Signature and Footers
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    
    // Draw Signature Image Placeholders
    if (finalY < pageHeight - 45) {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.text("Authorized Signature", 14, finalY);
      doc.line(14, finalY + 14, 74, finalY + 14);

      doc.text("Official Stamp", 110, finalY);
      doc.rect(110, finalY + 2, 25, 12);
      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.text("OFFICIAL SEAL", 112, finalY + 9);
    }

    // Fixed Footers at bottom of page
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    
    doc.text(branding.footerText, pageWidth / 2, pageHeight - 16, { align: 'center' });
    doc.text(branding.disclaimer, pageWidth / 2, pageHeight - 11, { align: 'center' });

    doc.save(`Statement_${activeMonth.label.replace(/ /g, '_')}.pdf`);
  };

  return (
    <div className="space-y-8">
      <SectionHeading center={false} eyebrow="Records" title="Statement Generator" subtitle="Generate official PDF statements for your accounts." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Filters & Generator */}
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
                    {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.number})</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Select Month</label>
                  <select 
                    className="w-full px-4 py-2.5 rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 text-sm text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                    value={selectedMonthOffset} 
                    onChange={(e) => setSelectedMonthOffset(parseInt(e.target.value))}
                  >
                    {rollingMonths.map((m) => (
                      <option key={m.offset} value={m.offset}>{m.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-secondary-100 dark:border-secondary-800">
                <Button variant="primary" className="w-full justify-center" onClick={generatePDF}>
                  <Download className="w-4 h-4 mr-2" /> Download Statement (PDF)
                </Button>
              </div>
            </Card>
          </motion.div>
          
          {/* Quick List 12 Months */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <Card className="p-6">
              <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white mb-4">Rolling Statement History</h3>
              <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                 {rollingMonths.map((m) => {
                   const isActive = selectedMonthOffset === m.offset;
                   return (
                     <button 
                       key={m.offset}
                       onClick={() => setSelectedMonthOffset(m.offset)}
                       className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors text-left ${
                         isActive 
                           ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20' 
                           : 'hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                       }`}
                     >
                       <span className="text-sm font-medium">{m.label}</span>
                       <FileText className="w-4 h-4 text-secondary-400" />
                     </button>
                   )
                 })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Right Column: Statement Preview Summary */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
            <Card className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Layers className="w-32 h-32" />
              </div>

              <div className="relative z-10">
                <div className="mb-8">
                  <h3 className="font-serif text-2xl font-bold text-primary-900 dark:text-white">Monthly Statement Preview</h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                    {activeMonth.label} • {activeMonth.startDate.toLocaleDateString()} to {activeMonth.endDate.toLocaleDateString()}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/30">
                    <p className="text-xs text-secondary-500 uppercase tracking-wider font-semibold mb-1">Starting Balance</p>
                    <p className="text-xl font-bold text-primary-900 dark:text-white">{formatCurrency(processedData.summary.openingBalance)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20">
                    <p className="text-xs text-primary-600 dark:text-primary-400 uppercase tracking-wider font-semibold mb-1">Ending Balance</p>
                    <p className="text-xl font-bold text-primary-900 dark:text-white">{formatCurrency(processedData.summary.closingBalance)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-success-50 dark:bg-success-500/10">
                    <p className="text-xs text-success-600 uppercase tracking-wider font-semibold mb-1">Deposits / Credits</p>
                    <p className="text-lg font-bold text-success-700 dark:text-success-500">+{formatCurrency(processedData.summary.totalDeposits)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-error-50 dark:bg-error-500/10">
                    <p className="text-xs text-error-600 uppercase tracking-wider font-semibold mb-1">Withdrawals / Debits</p>
                    <p className="text-lg font-bold text-error-700 dark:text-error-500">-{formatCurrency(processedData.summary.totalWithdrawals)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-primary-900 dark:text-white mb-3">Transactions Ledger ({processedData.summary.txCount})</h4>
                  <div className="max-h-[350px] overflow-y-auto pr-2 space-y-2">
                    {processedData.filteredTxs.map(tx => (
                      <div key={tx.id} className="flex justify-between items-center p-3 rounded-xl border border-secondary-100 dark:border-secondary-800 bg-white dark:bg-secondary-900/50">
                        <div>
                          <p className="text-sm font-semibold text-primary-900 dark:text-white">{tx.description}</p>
                          <p className="text-xs text-secondary-500">{tx.date}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-bold block ${tx.type === 'credit' ? 'text-success-600 dark:text-success-500' : 'text-primary-900 dark:text-white'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                          <span className="text-[10px] text-secondary-400 block">Bal: {formatCurrency(tx.running_balance)}</span>
                        </div>
                      </div>
                    ))}
                    {processedData.filteredTxs.length === 0 && (
                      <div className="text-center py-12 text-secondary-500">
                        No transactions found for this month period.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
