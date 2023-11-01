'use client'
import React, { useState } from 'react'

import { Accordion, AccordionTab } from 'primereact/accordion'
import { Button } from 'primereact/button'

import LawsuitSearch from '@/components/lawsuitAndExecution/search/lawsuitSearch'
import ManageJudgmentExecutionTable from '@/components/lawsuitAndExecution/manageJudgmentExecutionTable/ManageJudgmentExecutionTable'

const ManageJudgmentExecution = () => {
  const [checkedList, setCheckedList] = useState([])

  return (
    <div className='card'>
      <div>
        <Accordion>
          <AccordionTab header='Tìm kiếm'>
            <LawsuitSearch />
          </AccordionTab>
        </Accordion>
      </div>
      <div>
        <div className='flex justify-content-between align-items-center'>
          <div className='font-bold text-xl mt-4 mb-2'>Danh sách thi hành án</div>
          {checkedList.length > 0 && <Button label='Xóa' style={{ height: '37px', width: '74px' }} />}
        </div>

        <ManageJudgmentExecutionTable checkedList={checkedList} setCheckedList={setCheckedList} />
      </div>
    </div>
  )
}

export default ManageJudgmentExecution
