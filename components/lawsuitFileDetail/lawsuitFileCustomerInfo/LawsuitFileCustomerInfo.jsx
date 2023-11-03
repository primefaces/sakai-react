'use client'

import { InputText } from 'primereact/inputtext'

import styles from './index.module.scss'

const LawsuitFileCustomerInfo = () => {
  return (
    <div>
      <div className='font-bold text-xl mb-3'>Thông tin khách hàng</div>
      <div className='grid ml-0'>
        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>Mã khách hàng</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>Họ và tên</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>Căn cước công dân</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>Ngày sinh</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>Địa chỉ</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>Tỉnh/Thành phố</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>Quận/Huyện</label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LawsuitFileCustomerInfo
