'use client'

import { Button } from 'primereact/button'

const LawsuitFileActions = () => {
  return (
    <div className='flex mt-3'>
      <Button label='Quay lại' className='mr-4' />
      <Button label='Chuyển thạng thái' className='mr-4' />
      <Button label='In đơn KK' className='mr-4' />
      <Button label='In giấy UQ' className='mr-4' />
      <Button label='Rút đơn' className='mr-4' />
      <Button label='Trả đơn' className='mr-4' />
    </div>
  )
}

export default LawsuitFileActions
