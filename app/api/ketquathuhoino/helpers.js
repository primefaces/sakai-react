import { NextResponse } from 'next/server'
import { supabase } from 'utils/supabaseClient'

function checkStringIsCharacters(string) {
  // check for only letters (a-zA-Z) and whitespace
  const regex = /^[\p{L}\s]+$/u
  return regex.test(string)
}

export const checkLogicParamsKQTHN = (obj) => {
  const { ten_hanh_dong, loai_hanh_dong } = obj

  if (ten_hanh_dong) {
    if (!checkStringIsCharacters(ten_hanh_dong)) {
      throw NextResponse.json(
        {
          body: 'Invalid "ten_hanh_dong" parameter',
        },
        { status: 400 }
      )
    }
  }

  if (loai_hanh_dong) {
    if (!checkStringIsCharacters(loai_hanh_dong)) {
      throw NextResponse.json(
        {
          body: 'Invalid "loai_hanh_dong" parameter',
        },
        { status: 400 }
      )
    }
  }
}

export const getPrecode = (type, name) => {
  if (type === 'Liên hệ khách hàng') {
    if (name === 'Gọi điện') {
      return 'LHKH001'
    } else if (name === 'Gửi SMS') {
      return 'LHKH002'
    } else if (name === 'Gửi Email') {
      return 'LHKH003'
    } else if (name === 'Gọi đến công ty') {
      return 'LHKH004'
    }
  } else if (type === 'Gửi thư khách hàng') {
    if (name === 'Gửi thông báo kiện') {
      return 'GTKH001'
    } else if (name === 'Gửi công văn công ty hỗ trợ') {
      return 'GTKH002'
    } else if (name === 'Gửi công văn tư pháp phường - UBND phường') {
      return 'GTKH003'
    }
  } else if (type === 'Liên hệ người thân khách hàng') {
    if (name === 'Gọi điện') {
      return 'LHNTKH001'
    } else if (name === 'Gửi SMS') {
      return 'LHNTKH002'
    } else if (name === 'Gửi Email') {
      return 'LHNTKH003'
    }
  } else if (type === 'Xác minh khách hàng') {
    if (name === 'Đến địa chỉ thường trú') {
      return 'XMKH001'
    } else if (name === 'Đến địa chỉ tạm trú') {
      return 'XMKH002'
    } else if (name === 'Đến công ty khách hàng') {
      return 'XMKH003'
    } else if (name === 'Đến địa chỉ khác') {
      return 'XMKH004'
    }
  } else if (type === 'Khởi kiện và thi hành án') {
    if (name === 'Đã đánh giá khởi kiện') {
      return 'KKVTHA001'
    }
  } else if (type === 'Thông tin khác') {
    if (name === 'Liên hệ đơn vị chịu nợ') {
      return 'TTK001'
    } else if (name === 'Gửi email đơn vị chịu nợ') {
      return 'TTK002'
    } else if (name === 'Khách hàng chết') {
      return 'TTK003'
    } else if (name === 'Khách hàng đang thi hành án tù') {
      return 'TTK004'
    } else if (name === 'Khách hàng không thừa nhận sử dụng thẻ') {
      return 'TTK005'
    } else if (name === 'Hồ sơ có dấu hiệu giả mạo') {
      return 'TTK006'
    } else if (name === 'Khách hàng đang ở nước ngoài') {
      return 'TTK007'
    } else if (name === 'Khách hàng cơ cấu nợ') {
      return 'TTK008'
    } else if (name === 'Trích tiền do nợ quá hạn') {
      return 'TTK009'
    }
  }
}

export const initiateId = (lastId) => {
  if (lastId.length >= 10) {
    const subStr = lastId.substr(lastId.length - 4, 4)
    const number = Number(subStr) + 1
    if (0 <= number < 10) {
      const newSubStr = `000` + number.toString()
      const preStr = lastId.substr(0, lastId.length - 4)
      return preStr + newSubStr
    } else if (10 <= number < 100) {
      const newSubStr = `00` + number.toString()
      const preStr = lastId.substr(0, lastId.length - 4)
      return preStr + newSubStr
    } else if (100 <= number < 1000) {
      const newSubStr = `0` + number.toString()
      const preStr = lastId.substr(0, lastId.length - 4)
      return preStr + newSubStr
    } else {
      const newSubStr = number.toString()
      const preStr = lastId.substr(0, lastId.length - 4)
      return preStr + newSubStr
    }
  } else {
    return lastId + '0001'
  }
}
