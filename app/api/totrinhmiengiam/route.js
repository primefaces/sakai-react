import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const { count, data, error } = await supabase
    .from('to_trinh_mien_giam')
    .select(`*, khach_hang(*)`, { count: 'exact' })

  if (error) {
    return NextResponse.json(error)
  }

  return NextResponse.json({ count: count, next: null, previous: null, results: data })
}
