const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://njqytvtzmvwuzuybehcp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qcXl0dnR6bXZ3dXp1eWJlaGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2OTY2NzAsImV4cCI6MjA5OTI3MjY3MH0.srXMT4_yGgSGgijlPPpVEw4nrTBnRFfpXb1jYvDsAj0';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("=== CUSTOMERS ===");
  const { data: customers } = await supabase.from('customers').select('*');
  console.log(customers);

  console.log("=== ACCOUNTS ===");
  const { data: accounts } = await supabase.from('accounts').select('*');
  console.log(accounts);

  console.log("=== ADMINS ===");
  const { data: admins } = await supabase.from('admins').select('*');
  console.log(admins);
}

run();
