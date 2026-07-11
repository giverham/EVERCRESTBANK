import type { Transaction } from '../data/demoData';

export function calculateAccountBalances(accountId: string, transactions: Transaction[]) {
  const accTxs = transactions.filter(t => t.account_id === accountId);
  let current = 0;
  let pending = 0;
  
  accTxs.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    if (tx.status?.toLowerCase() === 'pending') {
      pending += (tx.type === 'credit' ? amt : -amt);
    } else {
      current += (tx.type === 'credit' ? amt : -amt);
    }
  });
  
  const available = current + pending;
  
  return { current, pending, available };
}
