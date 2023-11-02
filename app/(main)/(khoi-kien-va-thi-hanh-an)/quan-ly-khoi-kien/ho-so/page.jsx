'use client'

import React, { useState } from 'react'

import LawsuitFileCustomerInfo from '@/components/lawsuitFileDetail/lawsuitFileCustomerInfo/LawsuitFileCustomerInfo'
import LawsuitFileCreditInfo from '@/components/lawsuitFileDetail/lawsuitFileCreditInfo/LawsuitFileCreditInfo'
import LawsuitFileConsumerCreditInfo from '@/components/lawsuitFileDetail/lawsuitFileConsumerCreditInfo/LawsuitFileConsumerCreditInfo'
import AuthorizedStaffInfo from '@/components/lawsuitFileDetail/authorizedStaffInfo/AuthorizedStaffInfo'
import LawsuitFileActions from '@/components/lawsuitFileDetail/lawsuitFileActions/LawsuitFileActions'
import LogInfo from '@/components/lawsuitFileDetail/logInfo/LogInfo'
import LawsuitFileAppointment from '@/components/lawsuitFileDetail/lawsuitFileAppointment/LawsuitFileAppointment'
import LawsuitFileNotification from '@/components/lawsuitFileDetail/lawsuitFileNotification/LawsuitFileNotification'

import { Button } from 'primereact/button'

const LawsuitFile = () => {
  const [checkedList, setCheckedList] = useState([])

  return (
    <div className='card'>
      <div className='flex mb-3 align-items-end justify-content-between' style={{ height: '41px' }}>
        <div className='flex'>
          <div className='font-bold text-xl mr-2'>Trạng thái hồ sơ: </div>
          <div className='font-bold text-xl text-primary'>Nhập mới</div>
        </div>
        <Button label='Lưu thay đổi' />
      </div>
      <LawsuitFileCustomerInfo />
      <LawsuitFileCreditInfo />
      <LawsuitFileConsumerCreditInfo />
      <AuthorizedStaffInfo />
      <LawsuitFileActions />
      <LawsuitFileNotification checkedList={checkedList} setCheckedList={setCheckedList} />
      <LogInfo />
      <LawsuitFileAppointment />
    </div>
  )
}

export default LawsuitFile
