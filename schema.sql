-- Customers Profile Table
CREATE TABLE IF NOT EXISTS public.customers (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view their own profile" ON public.customers FOR SELECT USING (auth.uid() = id);

-- Admins Profile Table
CREATE TABLE IF NOT EXISTS public.admins (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  avatar text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view their own profile" ON public.admins FOR SELECT USING (auth.uid() = id);

-- Accounts Table
CREATE TABLE IF NOT EXISTS public.accounts (
  id text PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) NOT NULL,
  type text NOT NULL,
  name text NOT NULL,
  number text NOT NULL,
  routing text NOT NULL,
  available_balance numeric(10,2) NOT NULL DEFAULT 0.00,
  current_balance numeric(10,2) NOT NULL DEFAULT 0.00,
  pending_balance numeric(10,2) NOT NULL DEFAULT 0.00,
  currency text NOT NULL DEFAULT 'USD',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own accounts" ON public.accounts FOR SELECT USING (customer_id = auth.uid());

-- Transactions Table
CREATE TABLE IF NOT EXISTS public.transactions (
  id text PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) NOT NULL,
  account_id text REFERENCES public.accounts(id),
  date text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  amount numeric(10,2) NOT NULL,
  type text NOT NULL,
  status text NOT NULL,
  merchant text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own transactions" ON public.transactions FOR SELECT USING (customer_id = auth.uid());

-- Cards Table
CREATE TABLE IF NOT EXISTS public.cards (
  id text PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) NOT NULL,
  type text NOT NULL,
  name text NOT NULL,
  number text NOT NULL,
  expiry text NOT NULL,
  cvv text NOT NULL,
  holder text NOT NULL,
  variant text NOT NULL,
  status text NOT NULL,
  card_limit numeric(10,2) NOT NULL DEFAULT 0.00,
  spent numeric(10,2) NOT NULL DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own cards" ON public.cards FOR SELECT USING (customer_id = auth.uid());

-- Statements Table
CREATE TABLE IF NOT EXISTS public.statements (
  id text PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) NOT NULL,
  period text NOT NULL,
  date text NOT NULL,
  opening_balance numeric(10,2) NOT NULL,
  closing_balance numeric(10,2) NOT NULL,
  total_deposits numeric(10,2) NOT NULL,
  total_withdrawals numeric(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.statements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own statements" ON public.statements FOR SELECT USING (customer_id = auth.uid());

-- Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  date text NOT NULL,
  type text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Upcoming Payments Table
CREATE TABLE IF NOT EXISTS public.upcoming_payments (
  id text PRIMARY KEY,
  customer_id uuid REFERENCES public.customers(id) NOT NULL,
  name text NOT NULL,
  amount numeric(10,2) NOT NULL,
  due_date text NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.upcoming_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Customers can view own payments" ON public.upcoming_payments FOR SELECT USING (customer_id = auth.uid());

-- Settings Table (Admin CMS)
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view public settings" ON public.settings FOR SELECT USING (true);

-- Admin Global Policies (Overrides RLS for admins)
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Admins can manage all customers" ON public.customers FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage all accounts" ON public.accounts FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage all transactions" ON public.transactions FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage all cards" ON public.cards FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage all statements" ON public.statements FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage all notifications" ON public.notifications FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage all upcoming payments" ON public.upcoming_payments FOR ALL USING (is_admin());
CREATE POLICY "Admins can manage settings" ON public.settings FOR ALL USING (is_admin());
