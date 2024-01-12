'use client'

import { createBrowserClient } from '@supabase/ssr'

const createBrowser = () => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  return supabase
}

export default createBrowser
