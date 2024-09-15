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

  // Test the connection and email sending
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Error initializing Supabase client:', error.message)
    } else {
      console.log('Supabase client initialized successfully')
      // Test email sending
      supabase.auth.resetPasswordForEmail('test@example.com', {
        redirectTo: redirectUrl,
      }).then(({ data, error }) => {
        if (error) {
          console.error('Error testing email sending:', error.message)
        } else {
          console.log('Test email sent successfully')
        }
      })
    }
  }).catch(err => {
    console.error('Unexpected error during Supabase initialization:', err.message)
  })

} catch (error) {
  console.error('Failed to initialize Supabase client:', error.message)
}

export { supabase }
