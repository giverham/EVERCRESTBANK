import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('c:/Users/HP/OneDrive/Desktop/EVERCREST DEMO/EVERCRESTBANK/.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseAnonKey = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seed() {
  const { data: accounts, error: errAcc } = await supabase.from('accounts').select('*');
  if (errAcc) {
    console.error('Error fetching accounts:', errAcc);
    return;
  }
  
  if (!accounts || accounts.length === 0) {
    console.log('No accounts found. Please ensure customers have accounts created in the DB.');
    return;
  }

  console.log('Wiping existing transactions to ensure clean 12-month statements...');
  // Wipe existing transactions
  const { error: delErr } = await supabase.from('transactions').delete().neq('id', 'dummy');
  if (delErr) {
    console.error('Error wiping transactions:', delErr);
  }

  console.log('Generating 12 months of rolling data...');
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const categories = ['Groceries', 'Dining', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Income', 'Transfer'];
  const merchants = ['Whole Foods', 'Shell Gas', 'Netflix', 'Amazon', 'ConEd', 'The Smith', 'Uber', 'Target', 'CVS', 'Starbucks'];
  
  const transactionsToInsert = [];
  
  for (const acc of accounts) {
    console.log(`Processing account ${acc.name} (${acc.id})`);
    
    // Create rolling 12 months from current month going backward
    for (let m = 0; m < 12; m++) {
      let targetMonth = currentMonth - m;
      let targetYear = currentYear;
      
      if (targetMonth < 0) {
        targetMonth += 12;
        targetYear -= 1;
      }
      
      const numTx = Math.floor(Math.random() * 8) + 8; // 8-15 tx per month
      
      for (let i = 0; i < numTx; i++) {
        const day = Math.floor(Math.random() * 28) + 1;
        const date = new Date(targetYear, targetMonth, day);
        
        const isCredit = Math.random() > 0.75; // 25% chance of credit
        let amount = isCredit ? (Math.random() * 4500 + 500) : (Math.random() * 180 + 5);
        amount = parseFloat(amount.toFixed(2));
        
        const type = isCredit ? 'credit' : 'debit';
        const category = isCredit ? 'Income' : categories[Math.floor(Math.random() * 6)];
        const merchant = isCredit ? 'Payroll Deposit' : merchants[Math.floor(Math.random() * merchants.length)];
        
        transactionsToInsert.push({
          id: `tx-${acc.id}-${m}-${i}-${Math.floor(Math.random() * 1000000)}`,
          customer_id: acc.customer_id,
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
    
    // Establish a final current balance
    const finalBalance = Math.floor(Math.random() * 80000) + 5000;
    const { error: updErr } = await supabase.from('accounts').update({
      current_balance: finalBalance,
      available_balance: finalBalance,
      pending_balance: 0
    }).eq('id', acc.id);
    
    if (updErr) {
      console.error('Error updating account balances:', updErr);
    }
  }
  
  console.log(`Inserting ${transactionsToInsert.length} transactions...`);
  // Chunk inserts to avoid Supabase PostgREST Limits
  const chunkSize = 50;
  for (let i = 0; i < transactionsToInsert.length; i += chunkSize) {
    const chunk = transactionsToInsert.slice(i, i + chunkSize);
    const { error } = await supabase.from('transactions').insert(chunk);
    if (error) {
      console.error('Insert error in chunk:', error);
    }
  }
  
  console.log('Data backfill complete.');
}

seed();
