import { NextResponse } from 'next/server'
function checkStringIsNumber(string) {
  if (typeof string === 'string') {
    return !isNaN(string)
  }
  return false
}
function checkStringIsCharacters(string) {
  if (typeof string === 'string') {
    // Use a regular expression to check for only letters (a-zA-Z) and whitespace
    const regex = /^[\p{L}\s]+$/u
    return regex.test(string)
  }
  return false
}
function validateEmail(inputText) {
  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return mailformat.test(inputText) ? true : false
}
function checkPhoneNumber(x) {
  const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return regex.test(x)
}

const checkLogicParams = obj => {
  const { HoTen, SDT, CCCD, ChucDanh, PhongBan, Email } = obj
  if (HoTen) {
    if (!checkStringIsCharacters(HoTen)) {
      // console.log(HoTen)
      throw NextResponse.json(
        {
          body: 'Invalid "HoTen" parameter'
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
  if (Email && !validateEmail(Email)) {
    throw NextResponse.json(
      {
        body: 'Invalid "Email" parameter'
      },
      { status: 400 }
    )
  }
  if (CCCD && !checkStringIsNumber(CCCD)) {
    throw NextResponse.json(
      {
        body: 'Invalid "CCCD" parameter'
      },
      { status: 400 }
    )
  }

  if (PhongBan && !checkStringIsCharacters(PhongBan)) {
    throw NextResponse.json(
      {
        body: 'Invalid "PhongBan" parameter'
      },
      { status: 400 }
    )
  }

  if (ChucDanh && !checkStringIsCharacters(ChucDanh)) {
    throw NextResponse.json(
      {
        body: 'Invalid "ChucDanh" parameter'
      },
      { status: 400 }
    )
  }
}

export default checkLogicParams
