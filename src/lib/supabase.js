import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error('VITE_SUPABASE_URL is not defined in environment variables')
}

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Log the Supabase URL (but not the key for security reasons)
console.log('Supabase URL:', supabaseUrl)
