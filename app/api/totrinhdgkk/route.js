import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const { count, data, error } = await supabase
    .from('ToTrinhDanhGiaKhoiKien')
    .select(`*, KhachHang(*)`, { count: 'exact' })

  if (error) {
    return NextResponse.json(error)
  }

  return NextResponse.json({ count: count, next: null, previous: null, results: data })
}

export async function POST() {
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
