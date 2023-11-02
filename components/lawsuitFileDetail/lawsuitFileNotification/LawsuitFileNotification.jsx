'use client'

import React, { useState } from 'react'

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Button } from 'primereact/button'
import { Checkbox } from 'primereact/checkbox'
import { Dialog } from 'primereact/dialog'

const LawsuitFileNotification = props => {
  const tempData = [
    {
      TenFile: 'Bản án L01',
      NguoiTaoFile: 'Lê Văn Bằng',
      NgayTaoFile: '02/11/2023'
    },
    {
      TenFile: 'Bản án L02',
      NguoiTaoFile: 'Lê Văn Bằng',
      NgayTaoFile: '02/11/2023'
    }
  ]
  const [onConfirm, setOnConfirm] = useState('')

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
        value={rowData.TenFile}
        checked={props.checkedList.indexOf(rowData.TenFile) >= 0}
        onChange={e => handleClickCheckbox(e.value)}
      />
    )
  }

  const renderDeleteAction = rowData => {
    return (
      <div>
        <div style={{ color: 'red', cursor: 'pointer' }} onClick={() => setOnConfirm(rowData.TenFile)}>
          Xóa
        </div>
        <Dialog
          header='Xóa quyết định/thông báo'
          visible={rowData.TenFile !== '' && rowData.TenFile === onConfirm}
          onHide={() => setOnConfirm('')}
          style={{ width: '350px' }}
          modal
        >
          <div>
            <div className='flex align-items-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>
                Bạn có chắc chắn muốn xóa thông báo/quyết định <b>{rowData.TenFile}</b> không?
              </span>
            </div>

            <div className='flex justify-content-center mt-5'>
              <Button
                label='Hủy'
                severity='primary'
                outlined
                style={{ width: '80px', height: '36px' }}
                onClick={() => setOnConfirm('')}
              />
              <Button label='Xóa' style={{ width: '80px', height: '36px', marginLeft: '16px' }} />
            </div>
          </div>
        </Dialog>
      </div>
    )
  }

  return (
    <div className='mt-3'>
      <div className='flex justify-content-between mb-3 align-items-end'>
        <div className='font-bold text-xl'>Thông báo/Quyết định</div>
        {props.checkedList.length > 0 && <Button label='Xóa' style={{ width: '80px' }} />}
      </div>
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
          <Column field='TenFile' header='Tên file' style={{ minWidth: '12rem' }} />
          <Column field='NguoiTaoFile' header='Người tạo file' style={{ minWidth: '12rem' }} />
          <Column field='NgayTaoFile' header='Ngày tạo file' style={{ minWidth: '10rem' }} />
          <Column header='' style={{ minWidth: '7px' }} body={renderDeleteAction} />
        </DataTable>
      </div>
    </div>
  )
}

export default LawsuitFileNotification
