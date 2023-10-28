import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://sxzwzgblvfdjwphlmdqx.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4end6Z2JsdmZkandwaGxtZHF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTYxODIzMzIsImV4cCI6MjAxMTc1ODMzMn0.7UB26dzrx6kk1J41UlIk4bR1d7xaX670lXhd5ljK270'
export const supabase = createClient(supabaseUrl, supabaseKey)
