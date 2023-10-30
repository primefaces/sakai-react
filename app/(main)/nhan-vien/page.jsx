'use client'
import React, { useEffect, useState } from 'react'

import { FilterMatchMode, FilterOperator } from 'primereact/api'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'

const StaffList = () => {
  const [customers1, setCustomers1] = useState([
    {
      ma_nv: 'NV00001',
      ten_nv: 'Lê Văn Bằng 1',
      sdt: '0123456789',
      cccd: '066202011111',
      date_cccd: '27/09/2020',
      address_cccd: 'Đăk Lăk',
      email: 'levanbang111@gmail.com',
      role: 'Nhân viên',
      department: 'Thu hồi nợ'
    },
    {
      ma_nv: 'NV00002',
      ten_nv: 'Lê Văn Bằng 2',
      sdt: '0123456789',
      cccd: '066202011111',
      date_cccd: '27/09/2020',
      address_cccd: 'Đăk Lăk',
      email: 'levanbang111@gmail.com',
      role: 'Nhân viên',
      department: 'Thu hồi nợ'
    },
    {
      ma_nv: 'NV00003',
      ten_nv: 'Lê Văn Bằng 3',
      sdt: '0123456789',
      cccd: '066202011111',
      date_cccd: '27/09/2020',
      address_cccd: 'Đăk Lăk',
      email: 'levanbang111@gmail.com',
      role: 'Nhân viên',
      department: 'Thu hồi nợ'
    }
  ])
  const [filters1, setFilters1] = useState({})
  const [loading1, setLoading1] = useState(false)
  const [globalFilterValue1, setGlobalFilterValue1] = useState('')
  const [onAddStaff, setOnAddStaff] = useState(false)
  const [onConfirm, setOnConfirm] = useState('')
  const [staffForm, setStaffForm] = useState({
    ten_nv: '',
    sdt: '',
    cccd: '',
    date_cccd: '',
    address_cccd: '',
    email: '',
    role: '',
    department: ''
  })

  const handleChange = (field, value) => {
    setStaffForm({ ...staffForm, [field]: value })
  }

  const onCancel = () => {
    setStaffForm({
      ma_nv: '',
      ten_nv: '',
      sdt: '',
      cccd: '',
      role: '',
      department: ''
    })
    setOnAddStaff(false)
  }

  const handleAddStaff = () => {
    setCustomers1([...customers1, staffForm])
    onCancel()
  }

  const onGlobalFilterChange1 = e => {
    const value = e.target.value
    let _filters1 = { ...filters1 }
    _filters1['global'].value = value

    setFilters1(_filters1)
    setGlobalFilterValue1(value)
  }

  const renderHeader1 = () => {
    return (
      <div className='flex justify-content-between'>
        <Button type='button' icon='pi pi-filter-slash' label='Clear' outlined onClick={clearFilter1} />
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText value={globalFilterValue1} onChange={onGlobalFilterChange1} placeholder='Keyword Search' />
        </span>
      </div>
    )
  }

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      'country.name': {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
      },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      date: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
      },
      balance: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
      },
      status: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
      },
      activity: { value: null, matchMode: FilterMatchMode.BETWEEN },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS }
    })
    setGlobalFilterValue1('')
  }

  const clearFilter1 = () => {
    initFilters1()
  }

  const handleDeleteStaff = id => {
    setCustomers1(customers1.filter(item => item.ma_nv !== id))
    setOnConfirm('')
  }

  const renderAction = rowData => {
    return (
      <React.Fragment>
        <div className='cursor-pointer text-primary' onClick={() => setOnConfirm(rowData.ma_nv)}>
          Xóa
        </div>
        <Dialog
          header='Xóa nhân viên'
          visible={rowData.ma_nv !== '' && rowData.ma_nv === onConfirm}
          onHide={() => setOnConfirm('')}
          style={{ width: '350px' }}
          modal
        >
          <div>
            <div className='flex align-items-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>
                Bạn có chắc chắn muốn xóa nhân viên <b>{rowData.ten_nv}</b> không?
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
              <Button
                label='Xóa'
                style={{ width: '80px', height: '36px', marginLeft: '16px' }}
                onClick={() => handleDeleteStaff(rowData.ma_nv)}
              />
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    )
  }

  const renderAddStaffContent = () => {
    return (
      <div className='p-fluid'>
        <div className='field'>
          <label htmlFor='ten_nv'>Tên nhân viên</label>
          <InputText
            id='ten_nv'
            type='text'
            placeholder='Tên nhân viên'
            value={staffForm.ten_nv}
            onChange={e => handleChange('ten_nv', e.target.value)}
          />
        </div>

        <div className='field'>
          <label htmlFor='email'>Email</label>
          <InputText
            id='email'
            type='text'
            placeholder='Email'
            value={staffForm.email}
            onChange={e => handleChange('email', e.target.value)}
          />
        </div>

        <div className='field'>
          <label htmlFor='sdt'>Số điện thoại</label>
          <InputText
            id='sdt'
            type='text'
            placeholder='Số điện thoại'
            value={staffForm.sdt}
            onChange={e => handleChange('sdt', e.target.value)}
          />
        </div>

        <div className='field'>
          <label htmlFor='role'>Chức danh</label>
          <InputText
            id='role'
            type='text'
            placeholder='Chức danh'
            value={staffForm.role}
            onChange={e => handleChange('role', e.target.value)}
          />
        </div>

        <div className='field'>
          <label htmlFor='department'>Phòng ban</label>
          <InputText
            id='department'
            type='text'
            placeholder='Phòng ban'
            value={staffForm.department}
            onChange={e => handleChange('department', e.target.value)}
          />
        </div>

        <div>
          <div className='flex justify-content-center mt-5'>
            <Button
              label='Hủy'
              severity='primary'
              outlined
              style={{ width: '80px', height: '36px' }}
              onClick={() => onCancel()}
            />
            <Button
              label='Tạo'
              style={{ width: '80px', height: '36px', marginLeft: '16px' }}
              onClick={() => handleAddStaff()}
            />
          </div>
        </div>
      </div>
    )
  }

  const header1 = renderHeader1()

  useEffect(() => {
    initFilters1()
  }, [])

  return (
    <div className='card'>
      <div className='flex justify-content-between align-items-center mb-3'>
        <div className='font-bold text-xl'>Danh sách nhân viên</div>
        <div>
          <Button label='Tạo tài khoản nhân viên' outlined onClick={() => setOnAddStaff(true)} />
          <Dialog
            header='Tạo tài khoản nhân viên'
            visible={onAddStaff}
            style={{ maxWidth: '400px', width: '90%' }}
            modal
            onHide={() => onCancel()}
          >
            {renderAddStaffContent()}
          </Dialog>
        </div>
      </div>

      <div>
        <DataTable
          value={customers1}
          paginator
          className='p-datatable-gridlines'
          showGridlines
          rows={10}
          dataKey='id'
          filters={filters1}
          filterDisplay='menu'
          loading={loading1}
          responsiveLayout='scroll'
          emptyMessage='Không tìm thấy nhân viên nào'
          header={header1}
        >
          <Column field='ma_nv' header='Mã nhân viên' style={{ minWidth: '9rem' }} />
          <Column field='ten_nv' header='Tên nhân viên' style={{ minWidth: '12rem' }} />
          <Column field='email' header='Email' style={{ minWidth: '12rem' }} />
          <Column field='sdt' header='Số điện thoại' style={{ minWidth: '9rem' }} />
          <Column field='cccd' header='Căn cước công dân' style={{ minWidth: '11rem' }} />
          <Column field='date_cccd' header='Ngày cấp' style={{ minWidth: '7rem' }} />
          <Column field='address_cccd' header='Nơi cấp' style={{ minWidth: '10rem' }} />
          <Column field='role' header='Chức danh' style={{ minWidth: '12rem' }} />
          <Column field='department' header='Phòng ban' style={{ minWidth: '12rem' }} />
          <Column style={{ minWidth: '1rem' }} body={renderAction} />
        </DataTable>
      </div>
    </div>
  )
}

export default StaffList
