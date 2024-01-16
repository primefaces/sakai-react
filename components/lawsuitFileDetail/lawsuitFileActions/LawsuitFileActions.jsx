'use client'

import { Button } from 'primereact/button'

const LawsuitFileActions = (props) => {
  const handleTransformState = () => {
    if (props.state === 'Nhập mới') {
      props.setState('Nộp hồ sơ')
    } else if (props.state === 'Nộp hồ sơ') {
      props.setState('Nhận thông báo TUAP')
    } else if (props.state === 'Nhận thông báo TUAP') {
      props.setState('Tòa thụ lý hồ sơ')
    } else if (props.state === 'Tòa thụ lý hồ sơ') {
      props.setState('Nộp tự khai')
    } else if (props.state === 'Nộp tự khai') {
      props.setState('Hòa giải')
    } else if (props.state === 'Hòa giải') {
      props.setState('Xét xử')
    } else if (props.state === 'Kháng cáo (NH)') {
      props.setState('Nộp đơn KC')
    } else if (props.state === 'Kháng cáo (KH)') {
      props.setState('Nộp đơn KC')
    } else if (props.state === 'Nộp đơn KC') {
      props.setState('Nhận thông báo TUAP KC')
    } else if (props.state === 'Nhận thông báo TUAP KC') {
      props.setState('Tòa thụ lý hồ sơ KC')
    } else if (props.state === 'Tòa thụ lý hồ sơ KC') {
      props.setState('Phúc thẩm')
    }
    props.setOperation('Chuyển trạng thái')
  }

  const statesHaveTransformState = [
    'Nhập mới',
    'Nộp hồ sơ',
    'Nhận thông báo TUAP',
    'Tòa thụ lý hồ sơ',
    'Nộp tự khai',
    'Hòa giải',
    'Kháng cáo (NH)',
    'Kháng cáo (KH)',
    'Nộp đơn KC',
    'Nhận thông báo TUAP KC',
    'Tòa thụ lý hồ sơ KC',
  ]

  const statesHavePrintLawsuit = ['Nhập mới', 'Nộp hồ sơ', 'Nhận thông báo TUAP']
  const statesHaveNotAuthorzied = [
    'Nhập mới',
    'Nộp hồ sơ',
    'Nhận thông báo TUAP',
    'Xét xử phúc thẩm',
    'Hòa giải thành',
    'Đình chỉ',
    'Rút đơn',
  ]
  const statesHaveReturnLawsuit = ['Nộp hồ sơ', 'Nhận thông báo TUAP']
  const statesHaveTransformTHA = ['Xét xử sơ thẩm', 'Xét xử phúc thẩm', 'Hòa giải thành']
  const statesHaveSuspenduBtn = ['Tòa thụ lý hồ sơ', 'Nộp tự khai', 'Hòa giải', 'Xét xử']
  const statesHaveUpdateBtn = ['Nộp đơn KC', 'Nhận thông báo TUAP KC']

  return (
    <div className="flex mt-3">
      {statesHaveUpdateBtn.includes(props.state) ? (
        <Button label="Cập nhật" className="mr-4" style={{ height: '36px' }} />
      ) : (
        <Button label="Quay lại" className="mr-4" style={{ height: '36px' }} />
      )}

      {statesHaveTransformTHA.includes(props.state) && (
        <Button label="Chuyển THA" className="mr-4" style={{ height: '36px' }} />
      )}
      {statesHaveTransformState.includes(props.state) && (
        <Button
          label="Chuyển trạng thái"
          className="mr-4"
          style={{ height: '36px' }}
          onClick={() => handleTransformState()}
        />
      )}

      {props.state === 'Xét xử' && (
        <Button
          label="Xét xử sơ thẩm"
          className="mr-4"
          style={{ height: '36px' }}
          onClick={() => {
            props.setState('Xét xử sơ thẩm')
            props.setOperation('Chuyển xét xử sơ thẩm')
          }}
        />
      )}

      {props.state === 'Phúc thẩm' && (
        <Button
          label="Xét xử phúc thẩm"
          className="mr-4"
          style={{ height: '36px' }}
          onClick={() => {
            props.setState('Xét xử phúc thẩm')
            props.setOperation('Chuyển xét xử phúc thẩm')
          }}
        />
      )}

      {props.state === 'Xét xử sơ thẩm' && (
        <Button
          label="Ngân hàng KC"
          className="mr-4"
          style={{ height: '36px' }}
          onClick={() => {
            props.setState('Kháng cáo (NH)')
            props.setOperation('Ngân hàng KC')
          }}
        />
      )}
      {props.state === 'Xét xử sơ thẩm' && (
        <Button
          label="Khách hàng KC"
          className="mr-4"
          style={{ height: '36px' }}
          onClick={() => {
            props.setState('Kháng cáo (KH)')
            props.setOperation('Khách hàng KC')
          }}
        />
      )}
      {statesHavePrintLawsuit.includes(props.state) && (
        <Button label="In đơn KK" className="mr-4" style={{ height: '36px' }} />
      )}

      {!['Xét xử phúc thẩm', 'Hòa giải thành', 'Đình chỉ', 'Rút đơn'].includes(props.state) && (
        <Button label="In giấy UQ" className="mr-4" style={{ height: '36px' }} />
      )}

      {!statesHaveNotAuthorzied.includes(props.state) && (
        <Button label="In giấy thôi UQ" className="mr-4" style={{ height: '36px' }} />
      )}
      {statesHaveSuspenduBtn.includes(props.state) && (
        <Button
          label="Đình chỉ"
          className="mr-4"
          style={{ height: '36px' }}
          onClick={() => {
            props.setState('Đình chỉ')
            props.setOperation('Chuyển đình chỉ')
          }}
        />
      )}
      {![
        'Xét xử sơ thẩm',
        'Xét xử phúc thẩm',
        'Hòa giải thành',
        'Đình chỉ',
        'Rút đơn',
        'Kháng cáo (NH)',
      ].includes(props.state) && (
        <Button
          label="Rút đơn"
          className="mr-4"
          style={{ height: '36px' }}
          onClick={() => {
            props.setState('Rút đơn')
            props.setOperation('Rút đơn')
          }}
        />
      )}

      {statesHaveReturnLawsuit.includes(props.state) && (
        <Button label="Trả đơn" className="mr-4" style={{ height: '36px' }} />
      )}

      {props.state === 'Kháng cáo (NH)' && (
        <Button label="In đơn KC" className="mr-4" style={{ height: '36px' }} />
      )}

      {props.state === 'Hòa giải' && (
        <Button
          label="Hòa giải thành"
          className="mr-4"
          style={{ height: '36px' }}
          onClick={() => {
            props.setState('Hòa giải thành')
            props.setOperation('Chuyển hòa giải thành')
          }}
        />
      )}

      {props.state === 'Nộp tự khai' && (
        <Button label="In tự khai" className="mr-4" style={{ height: '36px' }} />
      )}
    </div>
  )
}

export default LawsuitFileActions
