'use client'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const LogInfo = (props) => {
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

  return (
    <div className="mt-3">
      <div className="font-bold text-xl mb-3">Thông tin log</div>
      <DataTable
        value={props.data.logs ? props.data.logs : []}
        paginator
        className="p-datatable-gridlines"
        showGridlines
        rows={5}
        dataKey="id"
        // filters={filters1}
        // filterDisplay='menu'
        responsiveLayout="scroll"
        emptyMessage="Không có dữ liệu"
        // header={header1}
      >
        <Column header="Thời gian" style={{ minWidth: '9rem' }} body={renderCreatedAt} />
        <Column field="thao_tac" header="Thao tác" style={{ minWidth: '14rem' }} />
        <Column field="trang_thai" header="Trạng thái" style={{ minWidth: '14rem' }} />
        <Column field="nguoi_thuc_hien" header="Người thực hiện" style={{ minWidth: '13rem' }} />
      </DataTable>
    </div>
  )
}

export default LogInfo
