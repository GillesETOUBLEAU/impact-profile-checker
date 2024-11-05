import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  toast.error('Configuration error. Please check the application settings.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-retry-after': '5'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
})

// Test the connection with retry logic
export const checkSupabaseConnection = async () => {
  const maxRetries = 3;
  let retryCount = 0;

  const tryConnection = async () => {
    try {
      const { data, error } = await supabase.from('site_config').select('*').limit(1)
      if (error) throw error
      console.log('Supabase connection check successful')
      return true
    } catch (error) {
      if (error.status === 429 && retryCount < maxRetries) {
        retryCount++;
        const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
        toast.error(`Rate limit exceeded. Retrying in ${waitTime/1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return tryConnection();
      }
      
      console.error('Supabase connection check failed:', error.message)
      toast.error('Failed to connect to the database. Please check your internet connection and try again.')
      return false
    }
  }

  return tryConnection();
}