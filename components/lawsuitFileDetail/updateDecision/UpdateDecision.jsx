import { Button } from 'primereact/button'

import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

import styles from './index.module.scss'

const UpdateDecision = () => {
  const tempData = [
    {
      TenQuyetDinh: 'Quyết định 1',
      NgayThucHien: '25/11/2020',
      NguoiThucHien: 'Lê Văn Bằng'
    },
    {
      TenQuyetDinh: 'Quyết định 2',
      NgayThucHien: '25/11/2020',
      NguoiThucHien: 'Lê Tiến Bình'
    }
  ]

  return (
    <div>
      <div className='flex justify-content-between align-items-end mt-3 mb-3'>
        <div className='font-bold text-xl'>Cập nhật Quyết định</div>
        <Button label='Chọn file' />
      </div>
      <div className='grid ml-0'>
        <div className='col-12 xl:col-4 md:col-6 pl-0'>
          <div className='mb-2'>
            <label>
              Các quyết định <span style={{ color: 'red' }}>*</span>
            </label>
          </div>
          <div className={styles.inputContainer}>
            <InputText />
          </div>
        </div>
      </div>
      <div className='mt-3'>
        <DataTable
          value={tempData}
          paginator
          className='p-datatable-gridlines'
          showGridlines
          rows={10}
          dataKey='id'
          // filters={filters1}
          // filterDisplay='menu'
          responsiveLayout='scroll'
          emptyMessage='Không có dữ liệu'
          // header={header1}
        >
          <Column field='TenQuyetDinh' header='Tên Quyết định' style={{ minWidth: '9rem' }} />
          <Column field='NgayThucHien' header='Ngày thực hiện' style={{ minWidth: '9rem' }} />
          <Column field='NguoiThucHien' header='Người thực hiện' style={{ minWidth: '12rem' }} />
        </DataTable>
      </div>
    </div>
  )
}

export default UpdateDecision
