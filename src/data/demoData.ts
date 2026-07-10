// ─── Customer Dashboard Demo Data ────────────────────────────────
// All data here is fictional. In production, this comes from the API.

export interface Account {
  id: string;
  type: string;
  name: string;
  number: string;
  routing: string;
  availableBalance: number;
  currentBalance: number;
  pendingBalance: number;
  currency: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
  status: 'completed' | 'pending';
  merchant?: string;
}

export interface CardInfo {
  id: string;
  type: string;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  holder: string;
  variant: 'classic' | 'gold' | 'black';
  status: 'active' | 'frozen';
  limit: number;
  spent: number;
}

export interface Statement {
  id: string;
  period: string;
  date: string;
  openingBalance: number;
  closingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
}

export interface UpcomingPayment {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
}

export const demoAccounts: Account[] = [
  {
    id: 'acc-001',
    type: 'Checking',
    name: 'Evercrest Premium Checking',
    number: '4827 **** **** 9153',
    routing: '021 000 089',
    availableBalance: 48250.75,
    currentBalance: 49180.50,
    pendingBalance: 929.75,
    currency: 'USD',
  },
  {
    id: 'acc-002',
    type: 'Savings',
    name: 'High-Yield Savings',
    number: '7193 **** **** 4602',
    routing: '021 000 089',
    availableBalance: 125400.00,
    currentBalance: 125400.00,
    pendingBalance: 0,
    currency: 'USD',
  },
  {
    id: 'acc-003',
    type: 'Investment',
    name: 'Growth Portfolio',
    number: '9034 **** **** 2871',
    routing: '021 000 089',
    availableBalance: 78920.30,
    currentBalance: 79450.80,
    pendingBalance: 530.50,
    currency: 'USD',
  },
];

export const demoTransactions: Transaction[] = [
  { id: 'tx-001', date: '2025-10-20', description: 'Whole Foods Market', category: 'Groceries', amount: 142.30, type: 'debit', status: 'completed', merchant: 'Whole Foods' },
  { id: 'tx-002', date: '2025-10-19', description: 'Salary Deposit', category: 'Income', amount: 8500.00, type: 'credit', status: 'completed' },
  { id: 'tx-003', date: '2025-10-18', description: 'Shell Gas Station', category: 'Transport', amount: 58.40, type: 'debit', status: 'completed', merchant: 'Shell' },
  { id: 'tx-004', date: '2025-10-17', description: 'Netflix Subscription', category: 'Entertainment', amount: 15.99, type: 'debit', status: 'completed', merchant: 'Netflix' },
  { id: 'tx-005', date: '2025-10-16', description: 'Transfer to Savings', category: 'Transfer', amount: 2000.00, type: 'debit', status: 'completed' },
  { id: 'tx-006', date: '2025-10-15', description: 'Amazon Purchase', category: 'Shopping', amount: 89.99, type: 'debit', status: 'completed', merchant: 'Amazon' },
  { id: 'tx-007', date: '2025-10-14', description: 'Interest Earned', category: 'Income', amount: 34.56, type: 'credit', status: 'completed' },
  { id: 'tx-008', date: '2025-10-13', description: 'Electric Bill', category: 'Utilities', amount: 187.50, type: 'debit', status: 'pending', merchant: 'ConEd' },
  { id: 'tx-009', date: '2025-10-12', description: 'Restaurant - The Smith', category: 'Dining', amount: 76.20, type: 'debit', status: 'completed', merchant: 'The Smith' },
  { id: 'tx-010', date: '2025-10-10', description: 'Dividend Payment', category: 'Income', amount: 245.00, type: 'credit', status: 'completed' },
];

export const demoCards: CardInfo[] = [
  {
    id: 'card-001',
    type: 'Credit',
    name: 'Evercrest Black Card',
    number: '5421 **** **** 8301',
    expiry: '09/28',
    cvv: '•••',
    holder: 'Alexander Hayes',
    variant: 'black',
    status: 'active',
    limit: 50000,
    spent: 12450.30,
  },
  {
    id: 'card-002',
    type: 'Debit',
    name: 'Evercrest Debit',
    number: '4827 **** **** 9153',
    expiry: '03/27',
    cvv: '•••',
    holder: 'Alexander Hayes',
    variant: 'gold',
    status: 'active',
    limit: 0,
    spent: 0,
  },
];

export const demoStatements: Statement[] = [
  { id: 'st-001', period: 'September 2025', date: '2025-10-01', openingBalance: 41200.00, closingBalance: 49180.50, totalDeposits: 12780.00, totalWithdrawals: 4800.00 },
  { id: 'st-002', period: 'August 2025', date: '2025-09-01', openingBalance: 38500.00, closingBalance: 41200.00, totalDeposits: 11500.00, totalWithdrawals: 8800.00 },
  { id: 'st-003', period: 'July 2025', date: '2025-08-01', openingBalance: 42000.00, closingBalance: 38500.00, totalDeposits: 9800.00, totalWithdrawals: 13300.00 },
  { id: 'st-004', period: 'June 2025', date: '2025-07-01', openingBalance: 45000.00, closingBalance: 42000.00, totalDeposits: 10000.00, totalWithdrawals: 13000.00 },
];

export const demoNotifications: NotificationItem[] = [
  { id: 'n-001', title: 'Statement Available', message: 'Your September 2025 statement is now available for download.', date: '2025-10-20', type: 'info', read: false },
  { id: 'n-002', title: 'Large Transaction Alert', message: 'A transaction of $142.30 was made at Whole Foods Market.', date: '2025-10-20', type: 'warning', read: false },
  { id: 'n-003', title: 'Salary Deposited', message: 'Your salary deposit of $8,500.00 has been credited.', date: '2025-10-19', type: 'success', read: true },
  { id: 'n-004', title: 'New Device Login', message: 'A new device logged into your account. If this was not you, please contact support.', date: '2025-10-18', type: 'warning', read: true },
];

export const demoUpcomingPayments: UpcomingPayment[] = [
  { id: 'up-001', name: 'Mortgage Payment', amount: 2200.00, dueDate: '2025-11-01', category: 'Housing' },
  { id: 'up-002', name: 'Electric Bill', amount: 187.50, dueDate: '2025-10-28', category: 'Utilities' },
  { id: 'up-003', name: 'Insurance Premium', amount: 340.00, dueDate: '2025-10-30', category: 'Insurance' },
  { id: 'up-004', name: 'Streaming Bundle', amount: 45.98, dueDate: '2025-11-05', category: 'Entertainment' },
];

export const monthlySpending = [
  { month: 'May', amount: 3200 },
  { month: 'Jun', amount: 2800 },
  { month: 'Jul', amount: 4100 },
  { month: 'Aug', amount: 3600 },
  { month: 'Sep', amount: 4800 },
  { month: 'Oct', amount: 3900 },
];

export const spendingByCategory = [
  { category: 'Groceries', amount: 680, color: '#1e3559' },
  { category: 'Dining', amount: 420, color: '#3a5f8a' },
  { category: 'Transport', amount: 310, color: '#5a7faa' },
  { category: 'Shopping', amount: 590, color: '#c08a2e' },
  { category: 'Utilities', amount: 380, color: '#d4a347' },
  { category: 'Entertainment', amount: 165, color: '#deb867' },
];

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
