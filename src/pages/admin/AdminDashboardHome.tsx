import { motion } from 'framer-motion';
import {
  Users, Landmark, Wallet, TrendingUp, Activity, Server, Database,
  ShieldCheck, Zap, ArrowRight, Eye, UserPlus, FileText, Bell,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { LinkButton } from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const stats = [
  { label: 'Total Customers', value: '2.4M', icon: Users, trend: '+12.5%', color: 'text-primary-600' },
  { label: 'Total Assets', value: '$48B', icon: Landmark, trend: '+8.2%', color: 'text-accent-600' },
  { label: 'Active Accounts', value: '1.8M', icon: Wallet, trend: '+5.7%', color: 'text-success-600' },
  { label: 'Monthly Revenue', value: '$12.4M', icon: TrendingUp, trend: '+15.3%', color: 'text-primary-600' },
];

const revenueData = [
  { month: 'Apr', value: 65 }, { month: 'May', value: 72 }, { month: 'Jun', value: 58 },
  { month: 'Jul', value: 85 }, { month: 'Aug', value: 78 }, { month: 'Sep', value: 94 },
];

const activities = [
  { user: 'Victoria Sterling', action: 'approved a loan application', time: '2 min ago', type: 'loan' },
  { user: 'James Chen', action: 'suspended account #4827', time: '15 min ago', type: 'suspend' },
  { user: 'Sarah Mitchell', action: 'updated CMS hero banner', time: '1 hour ago', type: 'cms' },
  { user: 'System', action: 'completed nightly backup', time: '2 hours ago', type: 'system' },
  { user: 'Emily Roberts', action: 'reviewed 12 transactions', time: '3 hours ago', type: 'review' },
];

const systemStatus = [
  { label: 'API Gateway', status: 'Operational', icon: Server, color: 'success' },
  { label: 'Database', status: 'Operational', icon: Database, color: 'success' },
  { label: 'Auth Service', status: 'Operational', icon: ShieldCheck, color: 'success' },
  { label: 'Payment Processor', status: 'Degraded', icon: Zap, color: 'warning' },
];

const quickActions = [
  { label: 'Add Customer', icon: UserPlus, href: '/admin/customers' },
  { label: 'View Reports', icon: FileText, href: '/admin/reports' },
  { label: 'Send Notification', icon: Bell, href: '/admin/notifications' },
  { label: 'Audit Logs', icon: Eye, href: '/admin/audit-logs' },
];

export function AdminDashboardHome() {
  return (
    <div className="space-y-6">
      <motion.div {...fadeUp}>
        <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white mb-1">Dashboard Overview</h1>
        <p className="text-secondary-500 dark:text-secondary-400">Welcome back to the Evercrest Bank admin console.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.08 }}>
            <Card className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <Badge variant="success">{stat.trend}</Badge>
              </div>
              <p className="text-3xl font-bold text-primary-900 dark:text-white">{stat.value}</p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div {...fadeUp} className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-primary-900 dark:text-white">Revenue Overview</h3>
                <p className="text-sm text-secondary-500">Last 6 months performance</p>
              </div>
              <Badge variant="accent"><TrendingUp className="w-3.5 h-3.5" /> +15.3%</Badge>
            </div>
            <div className="flex items-end justify-between gap-4 h-56">
              {revenueData.map((d, i) => (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: `${d.value}%` }}
                      transition={{ duration: 0.6, delay: i * 0.1 }}
                      className={`w-full rounded-t-lg ${d.value > 85 ? 'bg-accent-500' : 'bg-primary-700 dark:bg-primary-500'}`}
                    />
                  </div>
                  <span className="text-xs text-secondary-500 font-medium">{d.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* System Status */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-4">System Status</h3>
            <div className="space-y-3">
              {systemStatus.map((s) => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl bg-secondary-50 dark:bg-secondary-800/50">
                  <div className="flex items-center gap-3">
                    <s.icon className="w-5 h-5 text-secondary-500" />
                    <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">{s.label}</span>
                  </div>
                  <Badge variant={s.color as 'success' | 'warning'}>
                    <span className={`w-2 h-2 rounded-full ${s.color === 'success' ? 'bg-success-500' : 'bg-warning-500'} animate-pulse`} />
                    {s.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Feed */}
        <motion.div {...fadeUp} className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-accent-500" />
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Recent Activity</h3>
            </div>
            <div className="space-y-1">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary-700 dark:text-primary-300">{a.user.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-secondary-700 dark:text-secondary-300"><span className="font-semibold">{a.user}</span> {a.action}</p>
                    <p className="text-xs text-secondary-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((a) => (
                <Link key={a.label} to={a.href} className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors group">
                  <a.icon className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-semibold text-secondary-700 dark:text-secondary-300 text-center">{a.label}</span>
                </Link>
              ))}
            </div>
            <LinkButton to="/admin/reports" variant="accent" size="md" className="w-full mt-4">
              View Full Reports <ArrowRight className="w-4 h-4" />
            </LinkButton>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
