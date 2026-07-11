import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('c:/Users/HP/OneDrive/Desktop/EVERCREST DEMO/EVERCRESTBANK/.env');
const envFile = fs.readFileSync(envPath, 'utf8');
const supabaseUrl = envFile.match(/VITE_SUPABASE_URL=(.*)/)[1].trim();
const supabaseAnonKey = envFile.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1].trim();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runBackfill() {
  console.log('Fetching all transactions from Supabase...');
  const { data: txs, error: txsErr } = await supabase.from('transactions').select('*');
  
  if (txsErr) {
    console.error('Error fetching transactions:', txsErr);
    return;
  }

  if (!txs || txs.length === 0) {
    console.log('No transactions found in database.');
    return;
  }

  console.log(`Found ${txs.length} total transactions. Grouping by account and date...`);

  // Group by account_id and pure date YYYY-MM-DD
  const groups = {};
  for (const tx of txs) {
    if (!tx.date) continue;
    // Extract date portion YYYY-MM-DD
    const datePart = tx.date.split('T')[0];
    const key = `${tx.account_id}_${datePart}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(tx);
  }

  const updates = [];

  for (const key of Object.keys(groups)) {
    const group = groups[key];
    const [accountId, datePart] = key.split('_');

    // 1. Assign candidate base time (in minutes since midnight) to each transaction based on type
    const mappedTxs = group.map(tx => {
      const desc = (tx.description || tx.merchant || '').toLowerCase();
      const cat = (tx.category || '').toLowerCase();
      
      let hour = 12;
      let minute = 0;

      if (cat === 'interest' || desc.includes('interest')) {
        // System / Interest processing (late night / early morning)
        hour = Math.floor(Math.random() * 4); // 0 to 3 AM
        minute = Math.floor(Math.random() * 60);
      } else if (desc.includes('payroll') || desc.includes('salary') || desc.includes('direct deposit')) {
        // Payroll (morning 6 AM - 10 AM)
        hour = 6 + Math.floor(Math.random() * 4); // 6 to 9 AM
        minute = Math.floor(Math.random() * 60);
      } else if (desc.includes('starbucks') || desc.includes('coffee') || desc.includes('dunkin') || desc.includes('cafe')) {
        // Coffee shop (6:30 AM - 11 AM)
        hour = 6 + Math.floor(Math.random() * 5); // 6 to 10 AM
        minute = hour === 6 ? 30 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 60);
      } else if (desc.includes('gas') || desc.includes('shell') || desc.includes('chevron') || desc.includes('exxon')) {
        // Gas station (morning 6-9 AM or evening 5-9 PM)
        const isMorning = Math.random() > 0.5;
        hour = isMorning ? 6 + Math.floor(Math.random() * 3) : 17 + Math.floor(Math.random() * 4);
        minute = Math.floor(Math.random() * 60);
      } else if (cat === 'transfer' || desc.includes('ach') || desc.includes('wire') || desc.includes('transfer')) {
        // ACH / Transfers (business hours 8 AM - 5 PM)
        hour = 8 + Math.floor(Math.random() * 9); // 8 AM to 4 PM (16)
        minute = Math.floor(Math.random() * 60);
      } else if (cat === 'dining' || desc.includes('smith') || desc.includes('mcdonald') || desc.includes('burger') || desc.includes('pizza') || desc.includes('restaurant')) {
        // Restaurants (Lunch 11:30 AM - 2 PM or Dinner 5:30 PM - 10 PM)
        const isLunch = Math.random() > 0.4;
        if (isLunch) {
          hour = 11 + Math.floor(Math.random() * 3); // 11 AM to 1 PM
          minute = hour === 11 ? 30 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 60);
        } else {
          hour = 17 + Math.floor(Math.random() * 5); // 5 PM to 9 PM (17-21)
          minute = hour === 17 ? 30 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 60);
        }
      } else if (desc.includes('amazon') || desc.includes('target') || desc.includes('cvs') || desc.includes('whole foods') || cat === 'shopping' || cat === 'groceries') {
        // Online / shopping / groceries (daytime 9 AM - 11:30 PM)
        hour = 9 + Math.floor(Math.random() * 15); // 9 AM to 11 PM (23)
        minute = hour === 23 ? Math.floor(Math.random() * 30) : Math.floor(Math.random() * 60);
      } else if (desc.includes('atm') || desc.includes('withdrawal')) {
        // ATM withdrawals (7 AM - 10 PM)
        hour = 7 + Math.floor(Math.random() * 15); // 7 AM to 9 PM (21)
        minute = Math.floor(Math.random() * 60);
      } else {
        // Default (8 AM - 10 PM)
        hour = 8 + Math.floor(Math.random() * 14); // 8 AM to 9 PM (21)
        minute = Math.floor(Math.random() * 60);
      }

      return {
        tx,
        baseMinutes: hour * 60 + minute
      };
    });

    // 2. Sort group transactions chronologically by base time
    mappedTxs.sort((a, b) => a.baseMinutes - b.baseMinutes);

    // 3. Enforce spacing constraint (minimum 10-25 minutes between successive transactions)
    let lastMinutes = -1;
    for (let i = 0; i < mappedTxs.length; i++) {
      let currentMinutes = mappedTxs[i].baseMinutes;
      if (lastMinutes !== -1 && currentMinutes <= lastMinutes + 5) {
        // Shift forward with random realistic gap
        currentMinutes = lastMinutes + 10 + Math.floor(Math.random() * 20);
      }
      
      // Cap at 23:59 (1439 minutes)
      if (currentMinutes > 1439) {
        currentMinutes = 1439;
      }
      
      lastMinutes = currentMinutes;

      const hourPart = Math.floor(currentMinutes / 60);
      const minPart = currentMinutes % 60;
      const hh = String(hourPart).padStart(2, '0');
      const mm = String(minPart).padStart(2, '0');

      // Create beautiful new ISO format string (UTC matching for our local safe parsing)
      const newFullDate = `${datePart}T${hh}:${mm}:00.000Z`;

      updates.push({
        id: mappedTxs[i].tx.id,
        date: newFullDate
      });
    }
  }

  console.log(`Prepared ${updates.length} transaction timestamp updates. Executing...`);

  // Update transactions in chunks
  const chunkSize = 20;
  for (let i = 0; i < updates.length; i += chunkSize) {
    const chunk = updates.slice(i, i + chunkSize);
    const promises = chunk.map(u => 
      supabase.from('transactions').update({ date: u.date }).eq('id', u.id)
    );
    const results = await Promise.all(promises);
    const failed = results.filter(r => r.error);
    if (failed.length > 0) {
      console.error(`Chunk update had ${failed.length} failures:`, failed[0].error);
    }
  }

  console.log('Database transaction date-time backfill completed successfully.');
}

runBackfill();
