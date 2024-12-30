import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;
const redirectTo = import.meta.env.VITE_SUPABASE_REDIRECT_URL;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  toast.error('Configuration error. Please check the application settings.');
  throw new Error('Missing Supabase configuration');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);
console.log('Redirect URL:', redirectTo);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Test the connection and table access immediately
console.log('Testing database connection and table access...');
supabase
  .from('impact_profile_tests')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('Database connection error:', error);
      toast.error(`Database error: ${error.message}`);
    } else {
      console.log('Database connection successful');
      console.log('Sample data:', data);
      console.log('Table structure:', Object.keys(data?.[0] || {}));
    }
  });