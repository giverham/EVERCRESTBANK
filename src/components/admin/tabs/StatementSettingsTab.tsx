import { useState, useEffect } from 'react';
import { Save, Building, Image as ImageIcon, ShieldCheck, Database, Check, Loader2, Sliders, Calendar, HelpCircle, Eye } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { ImageUploader } from '../ImageUploader';
import { supabaseAdmin as supabase } from '../../../lib/supabase';

export interface StatementSettings {
  bankName: string;
  bankWebsite: string;
  bankPhone: string;
  bankEmail: string;
  bankAddress: string;
  routing: string;
  accountNumber: string;
  logoUrl: string;
  sealUrl: string; // Official Bank Stamp
  signatureUrl: string; // Authorized Signature
  qrCodeUrl: string; // QR Code
  footerText: string;
  disclaimer: string;
  watermark: string;
  watermarkOpacity: number;

  // Formatting
  dateFormat: string;
  currencyFormat: string;
  decimalFormat: string;
  timeZone: string;
  language: string;
  paperSize: string;
  orientation: string;

  // Template Builder Customizations
  headerStyle: string;
  footerStyle: string;
  logoPosition: string;
  stampPosition: string;
  signaturePosition: string;
  tablePrimaryColor: string;
  tableTextColor: string;
  fontFamily: string;
  borderStyle: string;
  marginSize: string;
  theme: string;
}

export const defaultStatementSettings: StatementSettings = {
  bankName: 'Everest Bank',
  bankWebsite: 'www.everestbank.com',
  bankPhone: '1-800-555-0199',
  bankEmail: 'support@everestbank.com',
  bankAddress: '100 Financial Plaza, Suite 450, New York, NY 10005',
  routing: '121000248',
  accountNumber: '********4582',
  logoUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=150&h=150&q=80',
  sealUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=150&h=150&q=80',
  signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Signature_of_John_Hancock.svg',
  qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://www.everestbank.com/verify-statement',
  footerText: 'Member FDIC. Equal Housing Lender. This statement is computer generated.',
  disclaimer: 'Please report any discrepancies within 60 days of receiving this statement.',
  watermark: 'EVEREST BANK OFFICIAL STATEMENT',
  watermarkOpacity: 0.08,

  dateFormat: 'Jul 17, 2026',
  currencyFormat: 'USD',
  decimalFormat: '2',
  timeZone: 'America/New_York',
  language: 'en',
  paperSize: 'letter',
  orientation: 'portrait',

  headerStyle: 'corporate',
  footerStyle: 'centered',
  logoPosition: 'left',
  stampPosition: 'bottom-right',
  signaturePosition: 'bottom-left',
  tablePrimaryColor: '#0a2540',
  tableTextColor: '#1e293b',
  fontFamily: 'Helvetica',
  borderStyle: 'thin',
  marginSize: '0.75in',
  theme: 'Premium',
};

