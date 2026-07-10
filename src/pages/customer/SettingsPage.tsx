import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Bell, Globe, Moon, Sun } from 'lucide-react';
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

const inputClass = 'w-full px-4 py-2.5 rounded-xl border border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-900 text-primary-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500';

function SettingRow({ label, desc, children }: { label: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-secondary-100 dark:border-secondary-800 last:border-0">
      <div><p className="text-sm font-semibold text-primary-900 dark:text-white">{label}</p><p className="text-xs text-secondary-500 dark:text-secondary-400">{desc}</p></div>
      {children}
    </div>
  );
}

export function SettingsPage() {
  const { theme, toggleMode } = useTheme();
  const [twoFA, setTwoFA] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [txAlerts, setTxAlerts] = useState(true);
  const [language, setLanguage] = useState('English');
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="space-y-8">
      <SectionHeading center={false} eyebrow="Configuration" title="Settings" subtitle="Manage your security, notifications, and preferences." />

      {/* Security */}
      <motion.div {...fadeUp}>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center"><Lock className="w-5 h-5 text-primary-700 dark:text-primary-300" /></div>
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white">Security</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <div><label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Current Password</label><input type="password" placeholder="••••••••" className={inputClass} /></div>
            <div><label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">New Password</label><input type="password" placeholder="Enter new password" className={inputClass} /></div>
          </div>
          <SettingRow label="Two-Factor Authentication" desc="Add an extra layer of security to your account"><Toggle on={twoFA} onClick={() => setTwoFA(!twoFA)} /></SettingRow>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent-100 dark:bg-accent-500/15 flex items-center justify-center"><Bell className="w-5 h-5 text-accent-600 dark:text-accent-400" /></div>
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white">Notifications</h3>
          </div>
          <SettingRow label="Email Alerts" desc="Receive account notifications via email"><Toggle on={emailAlerts} onClick={() => setEmailAlerts(!emailAlerts)} /></SettingRow>
          <SettingRow label="SMS Alerts" desc="Receive transaction alerts via text message"><Toggle on={smsAlerts} onClick={() => setSmsAlerts(!smsAlerts)} /></SettingRow>
          <SettingRow label="Transaction Alerts" desc="Get notified for every transaction"><Toggle on={txAlerts} onClick={() => setTxAlerts(!txAlerts)} /></SettingRow>
        </Card>
      </motion.div>

      {/* Preferences */}
      <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.2 }}>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-800/40 flex items-center justify-center"><Globe className="w-5 h-5 text-primary-700 dark:text-primary-300" /></div>
            <h3 className="font-serif text-lg font-bold text-primary-900 dark:text-white">Preferences</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={inputClass}>
                <option>English</option><option>Spanish</option><option>French</option><option>German</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-secondary-600 dark:text-secondary-400 mb-1.5 block">Currency</label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
                <option value="USD">USD - US Dollar</option><option value="EUR">EUR - Euro</option><option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>
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
