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

  // Load customer accounts, transactions, and profile
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: cust } = await supabase.from('customers').select('*').eq('id', customerId).single();
      if (cust) setCustomer(cust);

      const { data: accs } = await supabase.from('accounts').select('*').eq('customer_id', customerId);
      if (accs) {
        setAccounts(accs);
        if (accs.length > 0) {
          const accIds = accs.map(a => a.id);
          const { data: txs } = await supabase.from('transactions').select('*').in('account_id', accIds);
          if (txs) setTransactions(txs);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [customerId]);

  // Generate rolling 12 months array
  const rollingMonths = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      list.push({
        offset: i,
        label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
        startDate: new Date(d.getFullYear(), d.getMonth(), 1),
        endDate: new Date(d.getFullYear(), d.getMonth() + 1, 0)
      });
    }
    return list;
  }, []);

  const activeMonth = rollingMonths[selectedMonthOffset] || rollingMonths[0];

  const processedData = useMemo(() => {
    if (accounts.length === 0) return { filteredTxs: [], summary: { openingBalance: 0, closingBalance: 0, totalDeposits: 0, totalWithdrawals: 0, netChange: 0, txCount: 0 } };

    const selectedAccId = selectedAccount === 'all' ? accounts[0]?.id : selectedAccount;
    const account = accounts.find(a => a.id === selectedAccId) || accounts[0];
    if (!account) return { filteredTxs: [], summary: { openingBalance: 0, closingBalance: 0, totalDeposits: 0, totalWithdrawals: 0, netChange: 0, txCount: 0 } };

    const accTxs = transactions
      .filter(tx => tx.account_id === selectedAccId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.id.localeCompare(a.id));

    let workingBalance = account.current_balance || 0;
    const txsWithBalances = accTxs.map(tx => {
      const balanceAfterTx = workingBalance;
      if (tx.type === 'credit') {
        workingBalance = parseFloat((workingBalance - tx.amount).toFixed(2));
      } else {
        workingBalance = parseFloat((workingBalance + tx.amount).toFixed(2));
      }
      return { ...tx, running_balance: balanceAfterTx };
    });

    const startLimit = activeMonth.startDate;
    const endLimit = activeMonth.endDate;

    const filtered = txsWithBalances.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate >= startLimit && txDate <= endLimit;
    });

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    filtered.forEach(tx => {
      if (tx.type === 'credit') totalDeposits += tx.amount;
      else totalWithdrawals += tx.amount;
    });

    let closingBalance = filtered.length > 0 ? filtered[0].running_balance : workingBalance;
    let openingBalance = filtered.length > 0 ? filtered[filtered.length - 1].running_balance - (filtered[filtered.length - 1].type === 'credit' ? filtered[filtered.length - 1].amount : -filtered[filtered.length - 1].amount) : workingBalance;

    return {
      filteredTxs: filtered,
      summary: {
        openingBalance: parseFloat(openingBalance.toFixed(2)),
        closingBalance: parseFloat(closingBalance.toFixed(2)),
        totalDeposits,
        totalWithdrawals,
        netChange: totalDeposits - totalWithdrawals,
        txCount: filtered.length
      }
    };
  }, [transactions, accounts, selectedAccount, activeMonth]);

  const generatePDF = () => {
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

    // Draw watermark
    doc.saveGraphicsState();
    doc.setFontSize(16);
    doc.setTextColor(220, 225, 230);
    doc.setFont("helvetica", "bold");
    doc.text(branding.watermark, pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });
    doc.restoreGraphicsState();

    // Bank Header
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.setFont("times", "bold");
    doc.text(branding.bankName, 14, 22);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text([
      branding.bankWebsite,
      `Phone: ${branding.bankPhone}`,
      `Email: ${branding.bankEmail}`,
      branding.swift ? `SWIFT: ${branding.swift}` : '',
      branding.iban ? `IBAN: ${branding.iban}` : ''
    ].filter(Boolean), 14, 28);

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

    doc.line(14, 45, pageWidth - 14, 45);

    // Customer
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text("PREPARED FOR:", 14, 52);

    doc.setFont("helvetica", "normal");
    doc.text([
      `${customer?.first_name} ${customer?.last_name}`,
      customer?.address || '500 Madison Avenue, New York, NY 10022',
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
      tx.date,
      tx.description,
      tx.type === 'credit' ? `+${formatCurrency(tx.amount)}` : '',
      tx.type === 'debit' ? `-${formatCurrency(tx.amount)}` : '',
      formatCurrency(tx.running_balance)
    ]).reverse();

    autoTable(doc, {
      startY: 112,
      head: [['Post Date', 'Description', 'Deposits/Credits', 'Withdrawals/Debits', 'Ending Balance']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      styles: { fontSize: 8, cellPadding: 3.5, textColor: [51, 65, 85] },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 70 },
        2: { cellWidth: 32, halign: 'right' },
        3: { cellWidth: 32, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
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

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(branding.footerText, pageWidth / 2, pageHeight - 16, { align: 'center' });
    doc.text(branding.disclaimer, pageWidth / 2, pageHeight - 11, { align: 'center' });

    doc.save(`Statement_${customer?.first_name}_${activeMonth.label.replace(/ /g, '_')}.pdf`);
  };

  if (loading) return <div className="text-secondary-500 py-6">Loading customer statements...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-primary-900 dark:text-white">Customer Statement Ledger</h2>
          <p className="text-sm text-secondary-500">Generate real-time rolling 12-month statements for this customer.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 space-y-4">
          <h3 className="font-bold text-md text-primary-900 dark:text-white">Branded PDF Generator</h3>
          <div>
            <label className="text-xs font-semibold text-secondary-500 block mb-1">Account</label>
            <select 
              className="w-full input-premium cursor-pointer"
              value={selectedAccount} 
              onChange={(e) => setSelectedAccount(e.target.value)}
            >
              {accounts.length > 0 && <option value="all">All Accounts</option>}
              {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.number})</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary-500 block mb-1">Select Month Period</label>
            <select 
              className="w-full input-premium cursor-pointer"
              value={selectedMonthOffset} 
              onChange={(e) => setSelectedMonthOffset(parseInt(e.target.value))}
            >
              {rollingMonths.map((m) => (
                <option key={m.offset} value={m.offset}>{m.label}</option>
              ))}
            </select>
          </div>

          <Button variant="primary" className="w-full justify-center" onClick={generatePDF}>
            <Download className="w-4 h-4 mr-2" /> Download Statement
          </Button>
        </Card>

        {/* Live Statement Metric Cards */}
        <Card className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-accent-500" />
              <h4 className="font-bold text-sm text-primary-900 dark:text-white">Period Overview</h4>
            </div>
            <p className="text-xs text-secondary-400 mb-4">{activeMonth.label} ({activeMonth.startDate.toLocaleDateString()} - {activeMonth.endDate.toLocaleDateString()})</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-secondary-50 dark:bg-secondary-900 p-2.5 rounded-lg">
                <span className="text-[10px] text-secondary-400 uppercase tracking-wider block">Opening Balance</span>
                <span className="text-sm font-bold text-primary-900 dark:text-white">{formatCurrency(processedData.summary.openingBalance)}</span>
              </div>
              <div className="bg-secondary-50 dark:bg-secondary-900 p-2.5 rounded-lg">
                <span className="text-[10px] text-secondary-400 uppercase tracking-wider block">Closing Balance</span>
                <span className="text-sm font-bold text-primary-900 dark:text-white">{formatCurrency(processedData.summary.closingBalance)}</span>
              </div>
              <div className="bg-success-500/5 p-2.5 rounded-lg">
                <span className="text-[10px] text-success-500 uppercase tracking-wider block">Credits</span>
                <span className="text-sm font-bold text-success-600 dark:text-success-400">+{formatCurrency(processedData.summary.totalDeposits)}</span>
              </div>
              <div className="bg-error-500/5 p-2.5 rounded-lg">
                <span className="text-[10px] text-error-500 uppercase tracking-wider block">Debits</span>
                <span className="text-sm font-bold text-error-600 dark:text-error-400">-{formatCurrency(processedData.summary.totalWithdrawals)}</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-secondary-400 mt-4 italic">Automatically updates whenever account transactions are modified, deleted, or backdated.</p>
        </Card>
      </div>
    </div>
  );
}
