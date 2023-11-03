'use client'

import { InputText } from 'primereact/inputtext'

import styles from './index.module.scss'

const JudgmentExecutionInfo = () => {
  return (
    <div>
      <div className='font-bold text-xl mb-3 mt-3'>Thông tin Thi hành án</div>
      <div className='grid ml-0'>
        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>
              Chấp hành viên <span style={{ color: 'red' }}>*</span>
            </label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>
              Số Quyết định <span style={{ color: 'red' }}>*</span>
            </label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>
              Ngày ra Quyết định <span style={{ color: 'red' }}>*</span>
            </label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>

        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>
              Số tiền Quyết định <span style={{ color: 'red' }}>*</span>
            </label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JudgmentExecutionInfo
