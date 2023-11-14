import { InputText } from 'primereact/inputtext'

import { Button } from 'primereact/button'

import styles from './index.module.scss'

const EditDebtInformation = props => {
  return (
    <div>
      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='khu_vuc'>Khu vực:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='khu_vuc' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='chi_nhanh'>Chi nhánh:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='chi_nhanh' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='dvcn'>Đơn vị chịu nợ:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='dvcn' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='dvqlhs'>Đơn vị quản lý hồ sơ:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='dvqlhs' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='so_the'>Số thẻ:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='so_the' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='stk'>Số tài khoản:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='stk' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='ngay_mo_the'>Ngày mở thẻ:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='ngay_mo_the' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='ncn3'>Ngày chuyển nhóm 3:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='ncn3' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='ngnut'>Nợ gốc nhận ủy thác:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='ngnut' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='nlnut'>Nợ lãi nhận ủy thác:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='nlnut' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='tdnut'>Tổng dư nợ ủy thác:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='tdnut' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='nght'>Nợ gốc hiện tại:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='nght' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='nlht'>Nợ lãi hiện tại:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='nlht' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='tdnht'>Tổng dư nợ hiện tại:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='tdnht' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='stdtt'>Số tiền đã thanh toán:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='stdtt' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='lsthad'>Lãi suất trong hạn áp dụng:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='lsthad' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='lsqhad'>Lãi suất quá hạn áp dụng:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='lsqhad' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='tien_do'>Tiến độ CN/PGD:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='tien_do' type='text' className={styles.inputText} />
        </div>
      </div>

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'>
          <label htmlFor='ghi_chu'>Ghi chú:</label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <InputText id='ghi_chu' type='text' className={styles.inputText} />
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

export default EditDebtInformation
