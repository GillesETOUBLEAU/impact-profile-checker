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
      
      // Test email sending with signUp
      const testEmail = `test${Date.now()}@example.com`
      const testPassword = 'testpassword123'
      
      supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      }).then(({ data, error }) => {
        if (error) {
          console.error('Error testing email sending:', error.message)
          console.error('Full error object:', error)
        } else {
          console.log('Test signup successful, verification email should be sent')
          console.log('Signup response:', data)
          
          // Check if email confirmation is required
          if (data.user && data.user.identities && data.user.identities.length === 0) {
            console.log('Email confirmation is required. Check your Supabase Email settings.')
          } else {
            console.log('User created without email confirmation. Check your Supabase Email settings if this is not intended.')
          }
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
