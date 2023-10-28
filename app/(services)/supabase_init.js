import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxzwzgblvfdjwphlmdqx.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
