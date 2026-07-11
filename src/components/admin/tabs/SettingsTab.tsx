import { useState } from "react";
import { Card } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { AlertTriangle, Database } from "lucide-react";
import { supabaseAdmin as supabase } from "../../../lib/supabase";

export function SettingsTab({ customerId }: { customerId: string }) {
  const [seeding, setSeeding] = useState(false);

  const handleSeedData = async () => {
    if (!window.confirm('Are you sure you want to wipe this customer\'s transactions and seed fresh realistic data?')) return;
    setSeeding(true);
    
    // Wipe existing transactions
    await supabase.from('transactions').delete().eq('customer_id', customerId);

    const { data: accounts } = await supabase.from('accounts').select('*').eq('customer_id', customerId);
    
    if (accounts) {
      const now = new Date();
      for (const acc of accounts) {
        const transactions = [];
        
        // Add Initial Balance
        let initialBalance = 0;
        if (acc.name.includes('Checking')) initialBalance = 49180.50;
        else if (acc.name.includes('Savings')) initialBalance = 125400.00;
        else if (acc.name.includes('Growth') || acc.name.includes('Investment')) initialBalance = 79450.80;
        else initialBalance = 10000;
        
        transactions.push({
          id: `tx-${acc.id}-init`,
          customer_id: customerId,
          account_id: acc.id,
          date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30).toISOString(),
          description: 'Initial Deposit',
          category: 'Income',
          amount: initialBalance,
          type: 'credit',
          status: 'Completed',
          merchant: 'Evercrest Bank'
        });
        
        if (acc.name.includes('Checking')) {
          const txs = [
            { desc: 'Whole Foods Market', cat: 'Groceries', type: 'debit', amt: 142.30, merch: 'Whole Foods' },
            { desc: 'Salary Deposit', cat: 'Income', type: 'credit', amt: 8500.00, merch: 'Employer' },
            { desc: 'Shell Gas Station', cat: 'Transport', type: 'debit', amt: 58.40, merch: 'Shell' },
            { desc: 'Netflix Subscription', cat: 'Entertainment', type: 'debit', amt: 15.99, merch: 'Netflix' },
            { desc: 'Transfer to Savings', cat: 'Transfer', type: 'debit', amt: 2000.00, merch: 'Evercrest Bank' },
            { desc: 'Amazon Purchase', cat: 'Shopping', type: 'debit', amt: 89.99, merch: 'Amazon' },
            { desc: 'Electric Bill', cat: 'Utilities', type: 'debit', amt: 187.50, merch: 'ConEd' },
            { desc: 'Restaurant - The Smith', cat: 'Dining', type: 'debit', amt: 76.20, merch: 'The Smith' }
          ];
          
          txs.forEach((t, i) => {
            const tDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (15 - i));
            transactions.push({
              id: `tx-${acc.id}-${i}`,
              customer_id: customerId,
              account_id: acc.id,
              date: tDate.toISOString(),
              description: t.desc,
              category: t.cat,
              amount: t.amt,
              type: t.type,
              status: 'Completed',
              merchant: t.merch
            });
          });
          
          transactions.push({
            id: `tx-${acc.id}-pend`,
            customer_id: customerId,
            account_id: acc.id,
            date: now.toISOString(),
            description: 'Apple Store',
            category: 'Shopping',
            amount: 199.00,
            type: 'debit',
            status: 'Pending',
            merchant: 'Apple'
          });
          
        } else if (acc.name.includes('Savings')) {
          transactions.push({
            id: `tx-${acc.id}-t1`,
            customer_id: customerId,
            account_id: acc.id,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 15).toISOString(),
            description: 'Transfer from Checking',
            category: 'Transfer',
            amount: 2000.00,
            type: 'credit',
            status: 'Completed',
            merchant: 'Evercrest Bank'
          });
          transactions.push({
            id: `tx-${acc.id}-t2`,
            customer_id: customerId,
            account_id: acc.id,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toISOString(),
            description: 'Interest Earned',
            category: 'Income',
            amount: 450.25,
            type: 'credit',
            status: 'Completed',
            merchant: 'Evercrest Bank'
          });
        } else if (acc.name.includes('Investment') || acc.name.includes('Growth')) {
          transactions.push({
            id: `tx-${acc.id}-i1`,
            customer_id: customerId,
            account_id: acc.id,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 10).toISOString(),
            description: 'Dividend Payment',
            category: 'Income',
            amount: 245.00,
            type: 'credit',
            status: 'Completed',
            merchant: 'Vanguard'
          });
          transactions.push({
            id: `tx-${acc.id}-i2`,
            customer_id: customerId,
            account_id: acc.id,
            date: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2).toISOString(),
            description: 'Portfolio Rebalancing',
            category: 'Transfer',
            amount: 1500.00,
            type: 'debit',
            status: 'Completed',
            merchant: 'Evercrest Trading'
          });
        }
        
        await supabase.from('transactions').insert(transactions);
      }
    }
    
    setSeeding(false);
    alert('Demo data seeded successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="p-6">
        <h2 className="text-lg font-bold text-primary-900 dark:text-white mb-6">
          Security Settings
        </h2>
        <div className="p-4 bg-error-50 dark:bg-error-500/10 rounded-xl flex items-start gap-4 mb-6">
          <AlertTriangle className="w-6 h-6 text-error-600 shrink-0" />
          <div>
            <h3 className="font-bold text-error-800 dark:text-error-400">
              Password Changes Disabled
            </h3>
            <p className="text-sm text-error-700 dark:text-error-300 mt-1">
              For your account security, password changes cannot be completed
              online. Please contact Evercrest Bank Customer Support for
              assistance.
            </p>
          </div>
        </div>
        
        <div className="pt-6 border-t border-secondary-200 dark:border-secondary-800">
          <h2 className="text-lg font-bold text-primary-900 dark:text-white mb-4">
            Developer Tools
          </h2>
          <div className="p-4 bg-secondary-50 dark:bg-secondary-900/50 border border-secondary-200 dark:border-secondary-800 rounded-xl flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-primary-900 dark:text-white">Seed Demo Data</h3>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                Wipe this customer's existing transactions and generate realistic authentic history.
              </p>
            </div>
            <Button variant="secondary" onClick={handleSeedData} disabled={seeding}>
              <Database className="w-4 h-4 mr-2" />
              {seeding ? 'Seeding...' : 'Seed Data'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
