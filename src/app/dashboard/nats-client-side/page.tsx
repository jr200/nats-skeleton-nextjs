'use client'

import { useSession } from 'next-auth/react'
import { useNats } from '@/providers'

export default function NatsClientSidePage() {
  const { data: session } = useSession()
  const { nats, isConnected } = useNats()
  const currentUser = session?.user?.email

  if (!isConnected) {
    return (
      <div className='grid min-h-screen w-full grid-cols-1 overflow-hidden bg-red-300'>
        <div>
          <p>Client Not Connected</p>
          <p>CurrentUser: {currentUser}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='grid min-h-screen w-full grid-cols-1 overflow-hidden bg-red-300'>
      <div>
        {nats ? <h1>Client Connected to {nats?.getServer()}</h1> : <h1>Connecting to NATS...</h1>}
        <p>Client Id: {nats?.info?.client_id}</p>
        <p>CurrentUser: {currentUser}</p>
      </div>
    </div>
  )
}
