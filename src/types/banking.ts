export interface Account {
  id: string;
  type: string;
  name: string;
  number: string;
  routing: string;
  availableBalance: number;
  currentBalance: number;
  pendingBalance: number;
  available_balance?: number;
  current_balance?: number;
  pending_balance?: number;
  currency: string;
  is_fixed_savings?: boolean;
  is_investment?: boolean;
  status?: string;
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
  account_id?: string;
  created_at?: string;
  running_balance?: number;
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
  card_limit?: number;
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
  opening_balance?: number;
  closing_balance?: number;
  total_deposits?: number;
  total_withdrawals?: number;
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
  due_date?: string;
  category: string;
}
