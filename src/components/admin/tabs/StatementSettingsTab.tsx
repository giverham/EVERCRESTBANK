import { useState, useEffect } from 'react';
import { Save, Building, Image as ImageIcon, ShieldCheck, Database, Check, Loader2 } from 'lucide-react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { supabaseAdmin as supabase } from '../../../lib/supabase';

export interface StatementSettings {
  bankName: string;
  bankWebsite: string;
  bankPhone: string;
  bankEmail: string;
  iban: string;
  swift: string;
  logoUrl: string;
  sealUrl: string;
  signatureUrl: string;
  footerText: string;
  disclaimer: string;
  watermark: string;
}

const defaultSettings: StatementSettings = {
  bankName: 'Everest Bank',
  bankWebsite: 'www.everestbank.com',
  bankPhone: '1-800-555-0199',
  bankEmail: 'support@everestbank.com',
  iban: 'US89 EVER 1234 5678 9012 34',
  swift: 'EVERUS33',
  logoUrl: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=150&h=150&q=80',
  sealUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=150&h=150&q=80',
  signatureUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Signature_of_John_Hancock.svg',
  footerText: 'Member FDIC. Equal Housing Lender. This statement is computer generated.',
  disclaimer: 'Please report any discrepancies within 60 days.',
  watermark: 'EVEREST BANK OFFICIAL ACCOUNT STATEMENT CONFIDENTIAL',
};

export function StatementSettingsTab() {
  const [settings, setSettings] = useState<StatementSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);
  const [seedProgress, setSeedProgress] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('statement_settings');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) { }
    }
  }, []);

  const handleChange = (field: keyof StatementSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    localStorage.setItem('statement_settings', JSON.stringify(settings));
    setTimeout(() => {
      setSaving(false);
      alert('Statement settings saved successfully. All future statements will use these details.');
    }, 400);
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
        let currentMonthBalance = Math.floor(Math.random() * 50000) + 12000; // Final ending balance
        let accBalance = currentMonthBalance;

        // Loop backwards from month 0 (current month) to month 11 (12 months total)
        for (let m = 0; m < 12; m++) {
          let targetMonth = currentMonth - m;
          let targetYear = currentYear;
          
          if (targetMonth < 0) {
            targetMonth += 12;
            targetYear -= 1;
          }

          // Randomize number of transactions per month (7 to 13)
          const numTx = Math.floor(Math.random() * 7) + 7;
          
          for (let i = 0; i < numTx; i++) {
            const day = Math.floor(Math.random() * 28) + 1;
            const date = new Date(targetYear, targetMonth, day);
            
            // 25% chance of a credit/income
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

        // Update the account balance in DB to match
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

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold text-primary-900 dark:text-white">Statement Settings</h2>
        <p className="text-secondary-500 mt-1">Configure the official branding and information that appears on all generated PDF statements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-5 h-5 text-accent-500" />
            <h3 className="font-bold text-lg text-primary-900 dark:text-white">Bank Information</h3>
          </div>
          <div className="space-y-4">
            <Input label="Bank Name" value={settings.bankName} onChange={e => handleChange('bankName', e.target.value)} />
            <Input label="Website" value={settings.bankWebsite} onChange={e => handleChange('bankWebsite', e.target.value)} />
            <Input label="Support Phone" value={settings.bankPhone} onChange={e => handleChange('bankPhone', e.target.value)} />
            <Input label="Support Email" value={settings.bankEmail} onChange={e => handleChange('bankEmail', e.target.value)} />
            <Input label="IBAN (Optional)" value={settings.iban} onChange={e => handleChange('iban', e.target.value)} />
            <Input label="SWIFT/BIC (Optional)" value={settings.swift} onChange={e => handleChange('swift', e.target.value)} />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-accent-500" />
            <h3 className="font-bold text-lg text-primary-900 dark:text-white">Branding & Images</h3>
          </div>
          <div className="space-y-4">
            <Input label="Logo Image URL" value={settings.logoUrl} onChange={e => handleChange('logoUrl', e.target.value)} />
            <Input label="Official Seal/Stamp URL" value={settings.sealUrl} onChange={e => handleChange('sealUrl', e.target.value)} />
            <Input label="Authorized Signature URL" value={settings.signatureUrl} onChange={e => handleChange('signatureUrl', e.target.value)} />
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-accent-500" />
            <h3 className="font-bold text-lg text-primary-900 dark:text-white">Legal & Footer</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Watermark Text</label>
              <textarea 
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-900 border-secondary-300 dark:border-secondary-700 text-primary-900 dark:text-white"
                value={settings.watermark}
                onChange={e => handleChange('watermark', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Statement Footer Text</label>
              <textarea 
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-900 border-secondary-300 dark:border-secondary-700 text-primary-900 dark:text-white"
                value={settings.footerText}
                onChange={e => handleChange('footerText', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Disclaimer</label>
              <textarea 
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-secondary-900 border-secondary-300 dark:border-secondary-700 text-primary-900 dark:text-white"
                value={settings.disclaimer}
                onChange={e => handleChange('disclaimer', e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* System Backfill Card */}
        <Card className="p-6 md:col-span-2 border-dashed border-2 border-accent-500/30 bg-accent-500/5">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-accent-500" />
            <h3 className="font-bold text-lg text-primary-900 dark:text-white">Transaction History Backfill</h3>
          </div>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
            Prepare the workspace sandbox by seeding a full 12-month rolling history of mathematically perfect transaction data. 
            This aligns balances, deposits, withdrawals, and statement calculations dynamically.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Button 
              variant="accent" 
              onClick={handleBackfill} 
              disabled={seeding}
              className="w-full sm:w-auto"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : seedSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Backfill Done!
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 mr-2" />
                  Trigger 12-Month Backfill
                </>
              )}
            </Button>
            {seeding && (
              <span className="text-xs font-medium text-accent-600 animate-pulse">
                {seedProgress}
              </span>
            )}
          </div>
        </Card>
      </div>

      <div className="flex justify-end pt-4 border-t border-secondary-200 dark:border-secondary-800">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Statement Settings'}
        </Button>
      </div>
    </div>
  );
}
