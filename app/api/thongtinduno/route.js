import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'

async function queryAll() {
  const { count, data, error } = await supabase.from('ThongTinDuNo').select('*', { count: 'exact' })

  if (error) {
    return NextResponse.json(error)
  }

  return NextResponse.json({ count: count, next: null, previous: null, results: data })
}

export async function queryCustomerID(id) {
  const { count, data, error } = await supabase
    .from('ThongTinDuNo')
    .select('*', { count: 'exact' })
    .eq('IDKhachHang', id)

  if (error) {
    return NextResponse.json(error)
  }

  return NextResponse.json({ count: count, next: null, previous: null, results: data })
}

export async function queryEmployeeID(id) {
  const { count, data, error } = await supabase
    .from('ThongTinDuNo')
    .select('*', { count: 'exact' })
    .eq('NhanVienCapNhat', id)

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

export { queryAll as GET, mutateHandler as POST }
