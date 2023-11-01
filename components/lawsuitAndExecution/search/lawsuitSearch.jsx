'use client'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

const LawsuitSearch = () => {
  return (
    <div>
      <div className='grid'>
        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='IDKhachHang'>Mã khách hàng</label>
          </div>
          <div>
            <InputText id='IDKhachHang' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Họ và tên</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='IDKhachHang'>Căn cước công dân</label>
          </div>
          <div>
            <InputText id='IDKhachHang' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Tỉnh/Thành phố</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Quận/Huyện</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Người được ủy quyền</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Biên lai</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Số quyết định bản án</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Trạng thái khởi kiện</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Trạng thái thi hành án</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Trạng thái án phí</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Số tiền đóng tạm ứng án phí</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Từ ngày</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6'>
          <div className='mb-2'>
            <label htmlFor='HoTen'>Đến ngày</label>
          </div>
          <div>
            <InputText id='HoTen' type='text' />
          </div>
        </div>
      </div>
      <div className='flex justify-content-center md:justify-content-end '>
        <Button label='Xóa' outlined style={{ width: '93px', marginRight: '16px' }} />
        <Button label='Áp dụng' />
      </div>
    </div>
  )
}

export default LawsuitSearch
