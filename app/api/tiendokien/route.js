import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'

export async function GET() {
  const { count, data, error } = await supabase.from('TienDoKien_ThiHanhAn').select(`*`, { count: 'exact' })

  if (error) {
    return NextResponse.json(error)
  }

  return NextResponse.json({ count: count, next: null, previous: null, results: data })
}

export async function POST() {
  const res = await request.json()
  const dataToCreate = res.body
  /* 
    res.body sent from FE and we have
    dataToCreate = {
    "IDKhachHang" = '',
    "SoTienKK" = '',
    "TrangThaiKK" = '',
    "TrangThaiTHA" = '',
    "TrangThaiAP" = '',
    "Tinh_TP" = '',
    "Quan_Huyen" = '',
    }
    */

  // Check logic IDKhachHang
  if (!dataToCreate['IDKhachHang'] || isNaN(parseInt(dataToCreate['IDKhachHang']))) {
    return NextResponse.json({ body: 'Invalid or missing "IDKhachHang" parameter' }, { status: 400 })
  }
  const { error } = await supabase.from('TienDoKien_ThiHanhAn').insert(dataToCreate)
  if (error) {
    return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
  }
  return NextResponse.json({ body: 'Inserted' }, { status: 200 })
}