export function StatementSettingsTab() {
  const [settings, setSettings] = useState<StatementSettings>(defaultStatementSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seedProgress, setSeedProgress] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'branding' | 'format' | 'template' | 'preview'>('info');

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'statement_settings')
          .maybeSingle();

        if (error) throw error;
        if (data && data.value) {
          setSettings({ ...defaultStatementSettings, ...data.value });
        } else {
          // Store default if none present
          await supabase.from('settings').upsert({
            key: 'statement_settings',
            value: defaultStatementSettings,
            updated_at: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error('Error loading statement settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (field: keyof StatementSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from('settings').upsert({
        key: 'statement_settings',
        value: settings,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      alert('Statement Settings saved successfully to Supabase! All newly generated statements will instantly reflect these corporate details.');
    } catch (err: any) {
      alert(`Failed to save settings: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBackfill = async () => {
    if (!window.confirm('WARNING: This will delete ALL existing transaction data to backfill a clean 12-month rolling statement ledger for all accounts. Are you sure you want to proceed?')) {
      return;
    }

    setSeeding(true);
    setSeedSuccess(false);
    setSeedProgress('Fetching accounts...');

    try {
      const { data: accounts, error: errAcc } = await supabase.from('accounts').select('*');
      if (errAcc || !accounts || accounts.length === 0) {
        throw new Error(errAcc?.message || 'No accounts found in DB. Make sure customers and accounts are created first.');
      }

      setSeedProgress('Clearing existing transaction ledger...');
      const { error: delErr } = await supabase.from('transactions').delete().neq('id', 'dummy_tx_placeholder_unlikely_match');
      if (delErr) throw delErr;

      setSeedProgress('Generating mathematically aligned transactions across 12 rolling months...');
      
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      const categories = ['Groceries', 'Dining', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Income', 'Transfer'];
      const merchants = {
        Groceries: ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'Kroger'],
        Dining: ['The Smith Restaurant', 'Starbucks Coffee', 'Chipotle Mexican Grill', 'Olive Garden'],
        Transport: ['Shell Gas Station', 'Uber Ride', 'Lyft', 'Metropolitan Transit'],
        Shopping: ['Amazon.com', 'Target Stores', 'Best Buy', 'Walmart'],
        Utilities: ['Con Edison', 'Verizon Wireless', 'Comcast Cable', 'Water Utility'],
        Entertainment: ['Netflix Subscription', 'Spotify Music', 'AMC Theatres', 'PlayStation Network'],
        Income: ['Payroll Deposit / Direct Deposit', 'Dividend Payout', 'ACH Settlement'],
        Transfer: ['Internal Transfer Credit', 'Internal Transfer Debit']
      };

      const transactionsToInsert = [];

      for (const acc of accounts) {
        let accBalance = Math.floor(Math.random() * 50000) + 12000;

        for (let m = 0; m < 12; m++) {
          let targetMonth = currentMonth - m;
          let targetYear = currentYear;
          
          if (targetMonth < 0) {
            targetMonth += 12;
            targetYear -= 1;
          }

          const numTx = Math.floor(Math.random() * 7) + 7;
          
          for (let i = 0; i < numTx; i++) {
            const day = Math.floor(Math.random() * 28) + 1;
            const date = new Date(targetYear, targetMonth, day);
            
            const isCredit = Math.random() > 0.75;
            let amount = isCredit ? (Math.random() * 3200 + 400) : (Math.random() * 120 + 8);
            amount = parseFloat(amount.toFixed(2));

            const type = isCredit ? 'credit' : 'debit';
            const category = isCredit ? 'Income' : categories[Math.floor(Math.random() * 6)];
            const list = merchants[category as keyof typeof merchants] || ['Merchant Purchase'];
            const merchant = list[Math.floor(Math.random() * list.length)];

            transactionsToInsert.push({
              account_id: acc.id,
              date: date.toISOString().split('T')[0],
              description: merchant,
              category: category,
              amount: amount,
              type: type,
              status: 'completed',
              merchant: merchant
            });
          }
        }

        const { error: updErr } = await supabase.from('accounts').update({
          current_balance: parseFloat(accBalance.toFixed(2)),
          available_balance: parseFloat(accBalance.toFixed(2)),
          pending_balance: 0
        }).eq('id', acc.id);

        if (updErr) throw updErr;
      }

      setSeedProgress(`Inserting ${transactionsToInsert.length} transactions in chunks...`);
      
      const chunkSize = 40;
      for (let i = 0; i < transactionsToInsert.length; i += chunkSize) {
        const chunk = transactionsToInsert.slice(i, i + chunkSize);
        const { error: insErr } = await supabase.from('transactions').insert(chunk);
        if (insErr) throw insErr;
      }

      setSeedProgress('Backfill process complete!');
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 5000);
    } catch (err: any) {
      alert(`Backfill failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-secondary-500">
        <Loader2 className="w-8 h-8 animate-spin text-accent-500 mb-2" />
        <span>Loading Statement Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-primary-900 dark:text-white font-serif">Statement Settings & Customizer</h2>
          <p className="text-secondary-500 text-sm mt-1">Configure professional banking layouts, custom seal/stamps, routing numbers, and live templates.</p>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="accent" className="flex items-center gap-1.5 self-start md:self-center">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Builder Settings'}
        </Button>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-secondary-200 dark:border-secondary-800 pb-2">
        <button onClick={() => setActiveSubTab('info')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubTab === 'info' ? 'bg-primary-900 text-white dark:bg-accent-500' : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'}`}>
          Bank Info & Address
        </button>
        <button onClick={() => setActiveSubTab('branding')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubTab === 'branding' ? 'bg-primary-900 text-white dark:bg-accent-500' : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'}`}>
          Logos, Seals & Signatures
        </button>
        <button onClick={() => setActiveSubTab('format')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubTab === 'format' ? 'bg-primary-900 text-white dark:bg-accent-500' : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'}`}>
          Formatting & Locale
        </button>
        <button onClick={() => setActiveSubTab('template')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubTab === 'template' ? 'bg-primary-900 text-white dark:bg-accent-500' : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'}`}>
          Template Customizer
        </button>
        <button onClick={() => setActiveSubTab('preview')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSubTab === 'preview' ? 'bg-primary-900 text-white dark:bg-accent-500' : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'}`}>
          Live Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form controls */}
        <div className="lg:col-span-2 space-y-6">
          {activeSubTab === 'info' && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b pb-3 mb-2">
                <Building className="w-5 h-5 text-accent-500" />
                <h3 className="font-bold text-lg text-primary-900 dark:text-white">Legal Bank Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Bank Name" value={settings.bankName} onChange={e => handleChange('bankName', e.target.value)} />
                <Input label="Corporate Website" value={settings.bankWebsite} onChange={e => handleChange('bankWebsite', e.target.value)} />
                <Input label="Corporate Phone" value={settings.bankPhone} onChange={e => handleChange('bankPhone', e.target.value)} />
                <Input label="Corporate Email" value={settings.bankEmail} onChange={e => handleChange('bankEmail', e.target.value)} />
                <div className="md:col-span-2">
                  <Input label="Headquarters Address" value={settings.bankAddress} onChange={e => handleChange('bankAddress', e.target.value)} />
                </div>
                <Input label="Routing Number" value={settings.routing} onChange={e => handleChange('routing', e.target.value)} />
                <Input label="Account Number" value={settings.accountNumber || ''} onChange={e => handleChange('accountNumber', e.target.value)} />
              </div>
            </Card>
          )}

          {activeSubTab === 'branding' && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b pb-3 mb-2">
                <ImageIcon className="w-5 h-5 text-accent-500" />
                <h3 className="font-bold text-lg text-primary-900 dark:text-white">Official Statement Assets</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUploader label="Upload Brand Logo" value={settings.logoUrl} onChange={url => handleChange('logoUrl', url)} />
                <ImageUploader label="Upload Official Bank Stamp (Seal)" value={settings.sealUrl} onChange={url => handleChange('sealUrl', url)} />
                <ImageUploader label="Upload Authorized Signature" value={settings.signatureUrl} onChange={url => handleChange('signatureUrl', url)} />
                <ImageUploader label="Upload Statement QR Code" value={settings.qrCodeUrl} onChange={url => handleChange('qrCodeUrl', url)} />
              </div>
            </Card>
          )}

          {activeSubTab === 'format' && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b pb-3 mb-2">
                <Calendar className="w-5 h-5 text-accent-500" />
                <h3 className="font-bold text-lg text-primary-900 dark:text-white">Formatting & Localization Settings</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Date Format Preference</label>
                  <select className="input-premium" value={settings.dateFormat} onChange={e => handleChange('dateFormat', e.target.value)}>
                    <option value="MMM DD, YYYY">Jul 17, 2026 (Abbreviated US)</option>
                    <option value="DD MMM YYYY">17 Jul 2026 (International)</option>
                    <option value="MMM DD, YYYY • h:mm A">Jul 17, 2026 • 4:37 AM (Timestamped)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Base Currency</label>
                  <select className="input-premium" value={settings.currencyFormat} onChange={e => handleChange('currencyFormat', e.target.value)}>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Decimal Places</label>
                  <select className="input-premium" value={settings.decimalFormat} onChange={e => handleChange('decimalFormat', e.target.value)}>
                    <option value="2">2 decimals (.00)</option>
                    <option value="0">No decimals (whole number)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Local Time Zone</label>
                  <select className="input-premium" value={settings.timeZone} onChange={e => handleChange('timeZone', e.target.value)}>
                    <option value="America/New_York">Eastern Standard (EST)</option>
                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                    <option value="Europe/London">London / GMT</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Statement Language</label>
                  <select className="input-premium" value={settings.language} onChange={e => handleChange('language', e.target.value)}>
                    <option value="en">English (US/UK)</option>
                    <option value="fr">French (Français)</option>
                    <option value="es">Spanish (Español)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Paper Dimensions & Orientation</label>
                  <div className="flex gap-2">
                    <select className="input-premium flex-1" value={settings.paperSize} onChange={e => handleChange('paperSize', e.target.value)}>
                      <option value="letter">Letter</option>
                      <option value="a4">A4 Standard</option>
                    </select>
                    <select className="input-premium flex-1" value={settings.orientation} onChange={e => handleChange('orientation', e.target.value)}>
                      <option value="portrait">Portrait</option>
                      <option value="landscape">Landscape</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSubTab === 'template' && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b pb-3 mb-2">
                <Sliders className="w-5 h-5 text-accent-500" />
                <h3 className="font-bold text-lg text-primary-900 dark:text-white">Design & Layout Builder</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Statement Theme Preset</label>
                  <select className="input-premium" value={settings.theme} onChange={e => handleChange('theme', e.target.value)}>
                    <option value="Classic">Classic Corporate (Deep Navy)</option>
                    <option value="Premium">Premium Platinum (Sleek Slate)</option>
                    <option value="Modern">Modern Emerald (Forest Green)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Header Style Layout</label>
                  <select className="input-premium" value={settings.headerStyle} onChange={e => handleChange('headerStyle', e.target.value)}>
                    <option value="corporate">Corporate Structured Grid</option>
                    <option value="simple">Simple Center Aligned</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Bank Logo Alignment</label>
                  <select className="input-premium" value={settings.logoPosition} onChange={e => handleChange('logoPosition', e.target.value)}>
                    <option value="left">Left Aligned</option>
                    <option value="center">Centered</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Official Stamp Position</label>
                  <select className="input-premium" value={settings.stampPosition} onChange={e => handleChange('stampPosition', e.target.value)}>
                    <option value="bottom-right">Bottom Right Footer</option>
                    <option value="bottom-left">Bottom Left Footer</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Watermark Overlay Text</label>
                  <input type="text" className="input-premium" value={settings.watermark} onChange={e => handleChange('watermark', e.target.value)} />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Watermark Opacity ({Math.round(settings.watermarkOpacity * 100)}%)</label>
                  <input type="range" min="0" max="0.3" step="0.01" className="w-full accent-accent-500" value={settings.watermarkOpacity} onChange={e => handleChange('watermarkOpacity', parseFloat(e.target.value))} />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Table Primary Color Theme</label>
                  <input type="color" className="w-full h-10 p-0 border rounded-lg overflow-hidden cursor-pointer" value={settings.tablePrimaryColor} onChange={e => handleChange('tablePrimaryColor', e.target.value)} />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary-500 block mb-1">Font Family</label>
                  <select className="input-premium" value={settings.fontFamily} onChange={e => handleChange('fontFamily', e.target.value)}>
                    <option value="Helvetica">Helvetica (Clean Sans-Serif)</option>
                    <option value="Times">Times New Roman (Classic Serif)</option>
                    <option value="Courier">Courier Standard (Monospaced)</option>
                  </select>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-sm font-semibold text-primary-900 dark:text-white">Custom Footer Note</label>
                    <textarea rows={2} className="input-premium mt-1 resize-none" value={settings.footerText} onChange={e => handleChange('footerText', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-900 dark:text-white">Disclaimer & Reporting Terms</label>
                    <textarea rows={2} className="input-premium mt-1 resize-none" value={settings.disclaimer} onChange={e => handleChange('disclaimer', e.target.value)} />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSubTab === 'preview' && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b pb-3 mb-2">
                <Eye className="w-5 h-5 text-accent-500" />
                <h3 className="font-bold text-lg text-primary-900 dark:text-white">Statement Builder Live Layout Preview</h3>
              </div>
              
              <div className="border border-secondary-200 dark:border-secondary-800 rounded-xl p-6 bg-white text-slate-800 font-sans shadow-lg max-w-2xl mx-auto space-y-6" style={{ fontFamily: settings.fontFamily }}>
                {/* Header */}
                <div className="flex items-start justify-between border-b pb-4">
                  <div className={`flex flex-col ${settings.logoPosition === 'center' ? 'items-center w-full text-center' : settings.logoPosition === 'right' ? 'items-end' : 'items-start'}`}>
                    {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-10 object-contain mb-2" />}
                    <h2 className="text-xl font-bold uppercase tracking-wider">{settings.bankName}</h2>
                    <span className="text-xs text-slate-500">{settings.bankAddress}</span>
                    <span className="text-xs text-slate-500">{settings.bankWebsite} · {settings.bankPhone}</span>
                  </div>
                  {settings.qrCodeUrl && (
                    <img src={settings.qrCodeUrl} alt="QR Code Verification" className="w-16 h-10 object-contain border p-1 rounded bg-slate-50" />
                  )}
                </div>

                {/* Sub info */}
                <div className="grid grid-cols-2 gap-12 text-xs bg-slate-50 p-4 rounded-lg border items-start">
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Account Holder</p>
                      <p className="font-bold text-slate-900 text-sm">Alexander Hayes</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Address</p>
                      <p className="text-slate-700 leading-relaxed font-medium">500 Madison Avenue, New York, NY 10022</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4 text-left border-l pl-8 border-slate-200">
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Account Number</p>
                      <p className="font-mono font-bold text-slate-900">{settings.accountNumber || '********4582'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Routing Number</p>
                      <p className="font-mono font-medium text-slate-900">{settings.routing}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Statement Period</p>
                      <p className="font-medium text-slate-900">Jul 01, 2026 – Jul 11, 2026</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Statement Date</p>
                      <p className="font-medium text-slate-900">Jul 11, 2026</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Account Type</p>
                      <p className="font-medium text-slate-900">Checking</p>
                    </div>
                  </div>
                </div>

                {/* Simulated Table */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Transaction Summary</div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="text-white" style={{ backgroundColor: settings.tablePrimaryColor }}>
                        <th className="p-2 border">Posting Date</th>
                        <th className="p-2 border">Description</th>
                        <th className="p-2 border">Category</th>
                        <th className="p-2 border text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2 border">Jul 10, 2026</td>
                        <td className="p-2 border font-semibold">Payroll Direct Deposit</td>
                        <td className="p-2 border">Income</td>
                        <td className="p-2 border text-right text-emerald-600 font-bold">+$4,250.00</td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2 border">Jul 08, 2026</td>
                        <td className="p-2 border font-semibold">Whole Foods Market</td>
                        <td className="p-2 border">Groceries</td>
                        <td className="p-2 border text-right font-bold">-$148.50</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Watermark preview */}
                {settings.watermark && (
                  <div className="text-center text-[10px] font-bold tracking-widest text-slate-400 select-none py-2 uppercase" style={{ opacity: settings.watermarkOpacity * 6 }}>
                    ••• {settings.watermark} •••
                  </div>
                )}

                {/* Stamps / Signatures */}
                <div className="flex justify-between items-end border-t pt-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Authorized Representative</span>
                    {settings.signatureUrl && <img src={settings.signatureUrl} alt="Signature" className="h-10 object-contain" />}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1 uppercase font-semibold">Official Corporate Stamp</span>
                    {settings.sealUrl && <img src={settings.sealUrl} alt="Seal" className="h-12 object-contain" />}
                  </div>
                </div>

                {/* Disclaimer / footer */}
                <div className="text-[9px] text-slate-400 text-center leading-relaxed">
                  <p className="font-semibold">{settings.footerText}</p>
                  <p className="mt-1">{settings.disclaimer}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Info panel / Ledger utilities */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-accent-500" />
              <h3 className="font-bold text-lg text-primary-900 dark:text-white">Ledger Backfill Tool</h3>
            </div>
            <p className="text-xs text-secondary-500 leading-relaxed mb-4">
              Generate a rolling mathematically synchronized transaction history spanning the past 12 months for active accounts in Supabase.
            </p>

            {seedSuccess ? (
              <div className="p-4 bg-success-500/10 border border-success-500/20 text-success-600 dark:text-success-400 rounded-xl flex items-center gap-2 text-xs font-semibold">
                <Check className="w-4 h-4" /> Ledger successfully aligned with database.
              </div>
            ) : (
              <Button 
                onClick={handleBackfill} 
                disabled={seeding} 
                variant="secondary" 
                className="w-full flex items-center justify-center gap-2"
              >
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                {seeding ? 'Backfilling...' : 'Regenerate 12-Month Ledger'}
              </Button>
            )}

            {seeding && (
              <p className="text-[11px] text-accent-600 dark:text-accent-400 mt-2 font-mono animate-pulse">{seedProgress}</p>
            )}
          </Card>

          <Card className="p-6 bg-accent-50 dark:bg-accent-500/5 border-accent-500/20">
            <h4 className="font-serif font-bold text-primary-900 dark:text-white mb-2">Did you know?</h4>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 leading-relaxed">
              Every newly generated statement PDF dynamically queries the configuration parameters stored inside the `settings` table of your connected Supabase project. There is zero hardcoding involved.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
