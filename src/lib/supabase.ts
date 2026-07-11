import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Client for the Customer Portal
export const supabaseCustomer = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'evercrest-customer-auth',
  }
});

// Client for the Admin Portal
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'evercrest-admin-auth',
  }
});

// Default client for backwards compatibility (used mainly in public pages or when role doesn't matter)
export const supabase = supabaseCustomer;
