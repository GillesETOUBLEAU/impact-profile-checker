import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY

let supabase = null

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or API key is missing from environment variables')
  }
  
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  // Test the connection
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Error initializing Supabase client:', error.message)
    } else {
      console.log('Supabase client initialized successfully')
    }
  }).catch(err => {
    console.error('Unexpected error during Supabase initialization:', err.message)
  })

} catch (error) {
  console.error('Failed to initialize Supabase client:', error.message)
}

export { supabase }
