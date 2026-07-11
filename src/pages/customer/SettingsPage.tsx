import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Moon, Sun, KeyRound, Clock, Activity, Fingerprint } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { supabaseCustomer as supabase } from '../../lib/supabase';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${on ? 'bg-accent-500' : 'bg-secondary-300 dark:bg-secondary-700'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? 'translate-x-6' : ''}`} />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-secondary-100 dark:border-secondary-800 last:border-0">
      <div>
        <p className="text-sm font-semibold text-primary-900 dark:text-white">{label}</p>
        {desc && <p className="text-xs text-secondary-500 dark:text-secondary-400">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingsPage() {
  const { theme, toggleMode } = useTheme();
  const { user } = useAuth();
  const [customerData, setCustomerData] = useState<any>(null);
  const [emailAlerts, setEmailAlerts] = useState(() => localStorage.getItem('emailAlerts') !== 'false');
  const [smsAlerts, setSmsAlerts] = useState(() => localStorage.getItem('smsAlerts') === 'true');
  const [txAlerts, setTxAlerts] = useState(() => localStorage.getItem('txAlerts') !== 'false');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      const { data } = await supabase.from('customers').select('*').eq('id', user.id).single();
      if (data) {
        setCustomerData(data);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <div className="space-y-8">
      <SectionHeading center={false} eyebrow="Configuration" title="Settings" subtitle="Manage your security, notifications, and preferences." />

      {/* Security settings */}
      <motion.div {...fadeUp}>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-success-100 dark:bg-success-800/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-success-700 dark:text-success-300" />
            </div>
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white">Account Security & Details</h3>
          </div>

          <div className="space-y-0">
            <SettingRow label="Login Email" desc="Registered account email identifier">
              <span className="text-sm font-mono text-primary-700 dark:text-primary-300 font-semibold">{user?.email}</span>
            </SettingRow>
            
            <SettingRow label="Login Status" desc="Current system security tier authorization">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                customerData?.status === 'Active' || !customerData?.status
                  ? 'bg-success-100 text-success-800 dark:bg-success-500/20 dark:text-success-400'
                  : 'bg-error-100 text-error-800 dark:bg-error-500/20 dark:text-error-400'
              }`}>
                {customerData?.status || 'Active'}
              </span>
            </SettingRow>

            <SettingRow label="Password Status" desc="Time of last credentials lifecycle modifications">
              <span className="text-sm font-medium text-primary-900 dark:text-white flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-secondary-400" /> Managed / Secure
              </span>
            </SettingRow>

            <SettingRow label="Two-Factor Authentication (2FA)" desc="Multi-factor token verification">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                customerData?.two_factor_enabled
                  ? 'bg-success-100 text-success-800 dark:bg-success-500/20 dark:text-success-400'
                  : 'bg-secondary-100 text-secondary-800 dark:bg-secondary-500/20 dark:text-secondary-400'
              }`}>
                {customerData?.two_factor_enabled ? 'Enabled' : 'Disabled'}
              </span>
            </SettingRow>

            <SettingRow label="Last Login" desc="Recent online authentication record">
              <span className="text-sm font-medium text-primary-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-secondary-400" /> Just Now
              </span>
            </SettingRow>

            <SettingRow label="Last Activity" desc="Last recorded database handshake connection">
              <span className="text-sm font-medium text-primary-900 dark:text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-secondary-400" /> Active Session
              </span>
            </SettingRow>
          </div>
        </Card>
      </motion.div>


      {/* Theme */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center">
              {theme.mode === 'dark' ? <Moon className="w-5 h-5 text-primary-700 dark:text-primary-300" /> : <Sun className="w-5 h-5 text-primary-700 dark:text-primary-300" />}
            </div>
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white">Theme</h3>
          </div>
          <SettingRow label="Dark Mode" desc="Switch between light and dark appearance"><Toggle on={theme.mode === 'dark'} onClick={toggleMode} /></SettingRow>
        </Card>
      </motion.div>
    </div>
  );
}
