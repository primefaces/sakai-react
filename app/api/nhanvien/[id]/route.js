import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'
import checkLogicParams from '../helpers'

export async function GET(request, { params }) {
  const id = params.id
  if (!id || isNaN(parseInt(id))) {
    return NextResponse.json(
      {
        body: 'Invalid or missing "MaNhanVien" parameter'
      },
      {
        status: 400
      }
    )
  }
  const { count, data, error } = await supabase.from('NhanVien').select('*', { count: 'exact' }).eq('MaNhanVien', id)
  if (error) {
    return NextResponse.json(
      {
        body: JSON.stringify(error)
      },
      {
        status: 500
      }
    )
  }
  return NextResponse.json({ count: count, results: data }, { status: 200 })
}

export async function PATCH(request, { params }) {
  try {
    const id = params.id
    // const queryAll = obj['queryAll'] === 'true'
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          body: 'Invalid or missing "MaNhanVien" parameter'
        },
        {
          status: 400
        }
      )
    }
    const res = await request.json()
    /* 
      request.json() = {
        body: {}
      }
    */
    const dataToUpdate = res.body

    try {
      const checkLogic = checkLogicParams(dataToUpdate)
    } catch (error) {
      return error
    }
    const { error } = await supabase.from('NhanVien').update(dataToUpdate).eq('MaNhanVien', id)

    if (error) {
      return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
    }

    // console.log(JSON.stringify(data))
    return NextResponse.json({ body: 'Updated' }, { status: 200 })
  } catch (error) {
    let error_response = {
      body: error.message
    }
    return NextResponse.json(JSON.stringify(error_response), {
      status: 500
    })
  }
}

export async function PUT(request, { params }) {
  try {
    const id = params.id
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          body: 'Invalid or missing "MaNhanVien" parameter'
        },
        {
          status: 400
        }
      )
    }
    const res = await request.json()
    const dataToUpdate = res.body
    /* 
    res.body sent from FE and we have
    dataToUpdate = {
      HoTen: '', 
      SDT: '', 
      CCCD: '', 
      ChucDanh: '', 
      PhongBan: ''
    }
    */
    try {
      const checkLogic = checkLogicParams(dataToUpdate)
    } catch (error) {
      return error
    }

    const { error } = await supabase.from('NhanVien').update(dataToUpdate).eq('MaNhanVien', id)

    if (error) {
      return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
    }

    return NextResponse.json({ body: 'Updated' }, { status: 200 })
  } catch (error) {
    let error_response = {
      body: error.message
    }
    return NextResponse.json(JSON.stringify(error_response), {
      status: 500
    })
  }
}

export async function DELETE(request, { params }) {
  try {
    const idToDelete = params.id

    // const idToDelete = obj.ma_nv
    if (!idToDelete || isNaN(parseInt(idToDelete))) {
      return NextResponse.json({
        status: 400,
        body: 'Invalid or missing "MaNhanVien" parameter'
      })
    }
    // Construct and execute the Supabase delete query
    const { error } = await supabase.from('NhanVien').delete().eq('MaNhanVien', idToDelete) //

    if (error) {
      return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
    }

    return NextResponse.json(
      { body: 'Record deleted successfully' },
      {
        status: 200
      }
    )
  } catch (error) {
    return NextResponse.json({ body: JSON.stringify({ error: 'Internal server error' }) }, { status: 500 })
  }
}
