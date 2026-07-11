import type { Transaction } from '../data/demoData';

export function calculateAccountBalances(account: any, transactions?: Transaction[]) {
  if (!account) {
    return { current: 0, pending: 0, available: 0 };
  }

  // Support legacy compatibility if string account ID was passed instead of the full account object
  if (typeof account === 'string') {
    const accountId = account;
    let current = 0;
    let pending = 0;
    if (transactions) {
      const accTxs = transactions.filter(t => t.account_id === accountId);
      accTxs.forEach(tx => {
        const amt = Number(tx.amount) || 0;
        if (tx.status?.toLowerCase() === 'pending') {
          pending += (tx.type === 'credit' ? amt : -amt);
        } else {
          current += (tx.type === 'credit' ? amt : -amt);
        }
      });
    }
    return { current, pending, available: current + pending };
  }

  const current = parseFloat(account.current_balance) || 0;
  const pending = parseFloat(account.pending_balance) || 0;
  let available = parseFloat(account.available_balance) || 0;

  if (account.is_fixed_savings) {
    available = 0;
  }

  return { current, pending, available };
}


