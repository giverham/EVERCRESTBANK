import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Calendar, CreditCard, Shield } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500';

export function ProfilePage() {
  const { user } = useAuth();

  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '(212) 555-0142',
    address: '742 Evergreen Terrace, New York, NY 10001',
  });

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <SectionHeading center={false} eyebrow="Account" title="My Profile" subtitle="Manage your personal information and account details." />

      {/* Profile Header */}
      <motion.div {...fadeUp}>
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200'}
              alt="Avatar"
              className="w-24 h-24 rounded-2xl object-cover ring-4 ring-accent-500/20"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="font-serif text-2xl font-bold text-primary-900 dark:text-white">{user?.firstName} {user?.lastName}</h2>
              <p className="text-secondary-500 dark:text-secondary-400 flex items-center justify-center sm:justify-start gap-1.5 mt-1"><Mail className="w-4 h-4" />{user?.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <Badge variant="primary"><Shield className="w-3 h-3" /> Verified</Badge>
                <Badge variant="accent">Premium Customer</Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account Metadata */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Calendar, label: 'Member Since', value: 'March 2019' },
            { icon: CreditCard, label: 'Account Type', value: user?.accountType || 'Premium Checking' },
            { icon: User, label: 'Customer ID', value: user?.id || 'cus-001' },
          ].map((item) => (
            <Card key={item.label} className="p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary-700 dark:text-primary-300" />
              </div>
              <div><p className="text-xs text-secondary-500 dark:text-secondary-400">{item.label}</p><p className="text-sm font-semibold text-primary-900 dark:text-white">{item.value}</p></div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Editable Form */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
        <Card className="p-6">
          <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white mb-6">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">First Name</label>
              <input value={form.firstName} onChange={(e) => handleChange('firstName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Last Name</label>
              <input value={form.lastName} onChange={(e) => handleChange('lastName', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Email</label>
              <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Phone</label>
              <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Address</label>
              <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary" onClick={() => {}}><Save className="w-4 h-4" /> Save Changes</Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
