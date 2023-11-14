import { InputText } from 'primereact/inputtext'

import { Button } from 'primereact/button'

import styles from './index.module.scss'

const EditCaseworker = props => {
  return (
    <div>
      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='caseworker1'>Nhân viên phụ trách 1:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='caseworker1' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='caseworker2'>Nhân viên phụ trách 2:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='caseworker2' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='flex justify-content-end'>
        <Button
          label='Hủy'
          outlined
          style={{ width: '90px', marginRight: '16px', height: '36px' }}
          onClick={() => window.history.back()}
        />
        {props.isAdding ? (
          <Button label='Thêm' style={{ width: '90px', height: '36px' }} onClick={() => console.log(customerForm)} />
        ) : (
          <Button label='Lưu' style={{ width: '90px', height: '36px' }} />
        )}
      </div>
    </div>
  )
}

export default EditCaseworker
