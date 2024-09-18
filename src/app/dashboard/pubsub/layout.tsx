import { ReactNode } from 'react'
import { NatsProvider, NatsSubjectProvider, ServerStaticConfigProvider } from '@/providers'

export default async function Dashboard({ children }: { children: ReactNode }) {
  return (
    <ServerStaticConfigProvider apiPaths={['/api/config/nats']}>
      <NatsProvider>
        <NatsSubjectProvider>{children}</NatsSubjectProvider>
      </NatsProvider>
    </ServerStaticConfigProvider>
  )
}
