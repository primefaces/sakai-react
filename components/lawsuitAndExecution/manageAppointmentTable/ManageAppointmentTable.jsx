'use client'
import Link from 'next/link'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Checkbox } from 'primereact/checkbox'

const ManageAppointmentTable = (props) => {
  const renderName = (rowData) => {
    return <div>{rowData.KhachHang.Ho_ten}</div>
  }

  const renderCCCD = (rowData) => {
    return <div>{rowData.KhachHang.CCCD}</div>
  }

  const renderAuthorized = (rowData) => {
    return <div>{rowData.tien_do_khoi_kien.NhanVien.HoTen}</div>
  }

  const renderProvince = (rowData) => {
    return <div>{rowData.tien_do_khoi_kien.tinh_tp}</div>
  }

  const renderDistrict = (rowData) => {
    return <div>{rowData.tien_do_khoi_kien.quan_huyen}</div>
  }

  const renderAppointmentDate = (rowData) => {
    const date = new Date(rowData.ngay_hen)
    return (
      <div>
        {date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}/
        {date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/
        {date.getFullYear()}
      </div>
    )
  }

  const renderUpdateTime = (rowData) => {
    const data = rowData.thoi_gian_cap_nhat
    const year = data.substr(0, 4)
    const month = data.substr(5, 2)
    const date = data.substr(8, 2)
    return (
      <div>
        {date}/{month}/{year}
      </div>
    )
  }

  // const renderTHA = (rowData) => {
  //   return (<div>
  //     {rowData.trang_thai_}
  //   </div>)
  // }

  return (
    <div>
      <DataTable
        value={props.data}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={10}
        dataKey="id"
        // filters={filters1}
        // filterDisplay='menu'
        responsiveLayout="scroll"
        emptyMessage="Không có dữ liệu"
        // header={header1}
      >
        <Column header="Tên khách hàng" style={{ minWidth: '12rem' }} body={renderName} />
        <Column header="Căn cước công dân" style={{ minWidth: '11rem' }} body={renderCCCD} />
        <Column
          field="trang_thai_ho_so"
          header="Trạng thái khởi kiện"
          style={{ minWidth: '12rem' }}
        />
        {/* <Column field="phu_trach_2" header="Trạng thái thi hành án" style={{ minWidth: '13rem' }} body={renderTHA}/> */}
        <Column
          field="phu_trach_2"
          header="Người được ủy quyền"
          style={{ minWidth: '13rem' }}
          body={renderAuthorized}
        />
        <Column
          field="phu_trach_2"
          header="Tỉnh/Thành phố"
          style={{ minWidth: '10rem' }}
          body={renderProvince}
        />
        <Column
          field="phu_trach_2"
          header="Quận/huyện"
          style={{ minWidth: '9rem' }}
          body={renderDistrict}
        />
        <Column
          field="phu_trach_2"
          header="Ngày hẹn"
          style={{ minWidth: '7rem' }}
          body={renderAppointmentDate}
        />
        <Column field="noi_dung_hen" header="Nội dung" style={{ minWidth: '15rem' }} />
        <Column
          field="nguoi_tao_lich_hen"
          header="Nhân viên thực hiện"
          style={{ minWidth: '12rem' }}
        />
        <Column header="Thời gian cập nhật" style={{ minWidth: '12rem' }} body={renderUpdateTime} />
      </DataTable>
    </div>
  )
}

export default ManageAppointmentTable
