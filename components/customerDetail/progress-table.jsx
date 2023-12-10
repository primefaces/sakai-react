import React, { useState } from 'react'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const ProgressTable = () => {
  const [data, setData] = useState([
    {
      tien_do: 'Chưa khởi kiện',
      ghi_chu: 'Nothing NothingNothingNothingNothingNothingNothingNothingNothingNothing',
      ngay_cap_nhat: '25/10/2023',
      nv_cap_nhat: 'Lê Văn Bằng',
    },
    {
      tien_do: 'Chưa khởi kiện',
      ghi_chu: 'Nothing NothingNothingNothingNothingNothingNothingNothingNothingNothing',
      ngay_cap_nhat: '25/10/2023',
      nv_cap_nhat: 'Lê Văn Bằng',
    },
    {
      tien_do: 'Chưa khởi kiện',
      ghi_chu: 'Nothing NothingNothingNothingNothingNothingNothingNothingNothingNothing',
      ngay_cap_nhat: '25/10/2023',
      nv_cap_nhat: 'Lê Văn Bằng',
    },
    {
      tien_do: 'Chưa khởi kiện',
      ghi_chu: 'Nothing NothingNothingNothingNothingNothingNothingNothingNothingNothing',
      ngay_cap_nhat: '25/10/2023',
      nv_cap_nhat: 'Lê Văn Bằng',
    },
    {
      tien_do: 'Chưa khởi kiện',
      ghi_chu: 'Nothing NothingNothingNothingNothingNothingNothingNothingNothingNothing',
      ngay_cap_nhat: '25/10/2023',
      nv_cap_nhat: 'Lê Văn Bằng',
    },
    {
      tien_do: 'Chưa khởi kiện',
      ghi_chu: 'Nothing NothingNothingNothingNothingNothingNothingNothingNothingNothing',
      ngay_cap_nhat: '25/10/2023',
      nv_cap_nhat: 'Lê Văn Bằng',
    },
    {
      tien_do: 'Chưa khởi kiện',
      ghi_chu: 'Nothing NothingNothingNothingNothingNothingNothingNothingNothingNothing',
      ngay_cap_nhat: '25/10/2023',
      nv_cap_nhat: 'Lê Văn Bằng',
    },
  ])
  return (
    <div className="card">
      <div className="font-bold text-xl mb-4">Tiến độ CN/PGD</div>
      <div>
        <DataTable
          value={data}
          paginator
          className="p-datatable-gridlines"
          showGridlines
          rows={5}
          dataKey="id"
          emptyMessage="Không tìm thấy tiến độ CN/PGD nào"
        >
          <Column field="tien_do" header="Tiến độ CN/PGD" style={{ minWidth: '12rem' }} sortable />
          <Column field="ghi_chu" header="Ghi chú" style={{ minWidth: '20rem' }} />
          <Column field="ngay_cap_nhat" header="Ngày cập nhật" style={{ minWidth: '9rem' }} />
          <Column field="nv_cap_nhat" header="Nhân viên cập nhật" style={{ minWidth: '12rem' }} />
        </DataTable>
      </div>
    </div>
  )
}

export default ProgressTable
