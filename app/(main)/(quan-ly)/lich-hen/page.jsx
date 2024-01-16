'use client'
import React, { useState, useEffect } from 'react'

import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'

import AppointmentSearch from '@/components/lawsuitAndExecution/search/appointmentSearch'
import ManageAppointmentTable from '@/components/lawsuitAndExecution/manageAppointmentTable/ManageAppointmentTable'

import { getListAppointments } from 'actions/lich-hen/lich-hen'

const ManageAppointment = () => {
  const [checkedList, setCheckedList] = useState([])
  const [data, setData] = useState([])
  const getAppointments = () => {
    getListAppointments('offset=0&limit=10').then((res) => {
      if (res && !res.error) {
        setData(res.results)
      }
    })
  }

  useEffect(() => {
    getAppointments()
  }, [])

  return (
    <div className="card">
      <div>
        <Accordion>
          <AccordionTab header="Tìm kiếm">
            <AppointmentSearch />
          </AccordionTab>
        </Accordion>
      </div>
      <div>
        <div className="flex justify-content-between align-items-center">
          <div className="font-bold text-xl mt-4 mb-2">Danh sách lịch hẹn</div>
          {checkedList.length > 0 && (
            <Button label="Xóa" style={{ height: '37px', width: '74px' }} />
          )}
        </div>

        <ManageAppointmentTable
          checkedList={checkedList}
          setCheckedList={setCheckedList}
          data={data}
        />
      </div>
    </div>
  )
}

export default ManageAppointment
