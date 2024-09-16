import { createClient } from '@supabase/supabase-js'
import { toast } from 'sonner'

const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_API_KEY
const redirectUrl = import.meta.env.VITE_SUPABASE_REDIRECT_URL

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
      flowType: 'pkce',
      storage: window.localStorage,
      storageKey: 'supabase-auth-token',
    },
  })

  // Test the connection and session
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Error getting session:', error.message)
      toast.error('Error connecting to Supabase. Please try refreshing the page.')
    } else if (data.session) {
      console.log('Session found:', data.session)
    } else {
      console.log('No active session')
    }
  }).catch(err => {
    console.error('Unexpected error during Supabase initialization:', err.message)
    toast.error('Unexpected error. Please try refreshing the page.')
  })

  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('User signed in:', session)
    } else if (event === 'SIGNED_OUT') {
      console.log('User signed out')
    } else if (event === 'TOKEN_REFRESHED') {
      console.log('Token refreshed')
    }
  })

} catch (error) {
  console.error('Failed to initialize Supabase client:', error.message)
  toast.error('Failed to initialize Supabase client. Please check your configuration.')
}

export { supabase }
