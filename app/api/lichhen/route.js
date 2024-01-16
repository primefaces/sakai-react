import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'
import { getDateTime } from './helpers'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const obj = Object.fromEntries(searchParams.entries())

  // const id = obj['IDKhachHang'] ? obj['IDKhachHang'] : ''
  const offset = obj['offset'] ? parseInt(obj['offset']) : 0 // Offset default = 0
  const limit = obj['limit'] ? parseInt(obj['limit']) : 10 // Limit default = 10

  if (obj['offset'] && obj['limit']) {
    const { data, error } = await supabase
      .from('lich_hen')
      .select(`*, KhachHang (Ho_ten, CCCD), tien_do_khoi_kien (*, NhanVien (HoTen))`)
      .order('thoi_gian_cap_nhat', { ascending: false })
      .range(offset, limit)
    if (error) {
      return NextResponse.json(
        {
          body: JSON.stringify(error),
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { count: data.length, next: null, previous: null, results: data },
      { status: 200 }
    )
  } else {
    const { count, data, error } = await supabase
      .from('lich_hen')
      .select(`*, KhachHang (Ho_ten, CCCD), tien_do_khoi_kien (*)`)
      .order('thoi_gian_cap_nhat', { ascending: false })
    if (error) {
      return NextResponse.json(
        {
          body: JSON.stringify(error),
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { count: count, next: null, previous: null, results: data },
      { status: 200 }
    )
  }
}

export async function POST(request) {
  const res = await request.json()
  const dataToCreate = res.body
  /* 
      res.body sent from FE and we have
      dataToCreate = [{
      "trang_thai_ho_so" = '',
      "ngay_hen" = '',
      "noi_dung_hen" = '',
      "nguoi_tao_lich_hen" = '',
      "id_khoi_kien" = '',
      ""
      }]
      */
  // Check params
  dataToCreate.map((item) => {
    if (!item['trang_thai_ho_so']) {
      return NextResponse.json({ body: 'Missing "trang_thai_ho_so" parameter' }, { status: 400 })
    }
    if (!item['ngay_hen']) {
      return NextResponse.json({ body: 'Missing "ngay_hen" parameter' }, { status: 400 })
    }
    if (!item['noi_dung_hen']) {
      return NextResponse.json({ body: 'Missing "noi_dung_hen" parameter' }, { status: 400 })
    }
    if (!item['nguoi_tao_lich_hen']) {
      return NextResponse.json({ body: 'Missing "nguoi_tao_lich_hen" parameter' }, { status: 400 })
    }
    if (!item['id_khoi_kien']) {
      return NextResponse.json({ body: 'Missing "id_khoi_kien" parameter' }, { status: 400 })
    }
  })

  const newDataToCreate = dataToCreate.map((item) => {
    item.thoi_gian_cap_nhat = getDateTime()
    return item
  })

  const { error } = await supabase.from('lich_hen').insert(newDataToCreate)
  if (error) {
    return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
  }
  return NextResponse.json({ body: 'Inserted' }, { status: 200 })
}
