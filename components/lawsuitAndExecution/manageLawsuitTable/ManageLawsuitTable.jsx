'use client'
import Link from 'next/link'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Checkbox } from 'primereact/checkbox'

const ManageLawsuitTable = props => {
  const tempData = [
    {
      IDKhachHang: '15423',
      Ho_ten: 'Lê Văn Bằng',
      CCCD: '031565161651',
      phu_trach_2: 'Lê Tiến Bình'
    },
    {
      IDKhachHang: '51153',
      Ho_ten: 'Lê Văn Bằng 2',
      CCCD: '031565161651',
      phu_trach_2: 'Lê Tiến Bình'
    }
  ]

  const renderCustomerId = rowData => {
    return <Link href='/khach-hang/chi-tiet'>{rowData.IDKhachHang}</Link>
  }

  const handleClickCheckbox = id => {
    if (props.checkedList.indexOf(id) >= 0) {
      props.setCheckedList(props.checkedList.filter(item => item !== id))
    } else {
      props.setCheckedList([...props.checkedList, id])
    }
  }

  const renderCheckbox = rowData => {
    return (
      <Checkbox
        inputId='checkOption1'
        name='option'
        value={rowData.IDKhachHang}
        checked={props.checkedList.indexOf(rowData.IDKhachHang) >= 0}
        onChange={e => handleClickCheckbox(e.value)}
      />
    )
  }

  const renderDetailBtn = () => {
    return <Link href='quan-ly-khoi-kien/ho-so'>Chi tiết</Link>
  }

  return (
    <div>
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
        <Column header='' style={{ minWidth: '4px' }} body={renderCheckbox} />
        <Column header='Mã khách hàng' style={{ minWidth: '10rem' }} body={renderCustomerId} />
        <Column field='Ho_ten' header='Họ và tên' style={{ minWidth: '12rem' }} sortable />
        <Column field='CCCD' header='Căn cước công dân' style={{ minWidth: '11rem' }} />
        <Column field='phu_trach_2' header='Người được ủy quyền' style={{ minWidth: '13rem' }} />
        <Column field='phu_trach_2' header='Số tiền khởi kiện' style={{ minWidth: '10rem' }} />
        <Column field='phu_trach_2' header='Trạng thái khởi kiện' style={{ minWidth: '12rem' }} />
        <Column field='phu_trach_2' header='Trạng thái thi hành án' style={{ minWidth: '13rem' }} />
        <Column field='phu_trach_2' header='Trạng thái án phí' style={{ minWidth: '12rem' }} />
        <Column field='phu_trach_2' header='Tỉnh/Thành phố' style={{ minWidth: '10rem' }} />
        <Column field='phu_trach_2' header='Quận/huyện' style={{ minWidth: '9rem' }} />
        <Column field='phu_trach_2' header='Ngày tạo khởi kiện' style={{ minWidth: '12rem' }} />
        <Column header='' style={{ minWidth: '5.5rem' }} body={renderDetailBtn} />
      </DataTable>
    </div>
  )
}

export default ManageLawsuitTable
