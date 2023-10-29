import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxzwzgblvfdjwphlmdqx.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public'
  },
  auth: {
    persistSession: true
  }
})
