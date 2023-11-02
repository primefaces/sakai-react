'use client'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const LawsuitFileConsumerCreditInfo = () => {
  const tempData = [
    {
      SoLD: '12156156165',
      NgayVay: '25/11/2020',
      SoTienVay: '120.000.000',
      ThoiHanVay: '24',
      NgayDaoHan: '25/11/2021',
      PhuongThucTraNo: 'Trực tiếp',
      NgaySaoKe: '25/11/2021',
      VonGoc: '20.000.000'
    },
    {
      SoLD: '156156516',
      NgayVay: '25/11/2020',
      SoTienVay: '120.000.000',
      ThoiHanVay: '24',
      NgayDaoHan: '25/11/2021',
      PhuongThucTraNo: 'Trực tiếp',
      NgaySaoKe: '25/11/2021',
      VonGoc: '20.000.000'
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
      <div className='font-bold text-xl mt-3 mb-3'>Thông tin tín dụng tiêu dùng</div>
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
          <Column field='SoLD' header='Số LD' style={{ minWidth: '10rem' }} sortable />
          <Column field='NgayVay' header='Ngày vay' style={{ minWidth: '7rem' }} />
          <Column field='SoTienVay' header='Số tiền vay' style={{ minWidth: '9rem' }} />
          <Column field='ThoiHanVay' header='Thời hạn vay (tháng)' style={{ minWidth: '12rem' }} />
          <Column field='NgayDaoHan' header='Ngày đáo hạn' style={{ minWidth: '9rem' }} />
          <Column field='PhuongThucTraNo' header='Phương thức trả nợ' style={{ minWidth: '12rem' }} />
          <Column field='VonGoc' header='Vốn gốc' style={{ minWidth: '9rem' }} />
          <Column field='VonGoc' header='Lãi trong hạn' style={{ minWidth: '9rem' }} />
          <Column field='VonGoc' header='Lãi quá hạn' style={{ minWidth: '9rem' }} />
          <Column field='VonGoc' header='Tổng dư nợ' style={{ minWidth: '9rem' }} />
          <Column field='NgaySaoKe' header='Ngày sao kê' style={{ minWidth: '8rem' }} />
        </DataTable>
      </div>
    </div>
  )
}

export default LawsuitFileConsumerCreditInfo
