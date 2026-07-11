import { useParams, Link } from 'react-router-dom';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import type { Account, Transaction } from '../../data/demoData';
import { calculateAccountBalances } from '../../utils/calculations';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { formatCurrency, formatTransactionDate } from '../../data/demoData';
import { ArrowLeft, Send, Download, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export function AccountDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: accounts } = useSupabaseData<Account>('accounts');
  const { data: transactions } = useSupabaseData<Transaction>('transactions');

  const account = accounts.find(a => a.id === id);
  const accountTxs = transactions.filter(t => t.account_id === id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!account) return <div className="p-8 text-center text-secondary-500">Loading account details...</div>;

  const { current, pending, available } = calculateAccountBalances(account, transactions);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/dashboard/accounts" className="inline-flex items-center text-sm font-medium text-secondary-500 hover:text-primary-600 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Accounts
      </Link>

      <Card className="overflow-hidden">
        <div className="p-8 gradient-primary text-white">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="accent">{account.type}</Badge>
                <Badge variant="neutral" className="bg-white/10 text-white border border-white/20">{account.currency}</Badge>
              </div>
              <h1 className="font-serif text-3xl font-bold">{account.name}</h1>
              <p className="mt-2 text-white/80 font-mono">Account ending in {account.number.slice(-4)}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-sm text-secondary-200 mb-1">Available Balance</p>
              <p className="text-4xl font-bold">{formatCurrency(available)}</p>
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-secondary-200 dark:border-secondary-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">Current Balance</p>
            <p className="text-xl font-bold text-primary-900 dark:text-white">{formatCurrency(current)}</p>
          </div>
          <div>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">Pending Activity</p>
            <p className="text-xl font-bold text-primary-900 dark:text-white">{formatCurrency(pending)}</p>
          </div>
          <div>
            <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">Routing Number</p>
            <p className="text-xl font-mono text-primary-900 dark:text-white">{account.routing}</p>
          </div>
        </div>
        
        <div className="p-8 bg-secondary-50 dark:bg-secondary-900/20">
          <div className="flex flex-wrap gap-4">
            <Link to={`/dashboard/transactions?tab=transfer&account=${account.id}`} className="btn-primary flex items-center gap-2">
              <Send className="w-4 h-4" /> Transfer
            </Link>
            <Link to="/dashboard/statements" className="btn-secondary flex items-center gap-2">
              <FileText className="w-4 h-4" /> Statements
            </Link>
          </div>
        </div>
      </Card>

      <h2 className="text-xl font-bold text-primary-900 dark:text-white mt-8 mb-4">Transaction History</h2>
      
      <Card className="overflow-hidden">
        {accountTxs.length > 0 ? (
          <div className="divide-y divide-secondary-200 dark:divide-secondary-800">
            {accountTxs.map((tx, i) => (
              <motion.div 
                key={tx.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 flex items-center justify-between hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-success-100 text-success-600' : 'bg-secondary-100 text-secondary-600 dark:bg-secondary-800 dark:text-secondary-300'}`}>
                    {tx.type === 'credit' ? <Download className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-primary-900 dark:text-white">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-secondary-500">{formatTransactionDate(tx.date)}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300">
                        {tx.category}
                      </span>
                      {tx.status?.toLowerCase() === 'pending' ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-warning-100 text-warning-700 font-semibold">Pending</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-500 font-semibold">Completed</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className={`text-right font-bold ${tx.type === 'credit' ? 'text-success-600 dark:text-success-400' : 'text-primary-900 dark:text-white'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-secondary-500">No transactions found for this account.</div>
        )}
      </Card>
    </div>
  );
}
