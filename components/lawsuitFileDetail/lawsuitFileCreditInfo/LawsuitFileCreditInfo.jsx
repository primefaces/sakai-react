'use client'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const LawsuitFileCreditInfo = () => {
  const tempData = [
    {
      SoThe: '12156156165',
      NgayMoThe: '25/11/2020',
      HanMucTinDung: '120.000.000',
      TongThanhToan: '50.000.000',
      NgaySaoKe: '25/11/2021',
      NgayQuaHan: '100'
    },
    {
      SoThe: '156156516',
      NgayMoThe: '25/11/2020',
      HanMucTinDung: '120.000.000',
      TongThanhToan: '50.000.000',
      NgaySaoKe: '25/11/2021',
      NgayQuaHan: '100'
    }
  ]
  const newTempData = tempData.map((item, index) => {
    return {
      STT: index + 1,
      ...item
    }
  })

  return (
    <div>
      <div className='font-bold text-xl mt-3 mb-3'>Thông tin thẻ tín dụng</div>
      <div>
        <DataTable
          value={newTempData}
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
          <Column field='STT' header='STT' style={{ minWidth: '3rem' }} />
          <Column field='SoThe' header='Số thẻ' style={{ minWidth: '10rem' }} sortable />
          <Column field='NgayMoThe' header='Ngày mở thẻ' style={{ minWidth: '9rem' }} />
          <Column field='HanMucTinDung' header='Hạn mức tín dụng' style={{ minWidth: '11rem' }} />
          <Column field='HanMucTinDung' header='Tổng giao dịch' style={{ minWidth: '10rem' }} />
          <Column field='TongThanhToan' header='Tổng thanh toán' style={{ minWidth: '11rem' }} />
          <Column field='HanMucTinDung' header='Nợ gốc' style={{ minWidth: '9rem' }} />
          <Column field='HanMucTinDung' header='Lãi quá hạn' style={{ minWidth: '9rem' }} />
          <Column field='HanMucTinDung' header='Tổng dư nợ' style={{ minWidth: '9rem' }} />
          <Column field='NgaySaoKe' header='Ngày sao kê' style={{ minWidth: '8rem' }} />
          <Column field='NgayQuaHan' header='Ngày quá hạn' style={{ minWidth: '9rem' }} />
        </DataTable>
      </div>
    </div>
  )
}

export default LawsuitFileCreditInfo
