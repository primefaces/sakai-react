'use client'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

import Caseworker from '@/components/customerDetail/caseworker'
import DebtInformation from '@/components/customerDetail/debt-information'
import DebtRecoveryProgress from '@/components/customerDetail/debt-recovery-progress'
import DepositAccount from '@/components/customerDetail/deposit-account'
import LawsuitProgressAndExecute from '@/components/customerDetail/lawsuit-progress-and-execute'
import LawsuitReportTable from '@/components/customerDetail/lawsuit-report-table'
import LegalRecord from '@/components/customerDetail/legal-record'
import PersonalInformation from '@/components/customerDetail/personal-information'
import ProgressTable from '@/components/customerDetail/progress-table'

import { Toast } from 'primereact/toast'

import { getDetailCustomer } from 'actions/customer/Customer'

const NonePerformingLoanDetail = () => {
  const toast = useRef(null)
  const url = window.location.href
  const id = url.slice(url.indexOf('id=') + 3)
  const [customer, setCustomer] = useState({})

  const getCustomerInfo = () => {
    getDetailCustomer(id).then(res => {
      setCustomer(res.results[0])
    })
  }

  const informEditSuccessfully = () => {
    toast.current?.show({
      severity: 'success',
      detail: 'Chỉnh sửa thông tin khách hàng thành công',
      life: 3000
    })
    localStorage.removeItem('editCustomer')
  }

  useEffect(() => {
    getCustomerInfo()
    if (localStorage.getItem('editCustomer') === 'success') {
      informEditSuccessfully()
    }
  }, [])

  return (
    <div>
      <Toast ref={toast} />
      <div className='flex justify-content-end'>
        <Link
          href={`/khach-hang/chi-tiet/chinh-sua?id=${id}`}
          style={{ color: '#ffffff', fontWeight: '600', marginBottom: '1rem' }}
        >
          <div
            className='flex justify-content-center align-items-center border-solid border-1 border-primary border-round-md bg-primary'
            style={{
              width: '86px',
              height: '40px'
            }}
          >
            Chỉnh sửa
          </div>
        </Link>
      </div>
      <div className='grid'>
        <div className='xl:col-7 lg:col-12 pb-0'>
          <PersonalInformation customer={customer} />
          <DebtInformation />
        </div>
        <div className='xl:col-5 lg:col-12 pb-0'>
          <Caseworker index={1} />
          <Caseworker index={2} />
          <LegalRecord />
          <DepositAccount index={1} />
          <DepositAccount index={2} />
        </div>
      </div>
      <div>
        <ProgressTable />
        <DebtRecoveryProgress />
        <LawsuitReportTable />
        <LawsuitProgressAndExecute />
      </div>
    </div>
  )
}

export default NonePerformingLoanDetail
