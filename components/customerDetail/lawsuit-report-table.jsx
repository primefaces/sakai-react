import React, { useState } from 'react'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const LawsuitReportTable = () => {
  const [data, setData] = useState([
    {
      so_tk: '0004100034721111',
      tt: 'Đang chờ duyệt',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      so_tk: '0004100034721111',
      tt: 'Chưa tạo',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      so_tk: '0004100034721111',
      tt: 'Chưa tạo',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      so_tk: '0004100034721111',
      tt: 'Chưa tạo',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      so_tk: '0004100034721111',
      tt: 'Chưa tạo',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      so_tk: '0004100034721111',
      tt: 'Chưa tạo',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      so_tk: '0004100034721111',
      tt: 'Chưa tạo',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    }
  ])

  const renderDetailText = () => {
    return <div className='cursor-pointer text-primary'>Chi tiết</div>
  }

  return (
    <div className='card'>
      <div className='font-bold text-xl mb-4'>Tờ trình đánh giá khởi kiện</div>
      <div>
        <DataTable
          value={data}
          paginator
          className='p-datatable-gridlines'
          showGridlines
          rows={5}
          dataKey='id'
          emptyMessage='Không tìm thấy tờ trình đánh giá khởi kiện nào'
        >
          <Column field='so_tk' header='Số tài khoản' style={{ minWidth: '9rem' }} sortable />
          <Column field='tt' header='Trạng thái' style={{ minWidth: '5rem' }} />
          <Column field='nv_thuc_hien' header='Nhân viên thực hiện' style={{ minWidth: '9rem' }} />
          <Column field='ngay_thuc_hien' header='Ngày thực hiện' style={{ minWidth: '12rem' }} />
          <Column header='' style={{ minWidth: '5.5rem' }} body={renderDetailText} />
        </DataTable>
      </div>
    </div>
  )
}

export default LawsuitReportTable
