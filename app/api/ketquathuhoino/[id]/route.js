import { supabase } from 'utils/supabaseClient'
import { NextResponse } from 'next/server'
import { checkLogicParamsKQTHN } from '../helpers'

export async function GET(request, { params }) {
  try {
    const res = await request.json()
    const dataToUpdate = res.body
    console.log('params:', params)
    const id = params.id

    const { count, data, error } = await supabase
      .from('ket_qua_thu_hoi_no')
      .select(`ma_ket_qua_hd`, { count: 'exact' })
      .eq('ma_ket_qua_hd', id)
    if (!id) {
      return NextResponse.json(
        {
          body: 'Invalid or missing "IDKhachHang" parameter',
        },
        {
          status: 400,
        }
      )
    } else {
      try {
        const checkLogic = checkLogicParamsKQTHN(dataToUpdate)
      } catch (error) {
        return error
      }

      if (!data || data.length === 0) {
        return NextResponse.json(
          {
            body: "Debt recovery action of this IDKhachHang hasn't created yet",
          },
          {
            status: 400,
          }
        )
      } else {
        const { data, error } = await supabase
          .from('ket_qua_thu_hoi_no')
          .update({ ma_ket_qua_hd: id, ...dataToUpdate })
          .eq('ma_ket_qua_hd', id)

        if (error) {
          return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
        }

        return NextResponse.json({ body: 'Updated' }, { status: 200 })
      }
    }
  } catch (error) {
    let error_response = {
      body: error.message,
    }
    return NextResponse.json(JSON.stringify(error_response), {
      status: 500,
    })
  }
}

export async function PUT(request, { params }) {
  try {
    const res = await request.json()
    const dataToUpdate = res.body

    const id = params.id
    if (!id) {
      return NextResponse.json(
        {
          body: 'Invalid or missing "IDKhachHang" parameter',
        },
        {
          status: 400,
        }
      )
    } else {
      try {
        const checkLogic = checkLogicParamsKQTHN(dataToUpdate)
      } catch (error) {
        return error
      }

      const { count, data, error } = await supabase
        .from('ket_qua_thu_hoi_no')
        .select(`ma_ket_qua_hd`, { count: 'exact' })
        .eq('ma_ket_qua_hd', id)
      if (!data || data.length === 0) {
        return NextResponse.json(
          {
            body: "Debt recovery action of this IDKhachHang hasn't created yet",
          },
          {
            status: 400,
          }
        )
      } else {
        const { data, error } = await supabase
          .from('ket_qua_thu_hoi_no')
          .update({ ma_ket_qua_hd: id, ...dataToUpdate })
          .eq('ma_ket_qua_hd', id)

        if (error) {
          return NextResponse.json({ body: JSON.stringify(error) }, { status: 500 })
        }

        return NextResponse.json({ body: 'Updated' }, { status: 200 })
      }
    }
  } catch (error) {
    let error_response = {
      body: error.message,
    }
    return NextResponse.json(JSON.stringify(error_response), {
      status: 500,
    })
  }
}
