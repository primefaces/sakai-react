import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'

import styles from '../index.module.scss'

const ProfilePersonalInfo = () => {
  return (
    <div>
      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='ma_nv'>Mã nhân viên:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='ma_nv' type='text' className={styles.inputTextDisable} disabled />
        </div>
      </div>

      <div className='field grid'>
        <div
          className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'
          style={{ paddingRight: '1px' }}
        >
          <label htmlFor='name'>
            Họ và tên:<span style={{ color: 'red' }}>*</span>
          </label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='name' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='email'>Email:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='email' type='text' className={styles.inputTextDisable} disabled />
        </div>
      </div>

      <div className='field grid'>
        <div
          className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'
          style={{ paddingRight: '1px' }}
        >
          <label htmlFor='sdt'>
            Số điện thoại:<span style={{ color: 'red' }}>*</span>
          </label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='sdt' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div
          className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'
          style={{ paddingRight: '1px' }}
        >
          <label htmlFor='cccd'>
            Căn cước công dân:<span style={{ color: 'red' }}>*</span>
          </label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='cccd' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='ngay_cap'>Ngày cấp:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='ngay_cap' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='noi_cap'>Nơi cấp:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='noi_cap' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='noi_cap'>Chức danh:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='noi_cap' type='text' className={styles.inputTextDisable} disabled />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='noi_cap'>Phòng ban:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='noi_cap' type='text' className={styles.inputTextDisable} disabled />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'></div>
        <div className='col-12 md:col-9 sm:col-8'>
          <div className={styles.updateBtnContainer}>
            <Button label='Cập nhật' style={{ width: '100px' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePersonalInfo
