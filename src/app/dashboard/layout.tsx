import { ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { CUSTOM_SIGNIN_URL } from '@/constants'
import { AuthProvider, ServerStaticConfigProvider } from '@/providers'
import { NavBar, Footer } from '@/components/layout'

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    // icon: <Package2 className="h-6 w-6" />,
    srOnly: 'Acme Inc',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    to: '/dashboard/nats-server-side',
    label: 'NatsServerSide',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    to: '/dashboard/nats-client-side',
    label: 'NatsClientSide',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    to: '/dashboard/pubsub',
    label: 'NatsPubSub',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  {
    to: '/dashboard/reqrep',
    label: 'NatsReqRep',
    showOnMobile: true,
    showOnDesktop: true,
    requiresAuth: true,
  },
  // { to: '#', label: 'Orders', showOnMobile: true },
  // { to: '#', label: 'Products', showOnMobile: true },
  // { to: '#', label: 'Customers', showOnMobile: true },
  {
    to: '/dashboard/server-route',
    label: 'ServerRoute',
    showOnDesktop: true,
    showOnMobile: true,
    requiresAuth: true,
  },
  {
    to: '/dashboard/server-side-calls',
    label: 'ServerSideCalls',
    showOnDesktop: true,
    showOnMobile: true,
    requiresAuth: true,
  },
  {
    to: '/dashboard/client-route',
    label: 'ClientRoute',
    showOnDesktop: true,
    showOnMobile: true,
    requiresAuth: true,
  },
]

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect(CUSTOM_SIGNIN_URL)
  }

  return (
    <AuthProvider session={session} sessionKey={new Date().valueOf()}>
      <NavBar navItems={navItems} />
      {children}
      <ServerStaticConfigProvider apiPaths={['/api/config/package']}>
        <Footer />
      </ServerStaticConfigProvider>
    </AuthProvider>
  )
}
