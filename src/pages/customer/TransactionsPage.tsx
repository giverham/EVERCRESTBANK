import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { demoTransactions, formatCurrency } from '../../data/demoData';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const categories = ['All', 'Groceries', 'Income', 'Transport', 'Entertainment', 'Transfer', 'Shopping', 'Utilities', 'Dining'];

export function TransactionsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    return demoTransactions.filter((tx) => {
      const matchSearch = tx.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === 'All' || tx.category === category;
      const matchType = type === 'all' || tx.type === type;
      const matchStatus = status === 'all' || tx.status === status;
      return matchSearch && matchCat && matchType && matchStatus;
    });
  }, [search, category, type, status]);

  const totalDebits = demoTransactions.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const totalCredits = demoTransactions.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0);

  const selectClass = 'px-3 py-2 rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 text-sm text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500';

  return (
    <div className="space-y-8">
      <SectionHeading center={false} eyebrow="Activity" title="Transactions" subtitle="Search and filter your full transaction history." />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div {...fadeUp}>
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-error-50 dark:bg-error-500/15 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-error-600 dark:text-error-400" />
            </div>
            <div><p className="text-sm text-secondary-500 dark:text-secondary-400">Total Debits</p><p className="text-2xl font-bold text-primary-900 dark:text-white">{formatCurrency(totalDebits)}</p></div>
          </Card>
        </motion.div>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success-50 dark:bg-success-500/15 flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-success-600 dark:text-success-500" />
            </div>
            <div><p className="text-sm text-secondary-500 dark:text-secondary-400">Total Credits</p><p className="text-2xl font-bold text-primary-900 dark:text-white">{formatCurrency(totalCredits)}</p></div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div {...fadeUp}>
        <Card className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search description..." className="w-full pl-10 pr-3 py-2 rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 text-sm text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
              {categories.map((c) => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
              <option value="all">All Types</option><option value="debit">Debit</option><option value="credit">Credit</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
              <option value="all">All Statuses</option><option value="completed">Completed</option><option value="pending">Pending</option>
            </select>
          </div>
        </Card>
      </motion.div>

      {/* Desktop Table */}
      <motion.div {...fadeUp} className="hidden md:block">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary-50 dark:bg-secondary-800/50">
              <tr>
                {['Date', 'Description', 'Category', 'Type', 'Amount', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-400">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-primary-900 dark:text-white">{tx.description}</td>
                  <td className="px-6 py-4"><Badge variant="neutral">{tx.category}</Badge></td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-sm font-medium ${tx.type === 'credit' ? 'text-success-600 dark:text-success-500' : 'text-error-600 dark:text-error-400'}`}>
                      {tx.type === 'credit' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}{tx.type}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-bold ${tx.type === 'credit' ? 'text-success-600 dark:text-success-500' : 'text-primary-900 dark:text-white'}`}>{tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}</td>
                  <td className="px-6 py-4"><Badge variant={tx.status === 'completed' ? 'success' : 'warning'}>{tx.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {filtered.map((tx, i) => (
          <motion.div key={tx.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.03 }}>
            <Card className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === 'credit' ? 'bg-success-50 dark:bg-success-500/15' : 'bg-error-50 dark:bg-error-500/15'}`}>
                    {tx.type === 'credit' ? <ArrowDownRight className="w-4 h-4 text-success-600 dark:text-success-500" /> : <ArrowUpRight className="w-4 h-4 text-error-600 dark:text-error-400" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary-900 dark:text-white">{tx.description}</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{tx.date} · {tx.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-success-600 dark:text-success-500' : 'text-primary-900 dark:text-white'}`}>{tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}</span>
              </div>
              <div className="flex items-center gap-2"><Badge variant={tx.status === 'completed' ? 'success' : 'warning'}>{tx.status}</Badge></div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-secondary-500 dark:text-secondary-400 flex flex-col items-center gap-2">
          <Filter className="w-8 h-8" /><p>No transactions match your filters.</p>
        </div>
      )}
    </div>
  );
}
