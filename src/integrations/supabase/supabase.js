import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  toast.error('Configuration error. Please check the application settings.');
  throw new Error('Missing Supabase configuration');
}

console.log('Initializing Supabase client with URL:', supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: window.localStorage
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Test the connection immediately
console.log('Testing initial database connection...');
supabase.from('impact_profile_tests')
  .select('count')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error('Initial database connection error:', error);
      toast.error('Failed to connect to database');
    } else {
      console.log('Initial database connection successful:', data);
    }
  });