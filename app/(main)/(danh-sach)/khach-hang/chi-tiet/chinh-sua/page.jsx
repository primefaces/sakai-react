'use client'
import { TabView, TabPanel } from 'primereact/tabview'

import EditCaseworker from '@/components/editCustomer/edit-caseworker'
import EditDebtInformation from '@/components/editCustomer/edit-debt-information'
import EditLegalRecord from '@/components/editCustomer/edit-legal-record'
import EditPersonalInformation from '@/components/editCustomer/edit-personal-information'

const EditNonePerformingLoan = () => {
  return (
    <div>
      <TabView>
        <TabPanel header='Thông tin cá nhân'>
          <EditPersonalInformation />
        </TabPanel>
        <TabPanel header='Thông tin dư nợ'>
          <EditDebtInformation />
        </TabPanel>
        <TabPanel header='Nhân viên phụ trách'>
          <EditCaseworker />
        </TabPanel>
        <TabPanel header='Hồ sơ pháp lý'>
          <EditLegalRecord />
        </TabPanel>
      </TabView>
    </div>
  )
}

export default EditNonePerformingLoan
