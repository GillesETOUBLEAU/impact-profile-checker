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
    persistSession: true,
    detectSessionInUrl: false,
    autoRefreshToken: true,
    storage: window?.localStorage
  },
  global: {
    headers: { 'x-application-name': 'impact-profile-checker' }
  }
});

// Test the connection immediately
console.log('Testing initial database connection...');
supabase.from('impact_profile_tests')
  .select('count')
  .limit(1)
  .single()
  .then(({ data, error }) => {
    if (error) {
      console.error('Initial database connection error:', error);
      toast.error(`Database connection error: ${error.message}`);
    } else {
      console.log('Initial database connection successful:', data);
    }
  });