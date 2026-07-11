import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownRight, MessageSquare, X, Building2, Globe2 } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { formatCurrency, type Account, type Transaction } from '../../data/demoData';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import { calculateAccountBalances } from '../../utils/calculations';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export function AccountsPage() {
  const { data: accounts } = useSupabaseData<Account>('accounts');
  const { data: transactions } = useSupabaseData<Transaction>('transactions');
  const [hidden, setHidden] = useState<Record<string, boolean>>({});
  const [showMsg, setShowMsg] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedAccountForDeposit, setSelectedAccountForDeposit] = useState<Account | undefined>(undefined);
  const navigate = useNavigate();

  const toggle = (id: string) => setHidden((p) => ({ ...p, [id]: !p[id] }));

  // Listen for custom event from Dashboard
  useEffect(() => {
    const handleOpenModal = () => setShowDepositModal(true);
    window.addEventListener('open-deposit-modal', handleOpenModal);
    return () => window.removeEventListener('open-deposit-modal', handleOpenModal);
  }, []);

  return (
    <div className="space-y-8 relative">
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
        {accounts.map((acc, i) => {
          const isHidden = hidden[acc.id];
          const accTx = transactions.filter(t => t.account_id === acc.id).slice(0, 3);
          const { current, pending, available } = calculateAccountBalances(acc, transactions);
          
          return (
            <motion.div key={acc.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.1 }}>
              <Card className="overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all" onClick={() => navigate(`/dashboard/accounts/${acc.id}`)}>
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
                      <p className="text-3xl font-bold">{formatCurrency(available)}</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Account Details */}
                  <div className="lg:col-span-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Account Number</span>
                        <button onClick={(e) => { e.stopPropagation(); toggle(acc.id); }} className="text-secondary-400 hover:text-primary-600 dark:hover:text-primary-300">
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
                      <div className="flex justify-between text-sm"><span className="text-secondary-500 dark:text-secondary-400">Current Balance</span><span className="font-semibold text-primary-900 dark:text-white">{formatCurrency(current)}</span></div>
                      <div className="flex justify-between text-sm"><span className="text-secondary-500 dark:text-secondary-400">Pending</span><span className="font-semibold text-primary-900 dark:text-white">{formatCurrency(pending)}</span></div>
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

      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-secondary-900 rounded-2xl shadow-2xl border border-secondary-200 dark:border-secondary-800"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-800">
              <h2 className="font-serif text-xl font-bold text-primary-900 dark:text-white">Deposit Instructions</h2>
              <button onClick={() => setShowDepositModal(false)} className="p-2 rounded-full hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">Select Account for Deposit</label>
                <select 
                  className="w-full px-4 py-2.5 rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedAccountForDeposit?.id || ''}
                  onChange={(e) => {
                    const acc = accounts.find(a => a.id === e.target.value);
                    setSelectedAccountForDeposit(acc);
                  }}
                >
                  <option value="">Select an account...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} - {acc.number}</option>
                  ))}
                </select>
              </div>

              {selectedAccountForDeposit && (
                <div className="space-y-6">
                  {/* ACH Deposit */}
                  <div className="p-5 rounded-xl bg-secondary-50 dark:bg-secondary-800/30 border border-secondary-200 dark:border-secondary-700">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      <h3 className="font-bold text-primary-900 dark:text-white">ACH Deposit</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-secondary-500 block mb-0.5">Bank Name</span><span className="font-medium">{(selectedAccountForDeposit as any).bank_name || 'Evercrest Bank'}</span></div>
                      <div><span className="text-secondary-500 block mb-0.5">Account Type</span><span className="font-medium">{selectedAccountForDeposit.type}</span></div>
                      <div><span className="text-secondary-500 block mb-0.5">Routing Number</span><span className="font-mono font-medium">{selectedAccountForDeposit.routing || (selectedAccountForDeposit as any).ach_routing || 'N/A'}</span></div>
                      <div><span className="text-secondary-500 block mb-0.5">Account Number</span><span className="font-mono font-medium">{selectedAccountForDeposit.number}</span></div>
                    </div>
                  </div>

                  {/* Domestic Wire */}
                  <div className="p-5 rounded-xl bg-secondary-50 dark:bg-secondary-800/30 border border-secondary-200 dark:border-secondary-700">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                      <h3 className="font-bold text-primary-900 dark:text-white">Domestic Wire</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-secondary-500 block mb-0.5">ABA Routing Number</span><span className="font-mono font-medium">{selectedAccountForDeposit.routing || 'N/A'}</span></div>
                      <div><span className="text-secondary-500 block mb-0.5">Wire Routing Number</span><span className="font-mono font-medium">{(selectedAccountForDeposit as any).wire_routing || 'N/A'}</span></div>
                      <div><span className="text-secondary-500 block mb-0.5">Account Number</span><span className="font-mono font-medium">{selectedAccountForDeposit.number}</span></div>
                      <div><span className="text-secondary-500 block mb-0.5">Beneficiary</span><span className="font-medium">{(selectedAccountForDeposit as any).beneficiary || 'N/A'}</span></div>
                    </div>
                  </div>

                  {/* International Wire */}
                  <div className="p-5 rounded-xl bg-secondary-50 dark:bg-secondary-800/30 border border-secondary-200 dark:border-secondary-700">
                    <div className="flex items-center gap-2 mb-4">
                      <Globe2 className="w-5 h-5 text-success-600 dark:text-success-400" />
                      <h3 className="font-bold text-primary-900 dark:text-white">International Wire</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-secondary-500 block mb-0.5">SWIFT Code</span><span className="font-mono font-medium">{(selectedAccountForDeposit as any).swift_code || 'N/A'}</span></div>
                      <div><span className="text-secondary-500 block mb-0.5">Bank Address</span><span className="font-medium">{(selectedAccountForDeposit as any).bank_address || 'N/A'}</span></div>
                      <div><span className="text-secondary-500 block mb-0.5">Beneficiary</span><span className="font-medium">{(selectedAccountForDeposit as any).beneficiary || 'N/A'}</span></div>
                      <div><span className="text-secondary-500 block mb-0.5">Country</span><span className="font-medium">United States</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
