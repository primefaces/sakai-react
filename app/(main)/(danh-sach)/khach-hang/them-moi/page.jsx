'use client'
import { TabView, TabPanel } from 'primereact/tabview'

import EditCaseworker from '@/components/editCustomer/edit-caseworker'
import EditDebtInformation from '@/components/editCustomer/edit-debt-information'
import EditLegalRecord from '@/components/editCustomer/edit-legal-record'
import EditPersonalInformation from '@/components/editCustomer/edit-personal-information'

const AddNonePerformingLoan = () => {
  return (
    <div>
      <TabView>
        <TabPanel header='Thông tin cá nhân'>
          <EditPersonalInformation isAdding />
        </TabPanel>
        <TabPanel header='Thông tin dư nợ'>
          <EditDebtInformation isAdding />
        </TabPanel>
        <TabPanel header='Nhân viên phụ trách'>
          <EditCaseworker isAdding />
        </TabPanel>
        <TabPanel header='Hồ sơ pháp lý'>
          <EditLegalRecord isAdding />
        </TabPanel>
      </TabView>
    </div>
  )
}

export default AddNonePerformingLoan
