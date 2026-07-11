import type { Transaction } from '../data/demoData';

export function calculateAccountBalances(account: any, transactions: Transaction[]) {
  if (!account) {
    return { current: 0, pending: 0, available: 0 };
  }

  // Support both passing full account object or just legacy accountId string
  const accountId = typeof account === 'string' ? account : account.id;
  const dbCurrentBalance = typeof account === 'object' ? (Number(account.current_balance) ?? 0) : 0;

  const accTxs = transactions.filter(t => t.account_id === accountId);
  let current = typeof account === 'object' ? dbCurrentBalance : 0;
  let pending = 0;
  
  accTxs.forEach(tx => {
    const amt = Number(tx.amount) || 0;
    if (tx.status?.toLowerCase() === 'pending') {
      pending += (tx.type === 'credit' ? amt : -amt);
    } else if (typeof account !== 'object') {
      // Legacy compatibility: if full account object was not passed, calculate current balance from transactions
      current += (tx.type === 'credit' ? amt : -amt);
    }
  });
  
  const available = current + pending;
  
  return { current, pending, available };
}

