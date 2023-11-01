'use client'

import { Accordion, AccordionTab } from 'primereact/accordion'
import Search from '@/components/lawsuitAndExecution/search/Search'
import ManageLawsuitTable from '@/components/lawsuitAndExecution/manageLawsuitTable/ManageLawsuitTable'

const ManageLawsuit = () => {
  return (
    <div className='card'>
      <div>
        <Accordion>
          <AccordionTab header='Tìm kiếm'>
            <Search />
          </AccordionTab>
        </Accordion>
      </div>
      <div>
        <ManageLawsuitTable />
      </div>
    </div>
  )
}

export default ManageLawsuit
