'use client'
import Link from 'next/link'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Checkbox } from 'primereact/checkbox'

const ManageLawsuitTable = (props) => {
  const renderCustomerId = (rowData) => {
    return <Link href="/khach-hang/chi-tiet">{rowData.IDKhachHang}</Link>
  }

  const renderCustomerName = (rowData) => {
    return <div>{rowData.KhachHang.Ho_ten}</div>
  }

  const renderCustomerCCCD = (rowData) => {
    return <div>{rowData.KhachHang.CCCD}</div>
  }

  const handleClickCheckbox = (id) => {
    if (props.checkedList.indexOf(id) >= 0) {
      props.setCheckedList(props.checkedList.filter((item) => item !== id))
    } else {
      props.setCheckedList([...props.checkedList, id])
    }
  }

  const renderCheckbox = (rowData) => {
    return (
      <Checkbox
        inputId="checkOption1"
        name="option"
        value={rowData.IDKhachHang}
        checked={props.checkedList.indexOf(rowData.IDKhachHang) >= 0}
        onChange={(e) => handleClickCheckbox(e.value)}
      />
    )
  }

  const renderCreatedAt = (rowData) => {
    const date = new Date(rowData.created_at)
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

  const renderDetailBtn = (rowData) => {
    return <Link href={`khoi-kien/ho-so?id=${rowData.id}`}>Chi tiết</Link>
  }
  console.log(props.lawsuits)

  return (
    <div>
      <DataTable
        value={props.lawsuits}
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
        <Column header="" style={{ minWidth: '4px' }} body={renderCheckbox} />
        <Column header="Mã khách hàng" style={{ minWidth: '10rem' }} body={renderCustomerId} />
        <Column
          header="Họ và tên"
          style={{ minWidth: '12rem' }}
          sortable
          body={renderCustomerName}
        />
        <Column
          header="Căn cước công dân"
          style={{ minWidth: '11rem' }}
          body={renderCustomerCCCD}
        />
        <Column
          field="id_nguoi_duoc_uq"
          header="Người được ủy quyền"
          style={{ minWidth: '13rem' }}
        />
        <Column field="so_tien_kk" header="Số tiền khởi kiện" style={{ minWidth: '10rem' }} />
        <Column field="trang_thai_kk" header="Trạng thái khởi kiện" style={{ minWidth: '12rem' }} />
        {/* <Column field="phu_trach_2" header="Trạng thái án phí" style={{ minWidth: '12rem' }} /> */}
        <Column field="tinh_tp" header="Tỉnh/Thành phố" style={{ minWidth: '10rem' }} />
        <Column field="quan_huyen" header="Quận/huyện" style={{ minWidth: '9rem' }} />
        <Column header="Ngày tạo khởi kiện" style={{ minWidth: '12rem' }} body={renderCreatedAt} />
        <Column header="" style={{ minWidth: '5.5rem' }} body={renderDetailBtn} />
      </DataTable>
    </div>
  )
}

export default ManageLawsuitTable
