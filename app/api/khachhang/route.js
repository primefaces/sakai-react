import { supabase } from 'utils/supabaseClient'
import { NextResponse, NextRequest } from 'next/server'
import checkLogicParams from './helpers'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const obj = Object.fromEntries(searchParams.entries())

  const queryAll = obj['queryAll'] === 'true'
  if (queryAll) {
    const { count, data, error } = await supabase.from('KhachHang').select('*', { count: 'exact' })
    if (error) {
      return NextResponse.json({
        status: 500,
        body: JSON.stringify(error)
      })
    }
    // Sort ascending data by IDKhachHang
    data.sort((a, b) => a.IDKhachHang - b.IDKhachHang)

    return NextResponse.json({ count: count, results: data })
  } else {
    if (obj['queryAll'] !== 'false') {
      return NextResponse.json({
        status: 400,
        body: 'Invalid parameter'
      })
    } else {
      return NextResponse.json({
        status: 200,
        body: 'No queries'
      })
    }
  }
}

export async function POST(request) {
  try {
    const res = await request.json()
    const dataToCreate = res.body
    /* 
    res.body sent from FE and we have
    dataToCreate = {
      IDKhachHang: '',
      Ho_ten: '', 
      CCCD: '', 
      Email: '',
      SDT: '', 
      DiaChiThuongTru: '',
      DiaChiTamTru: '',
      TenCongTy: '',
      DiaChiCongTy: ''
    }
    */
    const objLength = Object.keys(dataToCreate).length
    // If object has no params
    if (objLength <= 1) {
      return NextResponse.json({ body: 'Invalid or missing parameters' }, { status: 400 })
    }

    // Check logic IDKhachHang
    if (!dataToCreate['IDKhachHang'] || isNaN(parseInt(dataToCreate['IDKhachHang']))) {
      return NextResponse.json({ body: 'Invalid or missing "IDKhachHang" parameter' }, { status: 400 })
    }

    try {
      const checkLogic = checkLogicParams(dataToCreate)
    } catch (error) {
      return error
    }

    const { error } = await supabase.from('KhachHang').insert(dataToCreate)

    if (error) {
      return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
    }

    return NextResponse.json({ body: 'Inserted' }, { status: 200 })
  } catch (error) {
    let error_response = {
      body: error.message
    }
    return NextResponse.json(JSON.stringify(error_response), {
      status: 500
    })
  }
}
