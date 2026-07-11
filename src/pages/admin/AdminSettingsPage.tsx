import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, ShieldCheck, Mail, Key, Save, Check, Building2, Lock, Clock, Eye, EyeOff, Copy, FileText,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { siteConfig } from '../../config/siteConfig';
import { useWebsite } from '../../context/WebsiteContext';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const labelClass = 'block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1.5';

export function AdminSettingsPage() {
  const { theme, toggleMode } = useTheme();
  const { settings, updateSettings } = useWebsite();

  const [bankName, setBankName] = useState(siteConfig.bankName);
  const [tagline, setTagline] = useState(siteConfig.tagline);
  const [foundedYear, setFoundedYear] = useState('1987');
  const [twoFA, setTwoFA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [passwordPolicy, setPasswordPolicy] = useState('strict');
  const [smtpHost, setSmtpHost] = useState('smtp.evercrestbank.com');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('noreply@evercrestbank.com');
  const [smtpPass, setSmtpPass] = useState('••••••••••••');
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);

  // Footer Settings State
  const [copyrightLine, setCopyrightLine] = useState('');
  const [fdicDisclaimerLine, setFdicDisclaimerLine] = useState('');
  const [depositInsuranceLine, setDepositInsuranceLine] = useState('');

  useEffect(() => {
    if (settings) {
      setBankName(settings.bankName || '');
      setTagline(settings.tagline || '');
      setCopyrightLine(settings.copyrightLine || '');
      setFdicDisclaimerLine(settings.fdicDisclaimerLine || '');
      setDepositInsuranceLine(settings.depositInsuranceLine || '');
    }
  }, [settings]);

  const handleSave = async () => {
    setSaved(true);
    await updateSettings({
      bankName,
      tagline,
      copyrightLine,
      fdicDisclaimerLine,
      depositInsuranceLine,
    });
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div {...fadeUp} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Settings className="w-7 h-7 text-accent-500" />
            <h1 className="text-3xl font-serif font-bold text-primary-900 dark:text-white">General Settings</h1>
          </div>
          <p className="text-secondary-500 dark:text-secondary-400">Configure your banking platform.</p>
        </div>
        <Button variant="accent" onClick={handleSave}>
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Changes</>}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bank Information */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.05 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Bank Information</h3>
            </div>
            <div className="space-y-4">
              <div><label className={labelClass}>Bank Name</label><input className="input-premium" value={bankName} onChange={(e) => setBankName(e.target.value)} /></div>
              <div><label className={labelClass}>Tagline</label><input className="input-premium" value={tagline} onChange={(e) => setTagline(e.target.value)} /></div>
              <div><label className={labelClass}>Founded Year</label><input className="input-premium" value={foundedYear} onChange={(e) => setFoundedYear(e.target.value)} /></div>
            </div>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.1 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Security Settings</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-secondary-50 dark:bg-secondary-800/50">
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-secondary-400" />
                  <div><p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Require 2FA</p><p className="text-xs text-secondary-400">Force two-factor for all admins</p></div>
                </div>
                <button onClick={() => setTwoFA(!twoFA)} className={`relative w-12 h-6 rounded-full transition-colors ${twoFA ? 'bg-accent-500' : 'bg-secondary-300'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${twoFA ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div>
                <label className={labelClass}><Clock className="w-4 h-4 inline mr-1" /> Session Timeout (minutes)</label>
                <input type="number" className="input-premium" value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} />
              </div>
              <div>
                <label className={labelClass}>Password Policy</label>
                <select className="input-premium cursor-pointer" value={passwordPolicy} onChange={(e) => setPasswordPolicy(e.target.value)}>
                  <option value="strict">Strict (16+ chars, symbols, numbers)</option>
                  <option value="standard">Standard (12+ chars, mixed)</option>
                  <option value="basic">Basic (8+ chars)</option>
                </select>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Email Configuration */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.15 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Email Configuration</h3>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>SMTP Host</label><input className="input-premium" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} /></div>
                <div><label className={labelClass}>Port</label><input className="input-premium" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} /></div>
              </div>
              <div><label className={labelClass}>Username</label><input className="input-premium" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} /></div>
              <div>
                <label className={labelClass}>Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} className="input-premium pr-10" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} />
                  <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400">{showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* API Configuration */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.2 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">API Configuration</h3>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Public API Key', value: 'ec_pk_live_4f8a9b2c1d3e5f7a' },
                { label: 'Secret API Key', value: 'ec_sk_live_••••••••••••••' },
                { label: 'Webhook Secret', value: 'ec_wh_7d3c8b2a1f9e5d6c' },
              ].map((k) => (
                <div key={k.label} className="p-3 rounded-xl bg-secondary-50 dark:bg-secondary-800/50">
                  <p className="text-xs text-secondary-400 mb-1">{k.label}</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-primary-800 dark:text-primary-300 flex-1 truncate">{k.value}</code>
                    <button className="p-1.5 rounded-lg text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700" title="Copy"><Copy className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              <Badge variant="success" className="mt-2"><ShieldCheck className="w-3.5 h-3.5" /> All keys are valid</Badge>
            </div>
          </Card>
        </motion.div>

        {/* Footer Settings */}
        <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.22 }}>
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Footer Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Copyright Line</label>
                <input
                  type="text"
                  className="input-premium"
                  value={copyrightLine}
                  onChange={(e) => setCopyrightLine(e.target.value)}
                  placeholder="e.g. © 2026 Evercrest Bank. All rights reserved."
                />
              </div>
              <div>
                <label className={labelClass}>FDIC / Disclaimer Line</label>
                <input
                  type="text"
                  className="input-premium"
                  value={fdicDisclaimerLine}
                  onChange={(e) => setFdicDisclaimerLine(e.target.value)}
                  placeholder="e.g. Member FDIC. This is a fictional demo platform."
                />
              </div>
              <div>
                <label className={labelClass}>Deposit Insurance Line</label>
                <input
                  type="text"
                  className="input-premium"
                  value={depositInsuranceLine}
                  onChange={(e) => setDepositInsuranceLine(e.target.value)}
                  placeholder="e.g. Deposits insured up to the maximum allowable amount."
                />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Appearance Toggle */}
      <motion.div {...fadeUp} transition={{ duration: 0.4, delay: 0.25 }}>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-primary-900 dark:text-white">Appearance</h3>
              <p className="text-sm text-secondary-500">Toggle between light and dark mode for the admin console.</p>
            </div>
            <Button variant="secondary" onClick={toggleMode}>
              {theme.mode === 'light' ? 'Switch to Dark' : 'Switch to Light'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
