/* eslint-disable @next/next/no-img-element */
'use client'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import { connect } from 'react-redux'
import { Checkbox } from 'primereact/checkbox'
import { Button } from 'primereact/button'
import { Password } from 'primereact/password'
import { LayoutContext } from '@/layout/context/LayoutContext'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'

const LoginPage = props => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errMess, setErrMess] = useState('')
  const [checked, setChecked] = useState(false)
  const { layoutConfig } = useContext(LayoutContext)

  const router = useRouter()
  const containerClassName = classNames(
    'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
    { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
  )

  const handleSignIn = () => {
    if (email === 'quanly@gmail.com' && password === '123456') {
      localStorage.setItem('user', JSON.stringify({ role: 'Manager' }))
      props.setUser({ role: 'Manager' })
      router.push('/nhan-vien')
      return
    }
    if (email === 'nhanvien@gmail.com' && password === '123456') {
      router.push('/')
      return
    }
    setErrMess('Email không tồn tại')
  }
  return (
    <div className={containerClassName}>
      <div className='flex flex-column align-items-center justify-content-center'>
        <img
          src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`}
          alt='Sakai logo'
          className='mb-5 w-6rem flex-shrink-0'
        />
        <div
          style={{
            borderRadius: '56px',
            padding: '0.3rem',
            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
          }}
        >
          <div className='w-full surface-card py-8 px-5 sm:px-8' style={{ borderRadius: '53px' }}>
            <div className='text-center mb-5'>
              <img src='/demo/images/login/avatar.png' alt='Image' height='50' className='mb-3' />
              <div className='text-900 text-3xl font-medium mb-3'>Welcome, Isabel!</div>
              <span className='text-600 font-medium'>Sign in to continue</span>
            </div>

            <div>
              <label htmlFor='email1' className='block text-900 text-xl font-medium mb-2'>
                Email
              </label>
              <InputText
                id='email1'
                type='text'
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setErrMess('')
                }}
                placeholder='Email address'
                className='w-full md:w-30rem mb-5'
                style={{ padding: '1rem' }}
              />

              <label htmlFor='password1' className='block text-900 font-medium text-xl mb-2'>
                Password
              </label>
              <Password
                inputId='password1'
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Password'
                toggleMask
                className={`w-full ${errMess ? 'mb-3' : 'mb-5'}`}
                inputClassName='w-full p-3 md:w-30rem'
              ></Password>

              {errMess && <div style={{ color: 'red', marginBottom: '1rem' }}>{errMess}</div>}

              <div className='flex align-items-center justify-content-between mb-5 gap-5'>
                <div className='flex align-items-center'>
                  <Checkbox
                    inputId='rememberme1'
                    checked={checked}
                    onChange={e => setChecked(e.checked ?? false)}
                    className='mr-2'
                  ></Checkbox>
                  <label htmlFor='rememberme1'>Remember me</label>
                </div>
                <a
                  className='font-medium no-underline ml-2 text-right cursor-pointer'
                  style={{ color: 'var(--primary-color)' }}
                >
                  Forgot password?
                </a>
              </div>
              <Button label='Sign In' className='w-full p-3 text-xl' onClick={() => handleSignIn()}></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    setUser: user => dispatch({ type: 'SET_USER', payload: user })
  }
}

export default connect(null, mapDispatchToProps)(LoginPage)
