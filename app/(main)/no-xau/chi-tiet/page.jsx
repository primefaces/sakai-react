'use client'
import PersonalInformation from '@/components/customerDetail/personalInformation/PersonalInformation'
import Caseworker from '@/components/customerDetail/caseworker/Caseworker'
import LegalRecord from '@/components/customerDetail/legalRecord/LegalRecord'
import DepositAccount from '@/components/customerDetail/depositAccount/DepositAccount'
import DebtInformation from '@/components/customerDetail/debtInformation/DebtInformation'
import ProgressTable from '@/components/customerDetail/progressTable/ProgressTable'
import DebtRecoveryProgress from '@/components/customerDetail/debtRecoveryProgress/DebtRecoveryProgress'
import LawsuitReportTable from '@/components/customerDetail/lawsuitReportTable/LawsuitReportTable'
import LawsuitProgressAndExecute from '@/components/customerDetail/lawsuitProgressAndExecute/LawsuitProgressAndExecute'

const NonePerformingLoanDetail = () => {
  return (
    <div>
      <div className='grid'>
        <div className='xl:col-7 lg:col-12 pb-0'>
          <PersonalInformation />
          <DebtInformation />
        </div>
        <div className='xl:col-5 lg:col-12 pb-0'>
          <Caseworker index={1} />
          <Caseworker index={2} />
          <LegalRecord />
          <DepositAccount index={1} />
          <DepositAccount index={2} />
        </div>
      </div>
      <div>
        <ProgressTable />
        <DebtRecoveryProgress />
        <LawsuitReportTable />
        <LawsuitProgressAndExecute />
      </div>
    </div>
  )
}

export default NonePerformingLoanDetail
