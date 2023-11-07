import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { data, error } = await supabase
    .from('to_trinh_mien_giam')
    .select('*, khach_hang(*)')
    .eq('ma_to_trinh', params.slug)

  if (error) {
    return NextResponse.json(error, { status: 400 })
  }

  if (data.length === 0) {
    return NextResponse.json({ message: 'Không tìm thấy tờ trình' }, { status: 404 })
  }

  return NextResponse.json(data[0])
}

export async function PATCH(request, { params }) {
  const res = await request.json()

  const { error } = await supabase.from('to_trinh_mien_giam').update(res).eq('ma_to_trinh', params.slug)

  if (error) {
    return NextResponse.json(error, { status: 400 })
  }

  return NextResponse.json({ message: 'Tờ trình đã được cập nhật' })
}

export async function DELETE(request, { params }) {
  const { error } = await supabase.from('to_trinh_mien_giam').delete().eq('ma_to_trinh', params.slug)

  if (error) {
    return NextResponse.json(error, { status: 400 })
  }

  return NextResponse.json({ message: 'Tờ trình đã được xóa' })
}
