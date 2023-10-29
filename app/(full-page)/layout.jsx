import AppConfig from '@/layout/AppConfig'
import React from 'react'

export const metadata = {
  title: 'PrimeReact Sakai',
  description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.'
}

export default function SimpleLayout({ children }) {
  return (
    <React.Fragment>
      {children}
      <AppConfig simple />
    </React.Fragment>
  )
}
