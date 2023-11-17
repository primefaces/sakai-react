import { supabase } from 'utils/supabaseClient'
import { NextResponse, NextRequest } from 'next/server'
import checkLogicParams from './helpers'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const obj = Object.fromEntries(searchParams.entries())

  const queryAll = obj['queryAll'] === 'true'
  if (queryAll) {
    const { count, data, error } = await supabase.from('NhanVien').select('*', { count: 'exact' })
    if (error) {
      return NextResponse.json({
        status: 500,
        body: JSON.stringify(error)
      })
    }
    // Sort ascending data by MaNhanVien
    data.sort((a, b) => a.MaNhanVien - b.MaNhanVien)

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

// export async function PUT(request) {
//   try {
//     const res = await request.json()
//     const dataToUpdate = res.body
//     /*
//     res.body sent from FE and we have
//     dataToUpdate = {
//       MaNhanVien: '',
//       HoTen: '',
//       SDT: '',
//       CCCD: '',
//       ChucDanh: '',
//       PhongBan: ''
//     }
//     */
//     const objLength = Object.keys(dataToUpdate).length
//     // If object has no params
//     if (objLength <= 1) {
//       return NextResponse.json({ body: 'Invalid or missing parameters' }, { status: 400 })
//     }

//     // Check logic MaNhanVien
//     if (!dataToUpdate.MaNhanVien || isNaN(parseInt(dataToUpdate.MaNhanVien))) {
//       return NextResponse.json({ body: 'Invalid or missing "ma_nv" parameter' }, { status: 400 })
//     }

//     try {
//       const checkLogic = checkLogicParams(dataToUpdate)
//     } catch (error) {
//       return error
//     }

//     const { error } = await supabase.from('NhanVien').update(dataToUpdate).eq('MaNhanVien', dataToUpdate.MaNhanVien)

//     if (error) {
//       return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
//     }

//     return NextResponse.json({ body: 'Updated' }, { status: 200 })
//   } catch (error) {
//     let error_response = {
//       body: error.message
//     }
//     return NextResponse.json(JSON.stringify(error_response), {
//       status: 500
//     })
//   }
// }

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
