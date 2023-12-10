import { createClient } from 'utils/supabase/client'

import { NextResponse } from 'next/server'

const action = {
  create: async (table, values) => {
    const supabase = createClient()

    const { error } = await supabase.from(table).insert(values)

    if (error) {
      return NextResponse.json(error, { status: 400 })
    }

    return NextResponse.json({ message: 'Tạo thành công' }, { status: 201 })
  },
  read: async (table, column = null, value = null, query = null) => {
    const supabase = createClient()

    if (column && value) {
      const { data, error } = await supabase.from(table).select('*').eq(column, value)

      if (error) {
        return NextResponse.json(error, { status: 400 })
      }

      if (data.length === 0) {
        return NextResponse.json({ message: 'Không tìm thấy' }, { status: 404 })
      }

      return NextResponse.json(data[0])
    }

    const { count, data, error } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .range(query?.offset || 0, query?.offset + query?.limit - 1 || 9)

    if (error) {
      return NextResponse.json(error, { status: 400 })
    }

    return NextResponse.json({ count: count, next: null, previous: null, results: data })
  },
  update: async (table, values, column, value) => {
    const supabase = createClient()

    const { error } = await supabase.from(table).update(values).eq(column, value)

    if (error) {
      return NextResponse.json(error, { status: 400 })
    }

    return NextResponse.json({ message: 'Cập nhật thành công' })
  },
  delete: async (table, column, value) => {
    const supabase = createClient()

    const { error } = await supabase.from(table).delete().eq(column, value)

    if (error) {
      return NextResponse.json(error, { status: 400 })
    }

    return NextResponse.json({ message: 'Xóa thành công' })
  },
}

export default action
