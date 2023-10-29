'use client'
import { TabView, TabPanel } from 'primereact/tabview'

import EditPersonalInformation from 'components/editCustomer/editPersonalInformation/EditPersonalInformation'
import EditCaseworker from 'components/editCustomer/editCaseworker/EditCaseworker'
import EditDebtInformation from 'components/editCustomer/editDebtInformation/EditDebtInformation'
import EditLegalRecord from 'components/editCustomer/editLegalRecord/EditLegalRecord'

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
