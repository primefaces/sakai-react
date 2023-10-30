import React, { useRef, useState } from 'react'

import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Password } from 'primereact/password'
import { Toast } from 'primereact/toast'

import styles from '../index.module.scss'

const ProfileChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newConfirmPassword, setNewConfirmPassword] = useState('')
  const [passwordNotSame, setPasswordNotSame] = useState(false)
  const toast = useRef(null)

  const informSuccess = () => {
    toast.current.show({ severity: 'success', detail: 'Thay đổi mật khẩu thành công' })
  }

  const changePassword = () => {
    if (newConfirmPassword !== newPassword) {
      setPasswordNotSame(true)
    } else {
      informSuccess()
      setNewPassword('')
      setOldPassword('')
      setNewConfirmPassword('')
    }
  }

  return (
    <div>
      <Toast ref={toast} />
      <div className='field grid'>
        <div
          className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'
          style={{ paddingRight: '1px' }}
        >
          <label htmlFor='oldPassword'>
            Mật khẩu cũ:<span style={{ color: 'red' }}>*</span>
          </label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <Password
            inputId='oldPassword'
            value={oldPassword}
            onChange={e => setOldPassword(e.target.value)}
            placeholder='Mật khẩu cũ'
            toggleMask
            inputClassName='w-full p-3'
            feedback={false}
            style={{ height: '41px', width: '250px' }}
          ></Password>
        </div>
      </div>

      <div className='field grid'>
        <div
          className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'
          style={{ paddingRight: '1px' }}
        >
          <label htmlFor='newPassword'>
            Mật khẩu mới:<span style={{ color: 'red' }}>*</span>
          </label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <Password
            inputId='newPassword'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder='Mật khẩu mới'
            toggleMask
            inputClassName='w-full p-3'
            feedback={false}
            style={{ height: '41px', width: '250px' }}
          ></Password>
        </div>
      </div>

      <div className='field grid mb-0'>
        <div
          className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'
          style={{ paddingRight: '1px' }}
        >
          <label htmlFor='confirmPassword'>
            Xác nhận mật khẩu mới:<span style={{ color: 'red' }}>*</span>
          </label>
        </div>
        <div className='col-12 md:col-9 sm:col-8'>
          <Password
            inputId='confirmPassword'
            value={newConfirmPassword}
            onChange={e => {
              setPasswordNotSame(false)
              setNewConfirmPassword(e.target.value)
            }}
            placeholder='Xác nhận mật khẩu mới'
            toggleMask
            className={passwordNotSame ? 'p-invalid' : ''}
            inputClassName='w-full p-3'
            feedback={false}
            style={{ height: '41px', width: '250px' }}
          ></Password>
        </div>
      </div>

      {passwordNotSame ? (
        <div className='field grid mt-0 sm:mt-1'>
          <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'></div>
          <div className='col-12 md:col-9 sm:col-8'>
            <div style={{ color: 'red' }}>Mật khẩu không khớp</div>
          </div>
        </div>
      ) : (
        <div className='mb-3'></div>
      )}

      <div className='field grid'>
        <div className='col-12 mb-2 md:col-3 sm:col-4 sm:mb-0 sm:flex sm:justify-content-end sm:align-items-center'></div>
        <div className='col-12 md:col-9 sm:col-8'>
          <Button
            label='Cập nhật'
            style={{ width: '100px', marginLeft: '75px' }}
            onClick={changePassword}
            disabled={!oldPassword || !newPassword || !newConfirmPassword}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileChangePassword
