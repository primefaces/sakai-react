'use client'
import { Accordion, AccordionTab } from 'primereact/accordion'

import ProfilePersonalInfo from '@/components/profile/profilePersonalInfo/ProfilePersonalInfo'
import ProfileChangePassword from '@/components/profile/profileChangePassword/ProfileChangePassword'

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
