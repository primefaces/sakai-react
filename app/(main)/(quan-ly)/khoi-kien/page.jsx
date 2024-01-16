'use client'
import Link from 'next/link'
import React, { useState, useEffect, useRef } from 'react'

import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'
import { Toast } from 'primereact/toast'

import LawsuitSearch from '@/components/lawsuitAndExecution/search/lawsuitSearch'
import ManageLawsuitTable from '@/components/lawsuitAndExecution/manageLawsuitTable/ManageLawsuitTable'

import { getListCustomer } from 'actions/customer/Customer'
import { getListLawsuit } from 'actions/tien-do-khoi-kien/tien-do-khoi-kien'

const ManageLawsuit = () => {
  const [checkedList, setCheckedList] = useState([])
  const [customers, setCustomers] = useState([])
  const [lawsuits, setLawsuits] = useState([])
  const toast = useRef(null)

  const getListCustomers = () => {
    getListCustomer('queryAll=true').then((res) => {
      if (res && res.count) {
        setCustomers(res.results)
      }
    })
  }

  const getListLawsuits = () => {
    getListLawsuit().then((res) => {
      if (res && res.count) {
        setLawsuits(res.results)
      }
    })
  }

  const informAddSuccessfully = () => {
    toast.current?.show({
      severity: 'success',
      detail: 'Tạo mới khởi kiện thành công',
      life: 3000,
    })
    localStorage.removeItem('addLawsuit')
  }

  useEffect(() => {
    if (localStorage.getItem('addLawsuit') === 'success') {
      informAddSuccessfully()
    }
    getListCustomers()
    getListLawsuits()
  }, [])

  return (
    <div className="card">
      <Toast ref={toast} />
      <div>
        <Accordion>
          <AccordionTab header="Tìm kiếm">
            <LawsuitSearch customers={customers} />
          </AccordionTab>
        </Accordion>
      </div>
      <div>
        <div className="flex justify-content-between align-items-center mb-3">
          <div className="font-bold text-xl mt-3 mb-2">Danh sách khởi kiện</div>
          <div className="flex" style={{ gap: '16px' }}>
            {checkedList.length > 0 && (
              <Button
                label="Xóa"
                style={{
                  height: '36px',
                  width: '80px',
                  backgroundColor: 'white',
                  color: 'red',
                  border: '1px solid red',
                }}
                className="mt-3"
              />
            )}
            <Link href={{ pathname: 'khoi-kien/ho-so', query: { createNew: true } }}>
              <Button label="Thêm" style={{ height: '36px', width: '100px' }} className="mt-3" />
            </Link>
          </div>
        </div>

        <ManageLawsuitTable
          checkedList={checkedList}
          setCheckedList={setCheckedList}
          lawsuits={lawsuits}
        />
      </div>
    </div>
  )
}

export default ManageLawsuit
