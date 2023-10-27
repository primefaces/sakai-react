import { InputText } from 'primereact/inputtext'

import { Button } from 'primereact/button'

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import styles from '../index.module.scss'

const EditPersonalInformation = () => {
  return (
    <div>
      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label className=' '>Mã khách hàng:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText type='text' disabled className={styles.inputTextDisable} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='name'>Họ và tên:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='name' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='cccd'>Căn cước công dân:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='cccd' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='birthday'>Ngày sinh:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker className={styles.datePickerStyle} />
          </LocalizationProvider>
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='dc_thuong_tru'>Địa chỉ thường trú:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='dc_thuong_tru' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='dc_tam_tru'>Địa chỉ tạm trú:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='dc_tam_tru' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='sdt'>Số điện thoại:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='sdt' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='email'>Email:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='email' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='company_name'>Tên công ty:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='company_name' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='company_address'>Địa chỉ công ty:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='company_address' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='relative_name'>Tên người thân:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='relative_name' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='relative_phone_number'>Số điện thoại người thân:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='relative_phone_number' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='relationship'>Quan hệ:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='relationship' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='flex justify-content-end'>
        <Button
          label='Hủy'
          outlined
          style={{ width: '90px', marginRight: '16px' }}
          onClick={() => window.history.back()}
        />
        <Button label='Lưu' style={{ width: '90px' }} />
      </div>
    </div>
  )
}

export default EditPersonalInformation
