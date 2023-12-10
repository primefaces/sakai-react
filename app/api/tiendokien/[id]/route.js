import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { data, error } = await supabase.from('TienDoKien_ThiHanhAn').select('*').eq('id', params.id)

  if (error) {
    return NextResponse.json(error, { status: 400 })
  }

  if (data.length === 0) {
    return NextResponse.json({ message: 'Không tìm thấy tiến độ kiện, thi hành án' }, { status: 404 })
  }

  return NextResponse.json(data[0])
}

export async function PATCH(request, { params }) {
  const res = await request.json()

  const { error } = await supabase.from('TienDoKien_ThiHanhAn').update(res).eq('id', params.id)

  if (error) {
    return NextResponse.json(error, { status: 400 })
  }

  return NextResponse.json({ message: 'Tiến độ kiện đã được cập nhật' })
}

export async function DELETE(request, { params }) {
  const { error } = await supabase.from('TienDoKien_ThiHanhAn').delete().eq('id', params.id)

  if (error) {
    return NextResponse.json(error, { status: 400 })
  }

  return NextResponse.json({ message: 'Tiến độ kiện đã được xóa' })
}
