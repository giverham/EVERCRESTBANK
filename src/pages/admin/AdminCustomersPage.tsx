import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, Edit, Users, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

import { useAuth } from '../../context/AuthContext';
import { CustomerManagementConsole } from '../../components/admin/CustomerManagementConsole';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};



const statusVariant = { Active: 'success', Suspended: 'error', Pending: 'warning' } as const;

export function AdminCustomersPage() {
  const { supabaseClient: supabase } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  
  // To avoid reloading the entire page list constantly if not needed, we can just use supabase query directly,
  // but for a dashboard with 2 users, useSupabaseData is fine. However we need to override the user filter.
  // We'll write a custom fetch for admin to see ALL customers.
  const [customers, setCustomers] = useState<any[]>([]);
  const [, setLoading] = useState(true);

  const fetchCustomers = async () => {
    const { data } = await supabase.from('customers').select('*');
    if (data) setCustomers(data);
    setLoading(false);
  };

  useState(() => {
    fetchCustomers();
  });

  const handleDelete = async (customer: any) => {
    if (customer.id === '22222222-2222-2222-2222-222222222222' || customer.id === '11111111-1111-1111-1111-111111111111') {
      alert('Protected system account. This account cannot be deleted.');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete ${customer.first_name}?`)) {
      const { error } = await supabase.from('customers').delete().eq('id', customer.id);
      if (error) {
        alert(error.message || 'Protected system account. This account cannot be deleted.');
      } else {
        fetchCustomers();
      }
    }
  };

  const filtered = customers.filter((c) => {
    const fullName = `${c.first_name} ${c.last_name}`;
    const matchSearch = fullName.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (editingCustomerId) {
    return <CustomerManagementConsole customerId={editingCustomerId} onClose={() => { setEditingCustomerId(null); fetchCustomers(); }} />;
  }

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
                      <img src={c.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-primary-900 dark:text-white text-sm">{c.first_name} {c.last_name}</p>
                        <p className="text-xs text-secondary-400">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-300">{c.account_type || 'Checking'}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary-900 dark:text-white">-</td>
                  <td className="px-6 py-4"><Badge variant={statusVariant[c.status as keyof typeof statusVariant] || 'success'}>{c.status || 'Active'}</Badge></td>
                  <td className="px-6 py-4 text-sm text-secondary-500">{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingCustomerId(c.id)} className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30" title="View"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => setEditingCustomerId(c.id)} className="p-2 rounded-lg text-accent-600 hover:bg-accent-50 dark:hover:bg-accent-900/30" title="Edit"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(c)} className="p-2 rounded-lg text-error-500 hover:bg-error-50 dark:hover:bg-error-500/10" title="Delete"><Trash2 className="w-4 h-4" /></button>
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
                <img src={c.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100'} alt="" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-primary-900 dark:text-white">{c.first_name} {c.last_name}</p>
                  <p className="text-xs text-secondary-400">{c.email}</p>
                </div>
                <Badge variant={statusVariant[c.status as keyof typeof statusVariant] || 'success'}>{c.status || 'Active'}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div><p className="text-xs text-secondary-400">Account Type</p><p className="font-medium text-secondary-700 dark:text-secondary-300">{c.account_type || 'Checking'}</p></div>
                <div><p className="text-xs text-secondary-400">Joined</p><p className="font-medium text-secondary-700 dark:text-secondary-300">{new Date(c.created_at).toLocaleDateString()}</p></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" onClick={() => setEditingCustomerId(c.id)} className="flex-1"><Eye className="w-4 h-4" /> View</Button>
                <Button size="sm" variant="secondary" onClick={() => setEditingCustomerId(c.id)} className="flex-1"><Edit className="w-4 h-4" /> Edit</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(c)} className="flex-1"><Trash2 className="w-4 h-4" /> Delete</Button>
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
