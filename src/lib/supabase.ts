import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://njqytvtzmvwuzuybehcp.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qcXl0dnR6bXZ3dXp1eWJlaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2OTY2NzAsImV4cCI6MjA5OTI3MjY3MH0.srXMT4_yGgSGgijlPPpVEw4nrTBnRFfpXb1jYvDsAj0';

export const hasSupabaseEnv = true; // Always true now since we have solid public fallbacks


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

