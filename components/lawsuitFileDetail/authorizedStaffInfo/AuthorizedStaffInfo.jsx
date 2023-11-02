'use client'

import { InputText } from 'primereact/inputtext'

import styles from './index.module.scss'

const AuthorizedStaffInfo = () => {
  return (
    <div>
      <div className='font-bold text-xl mb-3 mt-3'>Thông tin người được ủy quyền</div>
      <div className='grid ml-0'>
        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Người được UQ</label>
          </div>
          <InputText disabled className={styles.disabledInput} />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>CCCD người được UQ</label>
          </div>
          <InputText disabled className={styles.disabledInput} />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Ngày cấp CCCD người được UQ</label>
          </div>
          <InputText disabled className={styles.disabledInput} />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Nơi cấp CCCD người được UQ</label>
          </div>
          <InputText disabled className={styles.disabledInput} />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Chức danh người được UQ</label>
          </div>
          <InputText disabled className={styles.disabledInput} />
        </div>

        <div className='col-12 xl:col-4 lg:col-6'>
          <div className='mb-2'>
            <label>Số điện thoại người được UQ</label>
          </div>
          <InputText disabled className={styles.disabledInput} />
        </div>
      </div>
    </div>
  )
}

export default AuthorizedStaffInfo
