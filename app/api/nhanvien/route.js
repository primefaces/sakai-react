import { supabase } from 'utils/supabaseClient'
import { NextResponse, NextRequest } from 'next/server'

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
    // Sort return data by MaNhanVien
    data.sort((a, b) => a.MaNhanVien - b.MaNhanVien)

    return NextResponse.json({ count: count, next: null, previous: null, results: data })
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

function checkStringIsNumber(string) {
  if (typeof string === 'string') {
    return !isNaN(string)
  }
  return false
}
function checkStringIsCharacters(string) {
  if (typeof string === 'string') {
    // Use a regular expression to check for only letters (a-zA-Z) and whitespace
    const regex = /^[a-zA-Z\s]+$/
    return regex.test(string)
  }
  return false
}

function checkPhoneNumber(x) {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return regex.test(x)
}

const checkLogicParams = obj => {
  const columnsToUpdate = {}
  const { ten_nv, sdt, cccd, role, department } = obj
  if (ten_nv) {
    if (checkStringIsCharacters(ten_nv)) {
      columnsToUpdate.HoTen = ten_nv
    } else {
      return {
        errorResponse: {
          status: 400,
          body: 'Invalid "ten_nv" parameter'
        }
      }
    }
  }

  if (sdt) {
    if (checkPhoneNumber(sdt)) {
      columnsToUpdate.SDT = sdt
    } else {
      return {
        errorResponse: {
          status: 400,
          body: 'Invalid "sdt" parameter'
        }
      }
    }
  }

  if (cccd) {
    if (checkStringIsNumber(cccd)) {
      columnsToUpdate.CCCD = cccd
    } else {
      return {
        errorResponse: {
          status: 400,
          body: 'Invalid "cccd" parameter'
        }
      }
    }
  }

  if (department) {
    if (checkStringIsCharacters(department)) {
      columnsToUpdate.PhongBan = department
    } else {
      return {
        errorResponse: {
          status: 400,
          body: 'Invalid "department" parameter'
        }
      }
    }
  }

  if (role) {
    if (checkStringIsCharacters(role)) {
      columnsToUpdate.ChucDanh = role
    } else {
      return {
        errorResponse: {
          status: 400,
          body: 'Invalid "role" parameter'
        }
      }
    }
  }

  return columnsToUpdate
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url)
    const obj = Object.fromEntries(searchParams.entries())
    const objLength = Object.keys(obj).length
    const { ma_nv } = obj

    // If object has no params
    if (objLength === 0) {
      return NextResponse.json({
        status: 400,
        body: 'Invalid or missing parameters'
      })
    }

    // Check logic ma_nv
    if (!ma_nv || isNaN(parseInt(ma_nv))) {
      return NextResponse.json({
        status: 400,
        body: 'Invalid or missing "MaNhanVien" parameter'
      })
    }

    // If object has only ma_nv param
    if (objLength === 1) {
      return NextResponse.json({
        status: 400,
        body: 'Invalid or missing parameters'
      })
    }

    const columnsToUpdate = checkLogicParams(obj)
    if (columnsToUpdate.errorResponse) {
      return NextResponse.json(columnsToUpdate.errorResponse)
    }

    const { error } = await supabase.from('NhanVien').update(columnsToUpdate).eq('MaNhanVien', ma_nv)

    if (error) {
      return NextResponse.json({
        status: 500,
        body: JSON.stringify(error)
      })
    }

    // console.log(JSON.stringify(data))
    return NextResponse.json({
      status: 204,
      statusText: 'Updated'
    })
  } catch (error) {
    let error_response = {
      status: 'error',
      message: error.message
    }
    return NextResponse.json(JSON.stringify(error_response), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST() {
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

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url)
    const obj = Object.fromEntries(searchParams.entries())
    const objLength = Object.keys(obj).length
    const { ma_nv } = obj

    // If object has no params
    if (objLength === 0) {
      return NextResponse.json({
        status: 400,
        body: 'Invalid or missing parameters'
      })
    }

    // Check logic ma_nv
    if (!ma_nv || isNaN(parseInt(ma_nv))) {
      return NextResponse.json({
        status: 400,
        body: 'Invalid or missing "MaNhanVien" parameter'
      })
    }

    // If object has only ma_nv param
    if (objLength === 1) {
      return NextResponse.json({
        status: 400,
        body: 'Invalid or missing parameters'
      })
    }

    const columnsToInsert = checkLogicParams(obj)
    if (columnsToInsert.errorResponse) {
      return NextResponse.json(columnsToInsert.errorResponse)
    }
    columnsToInsert.MaNhanVien = ma_nv

    const { error } = await supabase.from('NhanVien').insert(columnsToInsert)

    if (error) {
      return NextResponse.json({
        status: 500,
        body: JSON.stringify(error)
      })
    }
    return NextResponse.json({ status: 201, statusText: 'Created' })
  } catch (error) {
    let error_response = {
      status: 'error',
      message: error.message
    }
    return NextResponse.json(JSON.stringify(error_response), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const obj = Object.fromEntries(searchParams.entries())

    const idToDelete = obj.ma_nv
    if (!idToDelete || isNaN(parseInt(idToDelete))) {
      return NextResponse.json({
        status: 400,
        body: 'Invalid or missing "MaNhanVien" parameter'
      })
    }
    // Construct and execute the Supabase delete query
    const { error } = await supabase.from('NhanVien').delete().eq('MaNhanVien', parseInt(idToDelete)) //

    if (error) {
      return NextResponse.json({
        status: 500,
        body: JSON.stringify(error)
      })
    }

    return NextResponse.json({
      status: 200,
      body: JSON.stringify({ message: 'Record deleted successfully' })
    })
  } catch (error) {
    return NextResponse.json({
      status: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    })
  }
}
