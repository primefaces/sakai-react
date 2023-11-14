'use client'
import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

import { TabView, TabPanel } from 'primereact/tabview'

import EditCaseworker from '@/components/editCustomer/edit-caseworker'
import EditDebtInformation from '@/components/editCustomer/edit-debt-information'
import EditLegalRecord from '@/components/editCustomer/edit-legal-record'
import EditPersonalInformation from '@/components/editCustomer/edit-personal-information'

import { addCustomer } from 'actions/customer/Customer'

const AddNonePerformingLoan = () => {
  const router = useRouter()

  const [customerForm, setCustomerForm] = useState({ IDKhachHang: '65' })

  const handleChange = (field, value) => {
    setCustomerForm({ ...customerForm, [field]: value })
  }

  const handleAddCustomer = () => {
    addCustomer({ body: customerForm }).then(res => {
      if (res && res.body === 'Inserted') {
        localStorage.setItem('addCustomer', 'success')
        router.push('/khach-hang')
      }
    })
  }

  return (
    <div>
      <TabView>
        <TabPanel header='Thông tin cá nhân'>
          <EditPersonalInformation
            isAdding
            customerForm={customerForm}
            handleChange={handleChange}
            handleAddCustomer={handleAddCustomer}
          />
        </TabPanel>
        <TabPanel header='Thông tin dư nợ'>
          <EditDebtInformation isAdding handleAddCustomer={handleAddCustomer} />
        </TabPanel>
        <TabPanel header='Nhân viên phụ trách'>
          <EditCaseworker isAdding handleAddCustomer={handleAddCustomer} />
        </TabPanel>
        <TabPanel header='Hồ sơ pháp lý'>
          <EditLegalRecord isAdding handleAddCustomer={handleAddCustomer} />
        </TabPanel>
      </TabView>
    </div>
  )
}

export default AddNonePerformingLoan
