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
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-retry-after': '5'
    }
  }
});

// Test the connection with retry logic
export const checkSupabaseConnection = async () => {
  const maxRetries = 3;
  let retryCount = 0;

  const tryConnection = async () => {
    try {
      console.log('Attempting Supabase connection...');
      const { data, error } = await supabase
        .from('impact_profile_tests')
        .select('count')
        .limit(1);
        
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Supabase connection successful:', data);
      return true;
    } catch (error) {
      console.error('Connection attempt failed:', error);
      
      if (error.status === 429 && retryCount < maxRetries) {
        retryCount++;
        const waitTime = Math.pow(2, retryCount) * 1000;
        console.log(`Retrying in ${waitTime/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return tryConnection();
      }
      
      toast.error('Failed to connect to the database. Please check your internet connection and try again.');
      return false;
    }
  };

  return tryConnection();
};

// Initialize connection check
checkSupabaseConnection().then(isConnected => {
  if (isConnected) {
    console.log('Database connection established successfully');
  } else {
    console.error('Failed to establish database connection');
  }
});