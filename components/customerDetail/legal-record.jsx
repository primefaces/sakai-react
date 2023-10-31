const LegalRecord = () => {
  return (
    <div className='card mb-3'>
      <div className='font-bold text-xl mb-4'>Hồ sơ pháp lý</div>
      <div>
        <div className='flex mt-2'>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Hồ sơ:
          </div>
          <div className='line-height-3'>N/A</div>
        </div>

        <div className='flex mt-2 '>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Nhân viên thực hiện:
          </div>
          <div className='line-height-3'>Lê Văn Bằng</div>
        </div>

        <div className='flex mt-2 '>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Ngày thực hiện:
          </div>
          <div className='line-height-3'>25/10/2023</div>
        </div>

        <div className='flex mt-2 '>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Nhân viên xóa:
          </div>
          <div className='line-height-3'>Lê Văn Bằng</div>
        </div>

        <div className='flex mt-2 '>
          <div className='font-medium mr-2 text-right line-height-3' style={{ width: '140px' }}>
            Ngày xóa:
          </div>
          <div className='line-height-3'>25/10/2023</div>
        </div>
      </div>
    </div>
  )
}

export default LegalRecord
