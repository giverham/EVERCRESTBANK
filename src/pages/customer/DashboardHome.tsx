import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight, ArrowDownRight, Send, Download, FileText, Calendar,
} from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency } from '../../data/demoData';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import type { Account, Transaction, UpcomingPayment } from '../../data/demoData';
import { calculateAccountBalances } from '../../utils/calculations';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const quickActions = [
  { label: 'Transfer', icon: Send, to: '/dashboard/transactions?action=transfer' },
  { label: 'Deposit', icon: Download, to: '/dashboard/accounts?action=deposit' },
  { label: 'Statements', icon: FileText, to: '/dashboard/statements' },
];


export function DashboardHome() {
  const navigate = useNavigate();
  const { data: accounts } = useSupabaseData<Account>('accounts');
  const { data: transactions } = useSupabaseData<Transaction>('transactions');
  const { data: upcomingPayments } = useSupabaseData<UpcomingPayment>('upcoming_payments');

  const recentTx = transactions.slice(0, 5);

  const calcMonthlySpending = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const data = Array.from({ length: 6 }).map((_, i) => {
      let m = currentMonth - 5 + i;
      if (m < 0) m += 12;
      return { month: months[m], amount: 0, index: m };
    });

    transactions.forEach(tx => {
      if (tx.type === 'debit') {
        const txDate = new Date((tx.created_at || tx.date) as string);
        const match = data.find(d => d.index === txDate.getMonth());
        if (match) match.amount += Number(tx.amount);
      }
    });
    return data;
  };

  const calcSpendingByCategory = () => {
    const cats: Record<string, { amount: number, color: string }> = {
      'Shopping': { amount: 0, color: '#0ea5e9' },
      'Groceries': { amount: 0, color: '#f59e0b' },
      'Dining': { amount: 0, color: '#10b981' },
      'Transport': { amount: 0, color: '#8b5cf6' },
      'Utilities': { amount: 0, color: '#6366f1' },
      'Other': { amount: 0, color: '#64748b' }
    };

    transactions.forEach(tx => {
      if (tx.type === 'debit') {
        const c = cats[tx.category] ? tx.category : 'Other';
        cats[c].amount += Number(tx.amount);
      }
    });

    return Object.entries(cats)
      .map(([category, val]) => ({ category, ...val }))
      .filter(c => c.amount > 0)
      .sort((a, b) => b.amount - a.amount);
  };

  const monthlySpending = calcMonthlySpending();
  const spendingByCategory = calcSpendingByCategory();
  const maxSpend = Math.max(...monthlySpending.map((m) => m.amount), 1);
  const maxCat = Math.max(...spendingByCategory.map((c) => c.amount), 1);

  return (
    <div className="space-y-8">
      <SectionHeading
        center={false}
        eyebrow="Overview"
        title="Dashboard"
        subtitle="A snapshot of your finances at a glance."
      />

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((acc, i) => {
          const { current, pending, available } = calculateAccountBalances(acc, transactions);
          return (
          <motion.div key={acc.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
            <Card className="p-6 h-full">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">{acc.type}</p>
                  <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white mt-1">{acc.name}</h3>
                </div>
                <Badge variant="primary">{acc.currency}</Badge>
              </div>
              <p className="text-3xl font-bold text-primary-900 dark:text-white">{formatCurrency(available)}</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">Available Balance</p>
              <div className="mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-800 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-secondary-500 dark:text-secondary-400">Current</span><span className="font-semibold text-primary-900 dark:text-white">{formatCurrency(current)}</span></div>
                <div className="flex justify-between"><span className="text-secondary-500 dark:text-secondary-400">Pending</span><span className="font-semibold text-primary-900 dark:text-white">{formatCurrency(pending)}</span></div>
                <div className="flex justify-between"><span className="text-secondary-500 dark:text-secondary-400">Account</span><span className="font-mono text-xs text-primary-700 dark:text-primary-300">{acc.number}</span></div>
                <div className="flex justify-between"><span className="text-secondary-500 dark:text-secondary-400">Routing</span><span className="font-mono text-xs text-primary-700 dark:text-primary-300">{acc.routing}</span></div>
              </div>
            </Card>
          </motion.div>
        )})}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-4">
        {quickActions.map((qa, i) => (
          <motion.div key={qa.label} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}>
            {qa.to.startsWith('#') ? (
               <Card hover className="p-5 text-center cursor-pointer" onClick={() => {
                 if (qa.label === 'Deposit') {
                   const evt = new CustomEvent('open-deposit-modal');
                   window.dispatchEvent(evt);
                 }
               }}>
                 <div className="w-12 h-12 mx-auto rounded-xl bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center mb-3">
                   <qa.icon className="w-6 h-6 text-primary-700 dark:text-primary-300" />
                 </div>
                 <p className="font-semibold text-primary-900 dark:text-white text-sm">{qa.label}</p>
               </Card>
            ) : (
               <Card hover className="p-0 text-center cursor-pointer" onClick={() => navigate(qa.to)}>
                 <div className="p-5">
                   <div className="w-12 h-12 mx-auto rounded-xl bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center mb-3">
                     <qa.icon className="w-6 h-6 text-primary-700 dark:text-primary-300" />
                   </div>
                   <p className="font-semibold text-primary-900 dark:text-white text-sm">{qa.label}</p>
                 </div>
               </Card>
            )}
          </motion.div>
        ))}
      </div>

      {/* Spending + Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...fadeUp}>
          <Card className="p-6 h-full">
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white mb-6">Monthly Spending</h3>
            {monthlySpending.reduce((a, b) => a + b.amount, 0) > 0 ? (
              <div className="flex items-end justify-between gap-3 h-48">
                {monthlySpending.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end h-full">
                      <div
                        className="w-full rounded-t-lg gradient-accent transition-all duration-500"
                        style={{ height: `${(m.amount / maxSpend) * 100}%` }}
                        title={formatCurrency(m.amount)}
                      />
                    </div>
                    <span className="text-xs text-secondary-500 dark:text-secondary-400 font-medium">{m.month}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex items-center justify-center text-secondary-400">No spending data available.</div>
            )}
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <Card className="p-6 h-full">
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white mb-6">Spending by Category</h3>
            <div className="space-y-4">
              {spendingByCategory.length > 0 ? spendingByCategory.map((c) => (
                <div key={c.category}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-primary-900 dark:text-white">{c.category}</span>
                    <span className="text-secondary-500 dark:text-secondary-400">{formatCurrency(c.amount)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary-100 dark:bg-secondary-800 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(c.amount / maxCat) * 100}%`, background: c.color }} />
                  </div>
                </div>
              )) : (
                <div className="flex items-center justify-center text-secondary-400 py-10">No category data available.</div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Transactions + Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div {...fadeUp}>
          <Card className="p-6">
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white mb-4">Recent Transactions</h3>
            <div className="space-y-3">
              {recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-2 border-b border-secondary-100 dark:border-secondary-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === 'credit' ? 'bg-success-50 dark:bg-success-500/15' : 'bg-error-50 dark:bg-error-500/15'}`}>
                      {tx.type === 'credit' ? <ArrowDownRight className="w-4 h-4 text-success-600 dark:text-success-500" /> : <ArrowUpRight className="w-4 h-4 text-error-600 dark:text-error-400" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-900 dark:text-white">{tx.description}</p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">{tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-success-600 dark:text-success-500' : 'text-primary-900 dark:text-white'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <Card className="p-6">
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white mb-4">Upcoming Payments</h3>
            <div className="space-y-3">
              {upcomingPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-secondary-100 dark:border-secondary-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent-100 dark:bg-accent-500/15 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-900 dark:text-white">{p.name}</p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Due {p.due_date || p.dueDate} · {p.category}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary-900 dark:text-white">{formatCurrency(p.amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
