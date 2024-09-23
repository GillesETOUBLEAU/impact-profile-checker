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
  }
})

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Error connecting to Supabase:', error.message)
    toast.error('Failed to connect to the database. Please try again later.')
  } else {
    console.log('Supabase connection successful')
  }
})

export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('site_config').select('*').limit(1)
    if (error) throw error
    console.log('Supabase connection check successful')
    return true
  } catch (error) {
    console.error('Supabase connection check failed:', error.message)
    toast.error('Failed to connect to the database. Please check your internet connection and try again.')
    return false
  }
}
