import { motion } from 'framer-motion';
import { Download, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { demoStatements, formatCurrency } from '../../data/demoData';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

export function StatementsPage() {
  const totalDeposits = demoStatements.reduce((s, st) => s + st.totalDeposits, 0);
  const totalWithdrawals = demoStatements.reduce((s, st) => s + st.totalWithdrawals, 0);

  return (
    <div className="space-y-8">
      <SectionHeading center={false} eyebrow="Records" title="Statements" subtitle="Download your monthly account statements." />

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <motion.div {...fadeUp}>
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success-50 dark:bg-success-500/15 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-success-600 dark:text-success-500" />
            </div>
            <div><p className="text-sm text-secondary-500 dark:text-secondary-400">Total Deposits</p><p className="text-2xl font-bold text-primary-900 dark:text-white">{formatCurrency(totalDeposits)}</p></div>
          </Card>
        </motion.div>
        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
          <Card className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-error-50 dark:bg-error-500/15 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-error-600 dark:text-error-400" />
            </div>
            <div><p className="text-sm text-secondary-500 dark:text-secondary-400">Total Withdrawals</p><p className="text-2xl font-bold text-primary-900 dark:text-white">{formatCurrency(totalWithdrawals)}</p></div>
          </Card>
        </motion.div>
      </div>

      {/* Desktop Table */}
      <motion.div {...fadeUp} className="hidden md:block">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-secondary-50 dark:bg-secondary-800/50">
              <tr>
                {['Period', 'Date', 'Opening Balance', 'Closing Balance', 'Deposits', 'Withdrawals', ''].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {demoStatements.map((st) => (
                <tr key={st.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/30 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-accent-500" /><span className="text-sm font-semibold text-primary-900 dark:text-white">{st.period}</span></div></td>
                  <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-400">{st.date}</td>
                  <td className="px-6 py-4 text-sm text-primary-900 dark:text-white">{formatCurrency(st.openingBalance)}</td>
                  <td className="px-6 py-4 text-sm text-primary-900 dark:text-white">{formatCurrency(st.closingBalance)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-success-600 dark:text-success-500">{formatCurrency(st.totalDeposits)}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-error-600 dark:text-error-400">{formatCurrency(st.totalWithdrawals)}</td>
                  <td className="px-6 py-4"><Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {demoStatements.map((st, i) => (
          <motion.div key={st.id} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.05 }}>
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent-500" />
                  <div>
                    <p className="text-sm font-bold text-primary-900 dark:text-white">{st.period}</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">{st.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-secondary-500 dark:text-secondary-400">Opening</p><p className="font-semibold text-primary-900 dark:text-white">{formatCurrency(st.openingBalance)}</p></div>
                <div><p className="text-xs text-secondary-500 dark:text-secondary-400">Closing</p><p className="font-semibold text-primary-900 dark:text-white">{formatCurrency(st.closingBalance)}</p></div>
                <div><p className="text-xs text-secondary-500 dark:text-secondary-400">Deposits</p><p className="font-semibold text-success-600 dark:text-success-500">{formatCurrency(st.totalDeposits)}</p></div>
                <div><p className="text-xs text-secondary-500 dark:text-secondary-400">Withdrawals</p><p className="font-semibold text-error-600 dark:text-error-400">{formatCurrency(st.totalWithdrawals)}</p></div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
