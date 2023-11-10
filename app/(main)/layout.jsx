import Layout from '@/layout/Layout'

import ReduxProvider from 'store/ReduxProvider'

export const metadata = {
  title: 'DebtProcess',
  description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
  robots: { index: false, follow: false },
  viewport: { initialScale: 1, width: 'device-width' },
  openGraph: {
    type: 'website',
    title: 'PrimeReact SAKAI-REACT',
    url: 'https://sakai.primereact.org/',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
    images: ['https://www.primefaces.org/static/social/sakai-react.png'],
    ttl: 604800
  },
  icons: {
    icon: '/favicon.ico'
  }
}

export default function AppLayout({ children }) {
  return (
    <ReduxProvider>
      <Layout>{children}</Layout>
    </ReduxProvider>
  )
}
