import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Bell, Moon, Sun } from 'lucide-react';
import { Card, SectionHeading } from '../../components/ui/Card';
import { useTheme } from '../../context/ThemeContext';

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
  const [emailAlerts, setEmailAlerts] = useState(() => localStorage.getItem('emailAlerts') !== 'false');
  const [smsAlerts, setSmsAlerts] = useState(() => localStorage.getItem('smsAlerts') === 'true');
  const [txAlerts, setTxAlerts] = useState(() => localStorage.getItem('txAlerts') !== 'false');

  return (
    <div className="space-y-8">
      <SectionHeading center={false} eyebrow="Configuration" title="Settings" subtitle="Manage your security, notifications, and preferences." />

      {/* Security */}
      <motion.div {...fadeUp}>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-success-100 dark:bg-success-800/40 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-success-700 dark:text-success-300" />
            </div>
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white">Online Banking Security</h3>
          </div>
          
          <div className="p-4 bg-primary-50 dark:bg-primary-500/10 rounded-xl mb-6 border border-primary-100 dark:border-primary-500/20">
            <p className="text-sm font-semibold text-primary-900 dark:text-white mb-2">
              For your protection, password changes cannot be completed through Online Banking.
            </p>
            <p className="text-sm text-secondary-600 dark:text-secondary-400">
              To update your password or account credentials, please contact Customer Support or visit a local branch. This account is protected by Evercrest Bank security policies.
            </p>
          </div>

          <div className="space-y-0">
            <SettingRow label="Two-Factor Authentication">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-500/20 dark:text-success-400">
                Enabled
              </span>
            </SettingRow>
            <SettingRow label="Last Login">
              <span className="text-sm font-medium text-primary-900 dark:text-white">Recent</span>
            </SettingRow>
            <SettingRow label="Trusted Device Status">
              <span className="text-sm font-medium text-primary-900 dark:text-white">Verified</span>
            </SettingRow>
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-500/15 flex items-center justify-center"><Bell className="w-5 h-5 text-accent-600 dark:text-accent-400" /></div>
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white">Notifications</h3>
          </div>
          <SettingRow label="Email Alerts" desc="Receive account notifications via email"><Toggle on={emailAlerts} onClick={() => { const v = !emailAlerts; setEmailAlerts(v); localStorage.setItem('emailAlerts', v.toString()); }} /></SettingRow>
          <SettingRow label="SMS Alerts" desc="Receive transaction alerts via text message"><Toggle on={smsAlerts} onClick={() => { const v = !smsAlerts; setSmsAlerts(v); localStorage.setItem('smsAlerts', v.toString()); }} /></SettingRow>
          <SettingRow label="Transaction Alerts" desc="Get notified for every transaction"><Toggle on={txAlerts} onClick={() => { const v = !txAlerts; setTxAlerts(v); localStorage.setItem('txAlerts', v.toString()); }} /></SettingRow>
        </Card>
      </motion.div>



      {/* Theme */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }}>
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
