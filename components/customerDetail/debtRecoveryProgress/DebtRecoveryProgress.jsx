import React, { useState } from 'react'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const DebtRecoveryProgress = () => {
  const [data, setData] = useState([
    {
      ma_hanh_dong: 'LHKH001001',
      loai_hanh_dong: 'Gọi điện khách hàng',
      kq_hanh_dong: 'Không bắt máy',
      ghi_chu: 'Lê Văn Bằng',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      ma_hanh_dong: 'LHKH001002',
      loai_hanh_dong: 'Gọi điện khách hàng',
      kq_hanh_dong: 'Không bắt máy',
      ghi_chu: 'Lê Văn Bằng',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      ma_hanh_dong: 'LHKH001003',
      loai_hanh_dong: 'Gọi điện khách hàng',
      kq_hanh_dong: 'Không bắt máy',
      ghi_chu: 'Lê Văn Bằng',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      ma_hanh_dong: 'LHKH001004',
      loai_hanh_dong: 'Gọi điện khách hàng',
      kq_hanh_dong: 'Không bắt máy',
      ghi_chu: 'Lê Văn Bằng',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      ma_hanh_dong: 'LHKH001005',
      loai_hanh_dong: 'Gọi điện khách hàng',
      kq_hanh_dong: 'Không bắt máy',
      ghi_chu: 'Lê Văn Bằng',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      ma_hanh_dong: 'LHKH001006',
      loai_hanh_dong: 'Gọi điện khách hàng',
      kq_hanh_dong: 'Không bắt máy',
      ghi_chu: 'Lê Văn Bằng',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    },
    {
      ma_hanh_dong: 'LHKH001007',
      loai_hanh_dong: 'Gọi điện khách hàng',
      kq_hanh_dong: 'Không bắt máy',
      ghi_chu: 'Lê Văn Bằng',
      nv_thuc_hien: 'Lê Văn Bằng',
      ngay_thuc_hien: '25/10/2023'
    }
  ])

  const renderDetailText = () => {
    return <div className='cursor-pointer text-primary'>Chi tiết</div>
  }

  return (
    <div className='card'>
      <div className='font-bold text-xl mb-4'>Tiến độ thu hồi nợ</div>
      <div>
        <DataTable
          value={data}
          paginator
          className='p-datatable-gridlines'
          showGridlines
          rows={5}
          dataKey='id'
          emptyMessage='Không tìm thấy tiến độ thu hồi nợ nào'
        >
          <Column field='ma_hanh_dong' header='Mã hành động' style={{ minWidth: '12rem' }} sortable />
          <Column field='loai_hanh_dong' header='Loại hành động' style={{ minWidth: '15rem' }} />
          <Column field='kq_hanh_dong' header='Kết quả hành động' style={{ minWidth: '12rem' }} />
          <Column field='ghi_chu' header='Ghi chú' style={{ minWidth: '20rem' }} />
          <Column field='nv_thuc_hien' header='Nhân viên thực hiện' style={{ minWidth: '12rem' }} />
          <Column field='ngay_thuc_hien' header='Ngày thực hiện' style={{ minWidth: '10rem' }} />
          <Column header='' style={{ minWidth: '5.5rem' }} body={renderDetailText} />
        </DataTable>
      </div>
    </div>
  )
}

export default DebtRecoveryProgress
