'use client'

import { InputText } from 'primereact/inputtext'

const LawsuitFileCustomerInfo = () => {
  return (
    <div>
      <div className='font-bold text-xl mb-3'>Thông tin khách hàng</div>
      <div className='grid ml-0'>
        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Mã khách hàng</label>
          </div>
          <InputText />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Họ và tên</label>
          </div>
          <InputText />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Căn cước công dân</label>
          </div>
          <InputText />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Ngày sinh</label>
          </div>
          <InputText />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Địa chỉ</label>
          </div>
          <InputText />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Tỉnh/Thành phố</label>
          </div>
          <InputText />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Quận/Huyện</label>
          </div>
          <InputText />
        </div>
      </div>
    </div>
  )
}

export default LawsuitFileCustomerInfo
