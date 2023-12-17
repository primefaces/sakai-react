'use client'
import React, { useState } from 'react'

import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'

import AppointmentSearch from '@/components/lawsuitAndExecution/search/appointmentSearch'
import ManageAppointmentTable from '@/components/lawsuitAndExecution/manageAppointmentTable/ManageAppointmentTable'

const ManageAppointment = () => {
  const [checkedList, setCheckedList] = useState([])

  return (
    <div className='card'>
      <div>
        <Accordion>
          <AccordionTab header='Tìm kiếm'>
            <AppointmentSearch />
          </AccordionTab>
        </Accordion>
      </div>
      <div>
        <div className='flex justify-content-between align-items-center'>
          <div className='font-bold text-xl mt-4 mb-2'>Danh sách lịch hẹn</div>
          {checkedList.length > 0 && <Button label='Xóa' style={{ height: '37px', width: '74px' }} />}
        </div>

        <ManageAppointmentTable checkedList={checkedList} setCheckedList={setCheckedList} />
      </div>
    </div>
  )
}

export default ManageAppointment
