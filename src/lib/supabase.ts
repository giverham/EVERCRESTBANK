import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://njqytvtzmvwuzuybehcp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const hasSupabaseEnv = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;

// Client for the Customer Portal
export const supabaseCustomer = createClient(supabaseUrl, supabaseAnonKey || 'placeholder-key', {
  auth: {
    storageKey: 'evercrest-customer-auth',
  }
});

// Client for the Admin Portal
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey || 'placeholder-key', {
  auth: {
    storageKey: 'evercrest-admin-auth',
  }
});

// Default client for backwards compatibility
export const supabase = supabaseCustomer;

