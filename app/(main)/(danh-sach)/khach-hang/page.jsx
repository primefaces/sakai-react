'use client'
import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

import { FilterMatchMode, FilterOperator } from 'primereact/api'

import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Toast } from 'primereact/toast'

import { getListCustomer, deleteCustomer } from 'actions/customer/Customer'

const NonePerformingLoanList = () => {
  const [customers, setCustomers] = useState([])
  const [filters1, setFilters1] = useState({})
  const [loading, setLoading] = useState(true)
  const [globalFilterValue1, setGlobalFilterValue1] = useState('')
  const [onConfirm, setOnConfirm] = useState('')
  const toast = useRef(null)

  const getCustomers = () => {
    getListCustomer('queryAll=true').then(res => {
      setCustomers(res.results)
      setLoading(false)
    })
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

  const informDeleteSuccessfully = () => {
    toast.current?.show({
      severity: 'success',
      detail: 'Xóa khách hàng thành công',
      life: 3000
    })
  }

  const handleDeleteStaff = id => {
    deleteCustomer(id).then(res => {
      if (res.body === 'Record deleted successfully') {
        setCustomers(customers.filter(item => item.IDKhachHang !== id))
        informDeleteSuccessfully()
      }
    })
    setCustomers(customers.filter(item => item.IDKhachHang !== id))
    setOnConfirm('')
  }

  const renderAction = rowData => {
    return (
      <React.Fragment>
        <div className='cursor-pointer' onClick={() => setOnConfirm(rowData.IDKhachHang)} style={{ color: 'red' }}>
          Xóa
        </div>
        <Dialog
          header='Xóa khách hàng nợ xấu'
          visible={rowData.IDKhachHang === onConfirm}
          onHide={() => setOnConfirm('')}
          style={{ width: '350px' }}
          modal
        >
          <div>
            <div className='flex align-items-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>
                Bạn có chắc chắn muốn xóa khách hàng <b>{rowData.Ho_ten}</b> không?
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
                onClick={() => handleDeleteStaff(rowData.IDKhachHang)}
              />
            </div>
          </div>
        </Dialog>
      </React.Fragment>
    )
  }

  const renderCustomerId = rowData => {
    return <Link href={`/khach-hang/chi-tiet?id=${rowData.IDKhachHang}`}>{rowData.IDKhachHang}</Link>
  }

  const informAddSuccessfully = () => {
    toast.current?.show({
      severity: 'success',
      detail: 'Thêm khách hàng thành công',
      life: 3000
    })
    localStorage.removeItem('addCustomer')
  }

  const header1 = renderHeader1()

  useEffect(() => {
    initFilters1()
    if (localStorage.getItem('addCustomer') === 'success') {
      informAddSuccessfully()
    }
    getCustomers()
  }, [])

  return (
    <div className='card'>
      <div className='flex justify-content-between align-items-center mb-3'>
        <div className='font-bold text-xl'>Danh sách khách hàng nợ xấu</div>
        <div className='flex'>
          <div>
            <Link href='/khach-hang/them-moi'>
              <Button label='Thêm khách hàng nợ xấu' outlined />
            </Link>
          </div>
          <div className='ml-3'>
            <Button label='Xuất excel' severity='success' />
          </div>
        </div>
      </div>

      <div>
        <Toast ref={toast} />
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
          emptyMessage='Không tìm thấy khách hàng nợ xấu nào'
          header={header1}
        >
          <Column header='Mã khách hàng' style={{ minWidth: '10rem' }} body={renderCustomerId} />
          <Column field='Ho_ten' header='Họ và tên' style={{ minWidth: '12rem' }} />
          <Column field='CCCD' header='Căn cước công dân' style={{ minWidth: '11rem' }} />
          <Column field='SDT' header='Số điện thoại' style={{ minWidth: '9rem' }} />
          <Column field='nhom_no' header='Nhóm nợ' style={{ minWidth: '7rem' }} />
          <Column field='so_ngay_qua_han' header='Số ngày quá hạn' style={{ minWidth: '10rem' }} />
          <Column field='tong_du_no_hien_tai' header='Tổng dư nợ hiện tại' style={{ minWidth: '12rem' }} />
          <Column field='so_tien_da_thanh_toan' header='Số tiền đã thanh toán' style={{ minWidth: '13rem' }} />
          <Column style={{ minWidth: '1rem' }} body={renderAction} />
        </DataTable>
      </div>
    </div>
  )
}

export default NonePerformingLoanList
