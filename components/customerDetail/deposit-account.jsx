const DepositAccount = props => {
  return (
    <div className='card mb-3'>
      <div className='font-bold text-xl mb-4'>Tài khoản tiền gửi {props.index}</div>
      <div>
        <div className='flex mt-2'>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Số tài khoản:
          </div>
          <div className='line-height-3'>0004100034721234</div>
        </div>

        <div className='flex mt-2 '>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Kì hạn:
          </div>
          <div className='line-height-3'>5 năm</div>
        </div>

        <div className='flex mt-2 '>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Số dư:
          </div>
          <div className='line-height-3'>100.000.000</div>
        </div>

        <div className='flex mt-2 '>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Nơi mở tài khoản:
          </div>
          <div className='line-height-3'>Chi nhánh Lý Thường Kiệt, quận 10</div>
        </div>
      </div>
    </div>
  )
}

export default DepositAccount
