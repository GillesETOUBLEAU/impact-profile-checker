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
    detectSessionInUrl: true,
    storage: window.localStorage
  }
});

// Test the connection and table access immediately
const testConnection = async () => {
  try {
    console.log('Testing database connection...');
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session ? 'Active' : 'None');

    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('*')
      .limit(1);

    if (error) {
      console.error('Database connection error:', error);
      toast.error(`Database error: ${error.message}`);
      return;
    }

    console.log('Database connection successful');
    if (data && data.length > 0) {
      console.log('Sample data structure:', Object.keys(data[0]));
    } else {
      console.log('No data found in table');
    }
  } catch (err) {
    console.error('Connection test failed:', err);
    toast.error('Failed to connect to database');
  }
};

testConnection();