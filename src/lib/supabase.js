import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tqvrsvdphejiwmtgxdvg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  console.error('VITE_SUPABASE_ANON_KEY is not defined in environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Log the Supabase URL (but not the key for security reasons)
console.log('Supabase URL:', supabaseUrl)
