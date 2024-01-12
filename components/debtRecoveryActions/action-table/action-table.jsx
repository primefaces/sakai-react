'use client'
import Link from 'next/link'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'

const ActionTable = (props) => {
  const renderCustomerId = (rowData) => {
    return <Link href="/khach-hang/chi-tiet">{rowData.IDKhachHang}</Link>
  }

  const renderActionId = (rowData) => {
    return <div>{rowData.ma_ket_qua_hd}</div>
  }

  const renderCustomerName = (rowData) => {
    return <div>{rowData.KhachHang.Ho_ten}</div>
  }

  const renderCCCD = (rowData) => {
    return <div>{rowData.KhachHang.CCCD}</div>
  }

  const handleClickCheckbox = (id) => {
    if (props.checkedList.indexOf(id) >= 0) {
      props.setCheckedList(props.checkedList.filter((item) => item !== id))
    } else {
      props.setCheckedList([...props.checkedList, id])
    }
  }

  const renderBtn = (rowData) => {
    return (
      <div style={{ display: 'flex' }}>
        <Button
          label="Xem thông báo"
          severity="primary"
          style={{ width: '140px', height: '36px' }}
        />
        <Button
          label="Cập nhật"
          severity="primary"
          style={{ width: '96px', height: '36px', marginLeft: '20px' }}
          onClick={() => {
            props.setShowUpdateDialog(true)
            props.setActionData(rowData)
          }}
        />
      </div>
    )
  }

  const renderDate = (rowData) => {
    const date = new Date(rowData.last_edited_at)
    return (
      <div>
        {date.getDate().toString() +
          '/' +
          (date.getMonth() + 1).toString() +
          '/' +
          date.getFullYear().toString()}
      </div>
    )
  }

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
        {/* <Column header="Mã khách hàng" style={{ minWidth: '10rem' }} body={renderCustomerId} /> */}
        <Column header="Mã hành động" style={{ minWidth: '10rem' }} body={renderActionId} />
        <Column field="loai_hanh_dong" header="Loại hành động" style={{ minWidth: '12rem' }} />
        <Column field="ten_hanh_dong" header="Tên hành động" style={{ minWidth: '12rem' }} />
        <Column header="Tên khách hàng" style={{ minWidth: '12rem' }} body={renderCustomerName} />
        <Column header="Căn cước công dân" style={{ minWidth: '11rem' }} body={renderCCCD} />
        <Column field="ket_qua" header="Kết quả" style={{ minWidth: '12rem' }} />
        <Column field="ghi_chu" header="Ghi chú" style={{ minWidth: '12rem' }} />
        <Column
          field="nhan_vien_thuc_hien"
          header="Nhân viên thực hiện"
          style={{ minWidth: '12rem' }}
        />
        <Column header="Ngày thực hiện" style={{ minWidth: '10rem' }} body={renderDate} />
        <Column header="" style={{ minWidth: '14rem' }} body={renderBtn} />
      </DataTable>
    </div>
  )
}

export default ActionTable
