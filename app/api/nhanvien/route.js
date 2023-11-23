import { supabase } from 'utils/supabaseClient'
import { NextResponse, NextRequest } from 'next/server'
import checkLogicParams from './helpers'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const obj = Object.fromEntries(searchParams.entries())

  const offset = obj['offset'] ? parseInt(obj['offset']) : 0 // Offset default = 0
  const limit = obj['limit'] ? parseInt(obj['limit']) : 20 // Limit default = 20
  // console.log(offset, limit)
  if (obj['offset'] && obj['limit']) {
    const { data, error } = await supabase.from('NhanVien').select('*').range(offset, limit)
    if (error) {
      return NextResponse.json(
        {
          body: JSON.stringify(error)
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ count: data.length, next: null, previous: null, results: data }, { status: 200 })
  } else {
    // If no offset and limit, query all of data
    const { count, data, error } = await supabase.from('NhanVien').select('*', { count: 'exact' })
    if (error) {
      return NextResponse.json(
        {
          body: JSON.stringify(error)
        },
        { status: 500 }
      )
    }
    return NextResponse.json({ count: count, next: null, previous: null, results: data }, { status: 200 })
  }
}

export async function POST(request) {
  try {
    const res = await request.json()
    const dataToCreate = res.body
    /* 
    res.body sent from FE and we have
    dataToCreate = {
      MaNhanVien: '',
      HoTen: '', 
      SDT: '', 
      Email: '',
      CCCD: '', 
      ChucDanh: '', 
      PhongBan: ''
    }
    */
    const objLength = Object.keys(dataToCreate).length
    // If object has no params
    if (objLength <= 1) {
      return NextResponse.json({ body: 'Invalid or missing parameters' }, { status: 400 })
    }

    // // Check logic MaNhanVien
    // if (!dataToCreate['MaNhanVien'] || isNaN(parseInt(dataToCreate['MaNhanVien']))) {
    //   return NextResponse.json({ body: 'Invalid or missing "MaNhanVien" parameter' }, { status: 400 })
    // }

    try {
      const checkLogic = checkLogicParams(dataToCreate)
    } catch (error) {
      return error
    }

    const { data, error } = await supabase.from('NhanVien').insert(dataToCreate).select('Email, encrypted_password')

    if (error) {
      return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
    }
    // Register new employee user to Supabase Auth
    const { data1, error1 } = await supabase.auth.signUp({
      email: data[0].Email,
      password: data[0].encrypted_password
    })
    if (error1) {
      return NextResponse.json({ body: JSON.stringify(error1) }, { status: 500 })
    }
    return NextResponse.json({ body: 'Inserted', results: data }, { status: 200 })
  } catch (error) {
    let error_response = {
      body: error.message
    }
    return NextResponse.json(JSON.stringify(error_response), {
      status: 500
    })
  }
}
