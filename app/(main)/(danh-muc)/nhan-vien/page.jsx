'use client'
import React, { useRef, useEffect, useState } from 'react'

import { FilterMatchMode, FilterOperator } from 'primereact/api'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'

import { getListStaff, deleteStaff, addStaff } from 'actions/staff/Staff'

const StaffList = () => {
  const [customers, setCustomer] = useState([])
  const [filters1, setFilters1] = useState({})
  const [loading, setLoading] = useState(true)
  const [globalFilterValue1, setGlobalFilterValue1] = useState('')
  const [onAddStaff, setOnAddStaff] = useState(false)
  const [onConfirm, setOnConfirm] = useState('')
  const [staffForm, setStaffForm] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)
  const [createdEmail, setCreatedEmail] = useState('')
  const [errorForm, setErrorForm] = useState({})
  const toast = useRef(null)

  const getStaffList = () => {
    getListStaff('queryAll=true').then(res => {
      setCustomer(res.results)
      setLoading(false)
    })
  }

  const handleChange = (field, value) => {
    setStaffForm({ ...staffForm, [field]: value })
    setErrorForm({ ...errorForm, [field + 'Error']: false })
  }

  const onCancel = () => {
    setStaffForm({})
    setErrorForm({})
    setOnAddStaff(false)
  }

  const checkRequired = () => {
    let checkOK = true
    const tempErrorForm = {}
    if (!staffForm.MaNhanVien) {
      checkOK = false
      tempErrorForm.MaNhanVienError = true
    }
    if (!staffForm.HoTen) {
      checkOK = false
      tempErrorForm.HoTenError = true
    }
    if (!staffForm.Email) {
      checkOK = false
      tempErrorForm.EmailError = true
    }
    if (!staffForm.CCCD) {
      checkOK = false
      tempErrorForm.CCCDError = true
    }
    if (!staffForm.SDT) {
      checkOK = false
      tempErrorForm.SDTError = true
    }
    if (!staffForm.ChucDanh) {
      checkOK = false
      tempErrorForm.ChucDanhError = true
    }
    if (!staffForm.PhongBan) {
      checkOK = false
      tempErrorForm.PhongBanError = true
    }
    setErrorForm(tempErrorForm)
    return checkOK
  }

  const handleAddStaff = () => {
    const body = {
      body: staffForm
    }
    if (checkRequired()) {
      addStaff(body).then(res => {
        if (res && res.body === 'Inserted') {
          setCustomer([...customers, staffForm])
          setCreatedEmail(staffForm.Email)
          setShowSuccess(true)
          setErrorForm({})
        }
      })
      onCancel()
    }
  }

  const renderHeader1 = () => {
    return (
      <div className='flex justify-content-between'>
        <Button type='button' icon='pi pi-filter-slash' label='Clear' outlined />
        <span className='p-input-icon-left'>
          <i className='pi pi-search' />
          <InputText value={globalFilterValue1} placeholder='Keyword Search' />
        </span>
      </div>
    )
  }

  const informDeleteSuccessfully = () => {
    toast.current?.show({
      severity: 'success',
      detail: 'Xóa nhân viên thành công',
      life: 3000
    })
  }

  const handleDeleteStaff = id => {
    deleteStaff(id).then(res => {
      if (res.body === 'Record deleted successfully') {
        setCustomer(customers.filter(item => item.MaNhanVien !== id))
        informDeleteSuccessfully()
      }
    })
    setOnConfirm('')
  }

  const renderAction = rowData => {
    return (
      <React.Fragment>
        <div className='cursor-pointer' onClick={() => setOnConfirm(rowData.MaNhanVien)} style={{ color: 'red' }}>
          Xóa
        </div>
        <Dialog
          header='Xóa nhân viên'
          visible={rowData.MaNhanVien !== '' && rowData.MaNhanVien === onConfirm}
          onHide={() => setOnConfirm('')}
          style={{ width: '350px' }}
          modal
        >
          <div>
            <div className='flex align-items-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>
                Bạn có chắc chắn muốn xóa nhân viên <b>{rowData.HoTen}</b> không?
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
                onClick={() => handleDeleteStaff(rowData.MaNhanVien)}
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
          <label htmlFor='ma_nv'>
            Mã nhân viên <span style={{ color: 'red' }}>*</span>
          </label>
          <InputText
            id='ma_nv'
            type='text'
            placeholder='Mã nhân viên'
            value={staffForm.MaNhanVien}
            onChange={e => handleChange('MaNhanVien', e.target.value)}
            className={errorForm.MaNhanVienError ? 'p-invalid' : ''}
          />
        </div>

        <div className='field'>
          <label htmlFor='HoTen'>
            Tên nhân viên <span style={{ color: 'red' }}>*</span>
          </label>
          <InputText
            id='HoTen'
            type='text'
            placeholder='Tên nhân viên'
            value={staffForm.HoTen}
            onChange={e => handleChange('HoTen', e.target.value)}
            className={errorForm.HoTenError ? 'p-invalid' : ''}
          />
        </div>

        <div className='field'>
          <label htmlFor='Email'>
            Email <span style={{ color: 'red' }}>*</span>
          </label>
          <InputText
            id='Email'
            type='text'
            placeholder='Email'
            value={staffForm.Email}
            onChange={e => handleChange('Email', e.target.value)}
            className={errorForm.EmailError ? 'p-invalid' : ''}
          />
        </div>

        <div className='field'>
          <label htmlFor='CCCD'>
            Căn cước công dân <span style={{ color: 'red' }}>*</span>
          </label>
          <InputText
            id='CCCD'
            type='text'
            placeholder='Căn cước công dân'
            value={staffForm.CCCD}
            onChange={e => handleChange('CCCD', e.target.value)}
            className={errorForm.CCCDError ? 'p-invalid' : ''}
          />
        </div>

        <div className='field'>
          <label htmlFor='SDT'>
            Số điện thoại <span style={{ color: 'red' }}>*</span>
          </label>
          <InputText
            id='SDT'
            type='text'
            placeholder='Số điện thoại'
            value={staffForm.SDT}
            onChange={e => handleChange('SDT', e.target.value)}
            className={errorForm.SDTError ? 'p-invalid' : ''}
          />
        </div>

        <div className='field'>
          <label htmlFor='ChucDanh'>
            Chức danh <span style={{ color: 'red' }}>*</span>
          </label>
          <InputText
            id='ChucDanh'
            type='text'
            placeholder='Chức danh'
            value={staffForm.ChucDanh}
            onChange={e => handleChange('ChucDanh', e.target.value)}
            className={errorForm.ChucDanhError ? 'p-invalid' : ''}
          />
        </div>

        <div className='field'>
          <label htmlFor='PhongBan'>
            Phòng ban <span style={{ color: 'red' }}>*</span>
          </label>
          <InputText
            id='PhongBan'
            type='text'
            placeholder='Phòng ban'
            value={staffForm.PhongBan}
            onChange={e => handleChange('PhongBan', e.target.value)}
            className={errorForm.PhongBanError ? 'p-invalid' : ''}
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

  const renderSuccess = () => {
    return (
      <Dialog
        header='Tạo tài khoản thành công'
        visible={showSuccess}
        onHide={() => setShowSuccess(false)}
        style={{ width: '350px' }}
        modal
      >
        <div>
          <div className='flex flex-column align-items-center'>
            <div
              style={{
                width: '100px',
                height: '100px',
                border: '1px solid black',
                borderRadius: '50px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'green',
                backgroundColor: 'rgb(217, 241, 217)'
              }}
            >
              <i className='pi pi-check' style={{ fontSize: '3rem', color: 'green' }} />
            </div>

            <div className='flex mt-3' style={{ width: '100%' }}>
              <div style={{ width: '80px', textAlign: 'right', marginRight: '8px' }}>Email:</div>
              <div>
                <b>{createdEmail}</b>
              </div>
            </div>

            <div className='flex mt-3' style={{ width: '100%' }}>
              <div style={{ width: '80px', textAlign: 'right', marginRight: '8px' }}>Mật khẩu:</div>
              <div>
                <b>123456</b>
              </div>
            </div>
          </div>

          <div className='flex justify-content-center mt-5'>
            <Button
              label='Đóng'
              severity='primary'
              outlined
              style={{ width: '80px', height: '36px' }}
              onClick={() => setShowSuccess(false)}
            />
          </div>
        </div>
      </Dialog>
    )
  }

  useEffect(() => {
    getStaffList()
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
          {renderSuccess()}
        </div>
      </div>
      <Toast ref={toast} />
      <div>
        <DataTable
          value={customers}
          paginator
          className='p-datatable-gridlines'
          showGridlines
          rows={10}
          dataKey='id'
          filters={filters1}
          filterDisplay='menu'
          loading={loading}
          responsiveLayout='scroll'
          emptyMessage='Không tìm thấy nhân viên nào'
          header={header1}
        >
          <Column field='MaNhanVien' header='Mã nhân viên' style={{ minWidth: '9rem' }} />
          <Column field='HoTen' header='Tên nhân viên' style={{ minWidth: '12rem' }} />
          <Column field='Email' header='Email' style={{ minWidth: '12rem' }} />
          <Column field='SDT' header='Số điện thoại' style={{ minWidth: '9rem' }} />
          <Column field='CCCD' header='Căn cước công dân' style={{ minWidth: '11rem' }} />
          <Column field='ChucDanh' header='Chức danh' style={{ minWidth: '12rem' }} />
          <Column field='PhongBan' header='Phòng ban' style={{ minWidth: '12rem' }} />
          <Column style={{ minWidth: '1rem' }} body={renderAction} />
        </DataTable>
      </div>
    </div>
  )
}

export default StaffList
