import { ReactNode } from 'react'
import { NatsProvider, ServerStaticConfigProvider } from '@/providers'

export default async function Dashboard({ children }: { children: ReactNode }) {
  return (
    <ServerStaticConfigProvider apiPaths={['/api/config/nats']}>
      <NatsProvider>{children}</NatsProvider>
    </ServerStaticConfigProvider>
  )
}
