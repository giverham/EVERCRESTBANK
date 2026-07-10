import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, Ban, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

interface Customer {
  id: string; name: string; email: string; accountType: string; balance: string; status: 'Active' | 'Suspended' | 'Pending'; joinDate: string; avatar: string;
}

const customers: Customer[] = [
  { id: '1', name: 'Alexander Hayes', email: 'alex.hayes@email.com', accountType: 'Premium Checking', balance: '$148,250.00', status: 'Active', joinDate: '2023-01-15', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '2', name: 'Sophia Laurent', email: 'sophia.l@email.com', accountType: 'Business Savings', balance: '$2,840,000.00', status: 'Active', joinDate: '2022-11-03', avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '3', name: 'Marcus Whitfield', email: 'm.whitfield@email.com', accountType: 'Premium Checking', balance: '$56,780.00', status: 'Pending', joinDate: '2024-03-22', avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '4', name: 'Isabella Romano', email: 'bella.romano@email.com', accountType: 'Wealth Management', balance: '$5,420,000.00', status: 'Active', joinDate: '2021-06-14', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '5', name: 'James Donovan', email: 'j.donovan@email.com', accountType: 'Business Checking', balance: '$320,500.00', status: 'Suspended', joinDate: '2023-09-08', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '6', name: 'Charlotte Beaumont', email: 'c.beaumont@email.com', accountType: 'Premium Savings', balance: '$890,200.00', status: 'Active', joinDate: '2022-04-19', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '7', name: 'Nathaniel Sterling', email: 'n.sterling@email.com', accountType: 'Wealth Management', balance: '$12,800,000.00', status: 'Active', joinDate: '2020-02-11', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100' },
  { id: '8', name: 'Olivia Marchetti', email: 'o.marchetti@email.com', accountType: 'Personal Checking', balance: '$24,300.00', status: 'Pending', joinDate: '2024-05-01', avatar: 'https://images.pexels.com/photos/1844012/pexels-photo-1844012.jpeg?auto=compress&cs=tinysrgb&w=100' },
];

const statusVariant = { Active: 'success', Suspended: 'error', Pending: 'warning' } as const;

export function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = customers.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp}>
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-7 h-7 text-accent-500" />
          <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white">Customer Management</h1>
        </div>
        <p className="text-secondary-500 dark:text-secondary-400">Manage and monitor all bank customers.</p>
      </motion.div>

      {/* Filters */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}>
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text" placeholder="Search by name or email..." value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-premium pl-11"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400 pointer-events-none" />
              <select
                value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                className="input-premium pl-11 pr-8 appearance-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Desktop Table */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }} className="hidden lg:block">
        <Card className="overflow-hidden">
          <table className="w-full">
            <thead className="bg-primary-50 dark:bg-primary-900/30 border-b border-secondary-200 dark:border-secondary-700">
              <tr>
                {['Customer', 'Account Type', 'Balance', 'Status', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={c.avatar} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-primary-900 dark:text-white text-sm">{c.name}</p>
                        <p className="text-xs text-secondary-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{c.accountType}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary-900 dark:text-white">{c.balance}</td>
                  <td className="px-6 py-4"><Badge variant={statusVariant[c.status]}>{c.status}</Badge></td>
                  <td className="px-6 py-4 text-sm text-secondary-500">{c.joinDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30" title="View"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/30" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10" title="Suspend"><Ban className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </motion.div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filtered.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <Card className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <img src={c.avatar} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-primary-900 dark:text-white">{c.name}</p>
                  <p className="text-xs text-secondary-400">{c.email}</p>
                </div>
                <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div><p className="text-xs text-secondary-400">Account Type</p><p className="font-medium text-secondary-700 dark:text-secondary-300">{c.accountType}</p></div>
                <div><p className="text-xs text-secondary-400">Balance</p><p className="font-bold text-primary-900 dark:text-white">{c.balance}</p></div>
                <div><p className="text-xs text-secondary-400">Joined</p><p className="font-medium text-secondary-700 dark:text-secondary-300">{c.joinDate}</p></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" className="flex-1"><Eye className="w-4 h-4" /> View</Button>
                <Button size="sm" variant="secondary" className="flex-1"><Edit className="w-4 h-4" /> Edit</Button>
                <Button size="sm" variant="danger" className="flex-1"><Ban className="w-4 h-4" /> Suspend</Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-secondary-500">Showing {filtered.length} of {customers.length} customers</p>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" disabled><ChevronLeft className="w-4 h-4" /> Prev</Button>
          <Button size="sm" variant="secondary" disabled>Next <ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}
