'use client'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const LogInfo = () => {
  const tempData = [
    {
      ThoiGian: '02/11/2023',
      ThaoTac: 'Chuyển trạng thái',
      TrangThai: 'Xét xử sơ thẩm',
      NguoiThucHien: 'Lê Văn Bằng'
    },
    {
      ThoiGian: '02/11/2023',
      ThaoTac: 'Chuyển trạng thái',
      TrangThai: 'Xét xử sơ thẩm',
      NguoiThucHien: 'Lê Văn Bằng'
    }
  ]

  return (
    <div className='mt-3'>
      <div className='font-bold text-xl mb-3'>Thông tin log</div>
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
        <Column field='ThoiGian' header='Thời gian' style={{ minWidth: '9rem' }} />
        <Column field='ThaoTac' header='Thao tác' style={{ minWidth: '14rem' }} />
        <Column field='TrangThai' header='Trạng thái' style={{ minWidth: '14rem' }} />
        <Column field='NguoiThucHien' header='Người thực hiện' style={{ minWidth: '13rem' }} />
      </DataTable>
    </div>
  )
}

export default LogInfo
