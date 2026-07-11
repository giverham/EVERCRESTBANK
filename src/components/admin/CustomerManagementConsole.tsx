import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabaseAdmin as supabase } from '../../lib/supabase';
import { 
  User, Wallet, CreditCard, ArrowLeftRight, FileText, Bell, 
  BarChart3, Settings, ShieldCheck, X
} from 'lucide-react';

// Tab Components
import { ProfileTab } from './tabs/ProfileTab';
import { AccountsTab } from './tabs/AccountsTab';
import { CardsTab } from './tabs/CardsTab';
import { TransactionsTab } from './tabs/TransactionsTab';
import { StatementsTab } from './tabs/StatementsTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { SettingsTab } from './tabs/SettingsTab';

interface CustomerManagementConsoleProps {
  customerId: string;
  onClose: () => void;
}

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'accounts', label: 'Accounts', icon: Wallet },
  { id: 'cards', label: 'Cards', icon: CreditCard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'statements', label: 'Statements', icon: FileText },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function CustomerManagementConsole({ customerId, onClose }: CustomerManagementConsoleProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', customerId)
      .single();
      
    if (!error && data) {
      setCustomer(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCustomer();
  }, [customerId]);

  if (loading) return <div className="p-8 text-center text-secondary-500">Loading customer profile...</div>;
  if (!customer) return <div className="p-8 text-center text-error-500">Customer not found.</div>;

  const renderTab = () => {
    switch (activeTab) {
      case 'profile': return <ProfileTab customer={customer} onUpdate={fetchCustomer} />;
      case 'accounts': return <AccountsTab customerId={customerId} />;
      case 'cards': return <CardsTab customerId={customerId} />;
      case 'transactions': return <TransactionsTab customerId={customerId} />;
      case 'statements': return <StatementsTab customerId={customerId} />;
      case 'notifications': return <NotificationsTab customerId={customerId} />;
      case 'analytics': return <AnalyticsTab customerId={customerId} />;
      case 'settings': return <SettingsTab customerId={customerId} />;
      default: return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-secondary-50 dark:bg-secondary-950 lg:pl-[5rem] xl:pl-64 transition-all">
      {/* Header */}
      <header className="flex-none bg-white dark:bg-primary-950 border-b border-secondary-200 dark:border-secondary-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 text-secondary-500"
          >
            <X className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-primary-900 dark:text-white">
              {customer.first_name} {customer.last_name}
            </h1>
            <p className="text-sm text-secondary-500">{customer.email}</p>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-64 flex-none border-r border-secondary-200 dark:border-secondary-800 bg-white dark:bg-primary-900/20 overflow-y-auto p-4 space-y-1 hidden md:block">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-accent-50 text-accent-700 dark:bg-accent-500/10 dark:text-accent-400' 
                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-secondary-50 dark:bg-secondary-950">
          {/* Mobile Tabs Dropdown */}
          <div className="md:hidden mb-4">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full input-premium bg-white dark:bg-primary-900"
            >
              {tabs.map(tab => (
                <option key={tab.id} value={tab.id}>{tab.label}</option>
              ))}
            </select>
          </div>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
