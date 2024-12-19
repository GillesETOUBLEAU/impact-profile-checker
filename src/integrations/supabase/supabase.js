import { createClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  toast.error('Configuration error. Please check the application settings.');
  throw new Error('Missing Supabase configuration');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  headers: {
    'Content-Type': 'application/json'
  },
  db: {
    schema: 'public'
  }
});

// Test the connection
export const checkSupabaseConnection = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Current session:', session); // Debug log

    const { data, error } = await supabase
      .from('impact_profile_tests')
      .select('count')
      .limit(1)
      .single();
      
    if (error) {
      console.error('Supabase connection error:', error);
      toast.error('Database connection error');
      throw error;
    }
    
    console.log('Supabase connection successful:', data);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    toast.error('Failed to connect to the database');
    return false;
  }
};

// Initialize connection check
checkSupabaseConnection().then(isConnected => {
  if (isConnected) {
    console.log('Database connection established');
  } else {
    console.error('Failed to establish database connection');
  }
});