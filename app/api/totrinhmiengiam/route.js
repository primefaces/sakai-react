import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const { count, data, error } = await supabase
    .from('to_trinh_mien_giam')
    .select('*, khach_hang(*)', { count: 'exact' })

  if (error) {
    return NextResponse.json(error, { status: 400 })
  }

  return NextResponse.json({ count: count, next: null, previous: null, results: data })
}

export async function POST(request) {
  const res = await request.json()

  const { error } = await supabase.from('to_trinh_mien_giam').insert(res)

  if (error) {
    return NextResponse.json(error, { status: 400 })
  }

  return NextResponse.json({ message: 'Tờ trình mới đã được tạo' }, { status: 201 })
}
