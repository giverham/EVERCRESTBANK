import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownRight, MessageSquare } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { demoAccounts, demoTransactions, formatCurrency } from '../../data/demoData';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export function AccountsPage() {
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [showMsg, setShowMsg] = useState(false);

  const toggle = (id: string) => setHidden((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <SectionHeading
          center={false}
          eyebrow="Accounts"
          title="Your Accounts"
          subtitle="Manage and view details for all your Evercrest accounts."
        />
        <Button variant="accent" onClick={() => setShowMsg((s) => !s)}>
          <Plus className="w-4 h-4" /> Open New Account
        </Button>
      </div>

      {showMsg && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Card className="p-4 flex items-center gap-3 bg-accent-50 dark:bg-accent-500/10 border-accent-200 dark:border-accent-500/20">
            <MessageSquare className="w-5 h-5 text-accent-600 dark:text-accent-400 flex-shrink-0" />
            <p className="text-sm text-accent-700 dark:text-accent-300">
              To open a new account, please contact Evercrest Bank support at 1-800-EVERCREST or visit your nearest branch. Our team will guide you through the process.
            </p>
          </Card>
        </motion.div>
      )}

      <div className="space-y-6">
        {demoAccounts.map((acc, i) => {
          const isHidden = hidden[acc.id];
          const accTx = demoTransactions.slice(i * 3, i * 3 + 3);
          return (
            <motion.div key={acc.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
              <Card className="overflow-hidden">
                <div className="p-6 gradient-primary text-white">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="accent">{acc.type}</Badge>
                        <Badge variant="neutral" className="bg-white/10 text-white border border-white/20">{acc.currency}</Badge>
                      </div>
                      <h3 className="font-serif text-xl font-bold">{acc.name}</h3>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-secondary-200">Available Balance</p>
                      <p className="text-3xl font-bold">{formatCurrency(acc.availableBalance)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Account Details */}
                  <div className="lg:col-span-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Account Number</span>
                        <button onClick={() => toggle(acc.id)} className="text-secondary-400 hover:text-primary-600 dark:hover:text-primary-300">
                          {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="font-mono text-sm text-primary-900 dark:text-white">{isHidden ? '•••• •••• •••• ••••' : acc.number}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Routing Number</span>
                      <p className="font-mono text-sm text-primary-900 dark:text-white">{acc.routing}</p>
                    </div>
                    <div className="pt-4 border-t border-secondary-200 dark:border-secondary-800 space-y-2">
                      <div className="flex justify-between text-sm"><span className="text-secondary-500 dark:text-secondary-400">Current Balance</span><span className="font-semibold text-primary-900 dark:text-white">{formatCurrency(acc.currentBalance)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-secondary-500 dark:text-secondary-400">Pending</span><span className="font-semibold text-primary-900 dark:text-white">{formatCurrency(acc.pendingBalance)}</span></div>
                    </div>
                  </div>

                  {/* Mini Transaction List */}
                  <div className="lg:col-span-2">
                    <h4 className="text-sm font-bold text-primary-900 dark:text-white mb-3">Recent Activity</h4>
                    <div className="space-y-2">
                      {accTx.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary-50 dark:bg-secondary-800/50">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tx.type === 'credit' ? 'bg-success-50 dark:bg-success-500/15' : 'bg-error-50 dark:bg-error-500/15'}`}>
                              {tx.type === 'credit' ? <ArrowDownRight className="w-3.5 h-3.5 text-success-600 dark:text-success-500" /> : <ArrowUpRight className="w-3.5 h-3.5 text-error-600 dark:text-error-400" />}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-primary-900 dark:text-white">{tx.description}</p>
                              <p className="text-xs text-secondary-500 dark:text-secondary-400">{tx.date}</p>
                            </div>
                          </div>
                          <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-success-600 dark:text-success-500' : 'text-primary-900 dark:text-white'}`}>
                            {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
