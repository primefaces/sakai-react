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
import JudgmentExecutionInfo from '@/components/lawsuitFileDetail/judgmentExecutionInfo/JudgmentExecutionInfo'
import UpdateDecision from '@/components/lawsuitFileDetail/updateDecision/UpdateDecision'

import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'

const JudgmentExecutionFile = () => {
  const [checkedList, setCheckedList] = useState([])
  const [confirm, setConfirm] = useState(false)

  return (
    <div className='card'>
      <div className='flex mb-3 align-items-end justify-content-between' style={{ height: '41px' }}>
        <div className='flex'>
          <div className='font-bold text-xl mr-2'>Trạng thái hồ sơ: </div>
          <div className='font-bold text-xl text-primary'>Nhập mới</div>
        </div>
        <Button label='Lưu thay đổi' onClick={() => setConfirm(true)} />
        <Dialog
          header='Lưu thay đổi'
          visible={confirm}
          onHide={() => setConfirm(false)}
          style={{ width: '350px' }}
          modal
        >
          <div>
            <div className='flex align-items-center justify-content-center'>
              <i className='pi pi-exclamation-triangle mr-3' style={{ fontSize: '2rem' }} />
              <span>Bạn có chắc chắn lưu thay đổi không?</span>
            </div>

            <div className='flex justify-content-center mt-5'>
              <Button
                label='Hủy'
                severity='primary'
                outlined
                style={{ width: '80px', height: '36px' }}
                onClick={() => setConfirm(false)}
              />
              <Button
                label='Lưu'
                style={{ width: '80px', height: '36px', marginLeft: '16px' }}
                onClick={() => setConfirm(false)}
              />
            </div>
          </div>
        </Dialog>
      </div>
      <LawsuitFileCustomerInfo />
      <LawsuitFileCreditInfo />
      <LawsuitFileConsumerCreditInfo />
      <AuthorizedStaffInfo />
      <LawsuitFileActions />
      <LawsuitFileNotification checkedList={checkedList} setCheckedList={setCheckedList} />
      <LogInfo />
      <LawsuitFileAppointment />
      <JudgmentExecutionInfo />
      <UpdateDecision />
    </div>
  )
}

export default JudgmentExecutionFile
