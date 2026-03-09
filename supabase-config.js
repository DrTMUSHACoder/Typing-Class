
// Supabase Configuration
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://kaaidothyqcojjplqyzf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthYWlkb3RoeXFjb2pqcGxxeXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMzYxOTIsImV4cCI6MjA4ODYxMjE5Mn0.C8uIBE7FwQd-T1t85TZtwIi5Xv71fegwcgq41omCD9A';

export const supabase = createClient(supabaseUrl, supabaseKey);
