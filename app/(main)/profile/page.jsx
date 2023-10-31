'use client'
import { Accordion, AccordionTab } from 'primereact/accordion'

import ProfileChangePassword from '@/components/profile/profile-change-password'
import ProfilePersonalInfo from '@/components/profile/profile-personal-info'

const Profile = () => {
  return (
    <div>
      <Accordion activeIndex={0}>
        <AccordionTab header='Thông tin cá nhân'>
          <ProfilePersonalInfo />
        </AccordionTab>
        <AccordionTab header='Đổi mật khẩu'>
          <ProfileChangePassword />
        </AccordionTab>
      </Accordion>
    </div>
  )
}

export default Profile
