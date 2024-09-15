import { createClient } from '@supabase/supabase-js'

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
      redirectTo: redirectUrl,
    },
    global: {
      fetch: (...args) => fetch(...args).then(async (res) => {
        if (!res.ok) {
          const errorBody = await res.text();
          console.error('Supabase API Error:', {
            status: res.status,
            statusText: res.statusText,
            body: errorBody,
          });
          throw new Error(`HTTP error! status: ${res.status}, body: ${errorBody}`);
        }
        return res;
      }),
    },
  })

  // Test the connection
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Error initializing Supabase client:', error.message)
      console.error('Full error object:', error)
    } else {
      console.log('Supabase client initialized successfully')
      console.log('Session data:', data)
    }
  }).catch(err => {
    console.error('Unexpected error during Supabase initialization:', err.message)
    console.error('Full error object:', err)
  })

  // Log the current URL
  console.log('Current URL:', window.location.href)

  // Check for authentication code in URL
  const urlParams = new URLSearchParams(window.location.search);
  const authCode = urlParams.get('code');
  if (authCode) {
    console.log('Authentication code detected:', authCode)
    supabase.auth.exchangeCodeForSession(authCode).then(({ data, error }) => {
      if (error) {
        console.error('Error exchanging code for session:', error.message)
        console.error('Full error object:', error)
      } else {
        console.log('Session created successfully')
        console.log('Session data:', data)
      }
    }).catch(err => {
      console.error('Unexpected error during code exchange:', err.message)
      console.error('Full error object:', err)
    })
  }

} catch (error) {
  console.error('Failed to initialize Supabase client:', error.message)
  console.error('Full error object:', error)
}

export { supabase }
