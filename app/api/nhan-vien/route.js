import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'

async function queryHandler() {
  const { count, data, error } = await supabase.from('NhanVien').select('*', { count: 'exact' })

  if (error) {
    return NextResponse.json(error)
  }

  return NextResponse.json({ count: count, next: null, previous: null, results: data })
}

async function mutateHandler() {
  return NextResponse.json(
    {
      error: 'Method Not Allowed',
      message: 'The requested method is not allowed for the resource.'
    },
    {
      status: 405
    }
  )
}

export { queryHandler as GET, mutateHandler as POST }
