'use client'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'

const LawsuitFileAppointment = () => {
  const tempData = [
    {
      TrangThaiHoSo: 'Xét xử sơ thẩm',
      NgayHen: '02/11/2023',
      NoiDungHen: 'Lên tòa nhận bản án',
      NguoiTaoLichHen: 'Lê Văn Bằng',
      ThoiGianCapNhat: '02/11/2023'
    },
    {
      TrangThaiHoSo: 'Xét xử sơ thẩm',
      NgayHen: '02/11/2023',
      NoiDungHen: 'Lên tòa nhận bản án',
      NguoiTaoLichHen: 'Lê Văn Bằng',
      ThoiGianCapNhat: '02/11/2023'
    }
  ]

  const newTempData = tempData.map((item, index) => {
    return {
      STT: index + 1,
      ...item
    }
  })

  return (
    <div className='mt-3'>
      <div className='flex mb-3 justify-content-between align-items-end'>
        <div className='font-bold text-xl '>Lịch hẹn</div>
        <div className='flex'>
          <Button label='Tạo lịch hẹn' />
          <Button label='Xuất Excel' className='ml-4' severity='success' />
        </div>
      </div>
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
          <Column field='TrangThaiHoSo' header='Trạng thái hồ sơ' style={{ minWidth: '12rem' }} />
          <Column field='NgayHen' header='Ngày hẹn' style={{ minWidth: '8rem' }} />
          <Column field='NoiDungHen' header='Nội dung hẹn' style={{ minWidth: '14rem' }} />
          <Column field='NguoiTaoLichHen' header='Người tạo lịch hẹn' style={{ minWidth: '12rem' }} />
          <Column field='ThoiGianCapNhat' header='Thời gian cập nhật' style={{ minWidth: '11rem' }} />
        </DataTable>
      </div>
    </div>
  )
}

export default LawsuitFileAppointment
