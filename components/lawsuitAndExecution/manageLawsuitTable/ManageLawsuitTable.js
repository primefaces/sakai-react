import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const ManageLawsuitTable = () => {
  return (
    <div>
      <DataTable
        value={[]}
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
        <Column header='Mã khách hàng' style={{ minWidth: '10rem' }} body={renderCustomerId} />
        <Column field='ten_kh' header='Họ và tên' style={{ minWidth: '12rem' }} sortable />
        <Column field='cccd' header='Căn cước công dân' style={{ minWidth: '11rem' }} />
        <Column field='sdt' header='Số điện thoại' style={{ minWidth: '9rem' }} />
        <Column field='nhom_no' header='Nhóm nợ' style={{ minWidth: '7rem' }} />
        <Column field='so_ngay_qua_han' header='Số ngày quá hạn' style={{ minWidth: '10rem' }} />
        <Column field='tong_du_no_hien_tai' header='Tổng dư nợ hiện tại' style={{ minWidth: '12rem' }} />
        <Column field='so_tien_da_thanh_toan' header='Số tiền đã thanh toán' style={{ minWidth: '13rem' }} />
        <Column style={{ minWidth: '1rem' }} body={renderAction} />
      </DataTable>
    </div>
  )
}

export default ManageLawsuitTable
