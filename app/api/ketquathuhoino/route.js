import { supabase } from 'utils/supabaseClient'
import { NextResponse, NextRequest } from 'next/server'
import { checkLogicParamsKQTHN, initiateId, getPrecode } from './helpers'

export async function POST(request) {
  try {
    const res = await request.json()
    const dataToCreate = res.body
    /* 
      res.body sent from FE and we have
      dataToCreate = {
        IDKhachHang: '',
        ten_hanh_dong: '', 
        loai_hanh_dong: '', 
        ket_qua: '',
         ghi_chu: '',
      }
      */
    const objLength = Object.keys(dataToCreate).length
    // If object has no params
    if (objLength <= 1) {
      return NextResponse.json({ body: 'Invalid or missing parameters' }, { status: 400 })
    }

    // Check logic IDKhachHang
    if (!dataToCreate['IDKhachHang'] || isNaN(parseInt(dataToCreate['IDKhachHang']))) {
      return NextResponse.json(
        { body: 'Invalid or missing "IDKhachHang" parameter' },
        { status: 400 }
      )
    } else {
      // if IDKhachHang is exist
      const { data, error } = await supabase.from('ket_qua_thu_hoi_no').select(`IDKhachHang`)
      const foundData = data.filter((item) => item['IDKhachHang'] == dataToCreate['IDKhachHang'])
      if (foundData.length > 0) {
        return NextResponse.json(
          { error: 'Debt recovery action of this IDKhachHang has already exist' },
          { status: 400 }
        )
      }
    }

    try {
      const checkLogic = checkLogicParamsKQTHN(dataToCreate)
    } catch (error) {
      return error
    }

    // create ma_ket_qua_hd
    const { count, data, error1 } = await supabase
      .from('ket_qua_thu_hoi_no')
      .select(`ma_ket_qua_hd`, { count: 'exact' })
    const precode = getPrecode(dataToCreate['loai_hanh_dong'], dataToCreate['ten_hanh_dong'])
    const data2 = data.filter((item) => item.ma_ket_qua_hd.includes(precode))
    data2.sort((a, b) => {
      let fa = a.ma_ket_qua_hd.toLowerCase(),
        fb = b.ma_ket_qua_hd.toLowerCase()

      if (fa > fb) {
        return -1
      }
      if (fa < fb) {
        return 1
      }
      return 0
    })
    dataToCreate['ma_ket_qua_hd'] =
      data2.length > 0 ? initiateId(data2[0].ma_ket_qua_hd) : initiateId(precode)

    const { error } = await supabase.from('ket_qua_thu_hoi_no').insert(dataToCreate)

    if (error) {
      return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
    }

    return NextResponse.json({ body: 'Inserted' }, { status: 200 })
  } catch (error) {
    let error_response = {
      body: error.message,
    }
    return NextResponse.json(JSON.stringify(error_response), {
      status: 500,
    })
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const obj = Object.fromEntries(searchParams.entries())

  const id = obj['IDKhachHang'] ? obj['IDKhachHang'] : ''
  const offset = obj['offset'] ? parseInt(obj['offset']) : 0 // Offset default = 0
  const limit = obj['limit'] ? parseInt(obj['limit']) : 10 // Limit default = 10

  // if get action by IDKhachHang
  if (id) {
    const { count, data, error } = await supabase
      .from('ket_qua_thu_hoi_no')
      .select(`*, KhachHang (Ho_ten, CCCD)`)
      .eq('IDKhachHang', id)
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
  }

  if (obj['offset'] && obj['limit']) {
    const { data, error } = await supabase
      .from('ket_qua_thu_hoi_no')
      .select(`*, KhachHang (Ho_ten, CCCD)`)
      .range(offset, limit)
      .order('last_edited_at', { ascending: false })
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
      .from('ket_qua_thu_hoi_no')
      .select(`*, KhachHang (Ho_ten, CCCD)`, { count: 'exact' })
      .order('last_edited_at', { ascending: false })
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
