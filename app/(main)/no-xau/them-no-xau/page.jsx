'use client'
import { TabView, TabPanel } from 'primereact/tabview'

import EditPersonalInformation from '@/components/editCustomer/editPersonalInformation/EditPersonalInformation'
import EditCaseworker from '@/components/editCustomer/editCaseworker/EditCaseworker'
import EditDebtInformation from '@/components/editCustomer/editDebtInformation/EditDebtInformation'
import EditLegalRecord from '@/components/editCustomer/editLegalRecord/EditLegalRecord'

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
