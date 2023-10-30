import React, { useState } from 'react'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const LawsuitProgressAndExecute = () => {
  const [data, setData] = useState([
    {
      ma_kh: 'KH00001',
      ten_kh: 'Lê Văn Bằng',
      so_tien_kk: '1.000.000.000',
      tt_kk: 'Đã khởi kiện thành công',
      tt_tha: 'Đang chờ đến ngày thi hành án',
      tt_ap: 'Đã trả',
      tinh_tp: 'Thành phố Hồ Chí Minh',
      quan_huyen: 'Thành phố Thủ Đức'
    },
    {
      ma_kh: 'KH00001',
      ten_kh: 'Lê Văn Bằng',
      so_tien_kk: '1.000.000.000',
      tt_kk: 'Đã khởi kiện thành công',
      tt_tha: 'Đang chờ đến ngày thi hành án',
      tt_ap: 'Đã trả',
      tinh_tp: 'Thành phố Hồ Chí Minh',
      quan_huyen: 'Thành phố Thủ Đức'
    },
    {
      ma_kh: 'KH00001',
      ten_kh: 'Lê Văn Bằng',
      so_tien_kk: '1.000.000.000',
      tt_kk: 'Đã khởi kiện thành công',
      tt_tha: 'Đang chờ đến ngày thi hành án',
      tt_ap: 'Đã trả',
      tinh_tp: 'Thành phố Hồ Chí Minh',
      quan_huyen: 'Thành phố Thủ Đức'
    },
    {
      ma_kh: 'KH00001',
      ten_kh: 'Lê Văn Bằng',
      so_tien_kk: '1.000.000.000',
      tt_kk: 'Đã khởi kiện thành công',
      tt_tha: 'Đang chờ đến ngày thi hành án',
      tt_ap: 'Đã trả',
      tinh_tp: 'Thành phố Hồ Chí Minh',
      quan_huyen: 'Thành phố Thủ Đức'
    },
    {
      ma_kh: 'KH00001',
      ten_kh: 'Lê Văn Bằng',
      so_tien_kk: '1.000.000.000',
      tt_kk: 'Đã khởi kiện thành công',
      tt_tha: 'Đang chờ đến ngày thi hành án',
      tt_ap: 'Đã trả',
      tinh_tp: 'Thành phố Hồ Chí Minh',
      quan_huyen: 'Thành phố Thủ Đức'
    },
    {
      ma_kh: 'KH00001',
      ten_kh: 'Lê Văn Bằng',
      so_tien_kk: '1.000.000.000',
      tt_kk: 'Đã khởi kiện thành công',
      tt_tha: 'Đang chờ đến ngày thi hành án',
      tt_ap: 'Đã trả',
      tinh_tp: 'Thành phố Hồ Chí Minh',
      quan_huyen: 'Thành phố Thủ Đức'
    },
    {
      ma_kh: 'KH00001',
      ten_kh: 'Lê Văn Bằng',
      so_tien_kk: '1.000.000.000',
      tt_kk: 'Đã khởi kiện thành công',
      tt_tha: 'Đang chờ đến ngày thi hành án',
      tt_ap: 'Đã trả',
      tinh_tp: 'Thành phố Hồ Chí Minh',
      quan_huyen: 'Thành phố Thủ Đức'
    }
  ])

  const renderDetailText = () => {
    return <div className='cursor-pointer text-primary'>Chi tiết</div>
  }

  return (
    <div className='card'>
      <div className='font-bold text-xl mb-4'>Tiến độ kiện và thi hành án</div>
      <div>
        <DataTable
          value={data}
          paginator
          className='p-datatable-gridlines'
          showGridlines
          rows={5}
          dataKey='id'
          emptyMessage='Không tìm thấy thông tin'
        >
          <Column field='ma_kh' header='Mã khách hàng' style={{ minWidth: '11rem' }} sortable />
          <Column field='ten_kh' header='Tên khách hàng' style={{ minWidth: '12rem' }} />
          <Column field='so_tien_kk' header='Số tiền khởi kiện' style={{ minWidth: '10rem' }} />
          <Column field='tt_kk' header='Trạng thái khởi kiện' style={{ minWidth: '15rem' }} />
          <Column field='tt_tha' header='Trạng thái thi hành án' style={{ minWidth: '15rem' }} />
          <Column field='tt_ap' header='Trạng thái án phí' style={{ minWidth: '12rem' }} />
          <Column field='tinh_tp' header='Tỉnh/Thành phố' style={{ minWidth: '12rem' }} />
          <Column field='quan_huyen' header='Quận/huyện' style={{ minWidth: '12rem' }} />
          <Column header='' style={{ minWidth: '5.5rem' }} body={renderDetailText} />
        </DataTable>
      </div>
    </div>
  )
}

export default LawsuitProgressAndExecute
