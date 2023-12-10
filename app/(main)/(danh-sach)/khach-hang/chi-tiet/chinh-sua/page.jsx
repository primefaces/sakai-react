'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { TabView, TabPanel } from 'primereact/tabview'

import EditCaseworker from '@/components/editCustomer/edit-caseworker'
import EditDebtInformation from '@/components/editCustomer/edit-debt-information'
import EditLegalRecord from '@/components/editCustomer/edit-legal-record'
import EditPersonalInformation from '@/components/editCustomer/edit-personal-information'

import { getDetailCustomer, updateCustomer } from 'actions/customer/Customer'

const EditNonePerformingLoan = () => {
  const router = useRouter()
  const [customerForm, setCustomerForm] = useState({})
  const [editCustomerForm, setEditCustomerForm] = useState({})
  const [customerId, setCustomerId] = useState()
  const getCustomerInfo = () => {
    const url = window.location.href
    const id = url.slice(url.indexOf('id=') + 3)
    setCustomerId(id)
    getDetailCustomer(id).then((res) => {
      setCustomerForm(res.results[0])
    })
  }

  const handleChange = (field, value) => {
    setCustomerForm({ ...customerForm, [field]: value })
    setEditCustomerForm({ ...editCustomerForm, [field]: value })
  }

  const handleEditCustomer = () => {
    updateCustomer(customerId, { body: editCustomerForm }).then((res) => {
      if (res && res.body === 'Updated') {
        localStorage.setItem('editCustomer', 'success')
        router.push(`/khach-hang/chi-tiet?id=${customerId}`)
      }
    })
  }

  useEffect(() => {
    getCustomerInfo()
  }, [])

  return (
    <div>
      <TabView>
        <TabPanel header="Thông tin cá nhân">
          <EditPersonalInformation
            customerForm={customerForm}
            handleChange={handleChange}
            handleEditCustomer={handleEditCustomer}
            setEditCustomerForm={setEditCustomerForm}
          />
        </TabPanel>
        <TabPanel header="Thông tin dư nợ">
          <EditDebtInformation />
        </TabPanel>
        <TabPanel header="Nhân viên phụ trách">
          <EditCaseworker />
        </TabPanel>
        <TabPanel header="Hồ sơ pháp lý">
          <EditLegalRecord />
        </TabPanel>
      </TabView>
    </div>
  )
}

export default EditNonePerformingLoan
