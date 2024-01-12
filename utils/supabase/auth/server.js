import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const cookieStore = cookies()

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    cookies: {
      get(name) {
        return cookieStore.get(name)?.value
      },
    },
  }
)

export default supabase
