import { NextResponse } from 'next/server'
function checkCCCD(string) {
  // check for only numbers (0-9) and has exactly 12 characters
  const regex = /^\d{12}$/
  return regex.test(string)
}
function checkStringIsCharacters(string) {
  // check for only letters (a-zA-Z) and whitespace
  const regex = /^[\p{L}\s]+$/u
  return regex.test(string)
}

function checkPhoneNumber(x) {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return regex.test(x)
}

function validateEmail(inputText) {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return mailformat.test(inputText) ? true : false
}

const checkLogicParams = obj => {
  const { Ho_ten, SDT, CCCD, Email, TenCongTy } = obj
  // Ho_ten: '',
  // CCCD: '',
  // Email: '',
  // SDT: '',
  // DiaChiThuongTru: '',
  // DiaChiTamTru: '',
  // TenCongTy: '',
  // DiaChiCongTy: ''
  if (Ho_ten) {
    if (!checkStringIsCharacters(Ho_ten)) {
      console.log(Ho_ten)
      throw NextResponse.json(
        {
          body: 'Invalid "Ho_ten" parameter'
        },
        { status: 400 }
      )
    }
  }

  if (SDT && !checkPhoneNumber(SDT)) {
    throw NextResponse.json(
      {
        body: 'Invalid "SDT" parameter'
      },
      { status: 400 }
    )
  }

  if (CCCD && !checkCCCD(CCCD)) {
    throw NextResponse.json(
      {
        body: 'Invalid "CCCD" parameter'
      },
      { status: 400 }
    )
  }

  if (Email && !validateEmail(Email)) {
    throw NextResponse.json(
      {
        body: 'Invalid "Email" parameter'
      },
      { status: 400 }
    )
  }

  if (TenCongTy) {
    if (!checkStringIsCharacters(TenCongTy)) {
      throw NextResponse.json(
        {
          body: 'Invalid "TenCongTy" parameter'
        },
        { status: 400 }
      )
    }
  }
}

export default checkLogicParams
