const Caseworker = props => {
  return (
    <div className='card mb-3'>
      <div className='font-bold text-xl mb-4'>Nhân viên phụ trách {props.index}</div>
      <div>
        <div className='flex mt-2'>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Mã nhân viên:
          </div>
          <div className='line-height-3'>NV00001</div>
        </div>

        <div className='flex mt-2 '>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Tên nhân viên:
          </div>
          <div className='line-height-3'>Lê Văn Bằng</div>
        </div>

        <div className='flex mt-2 '>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Đơn vị:
          </div>
          <div className='line-height-3'>Chi nhánh Lý Thường Kiệt, quận 10</div>
        </div>
      </div>
    </div>
  )
}

export default Caseworker
