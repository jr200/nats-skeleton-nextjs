import React from 'react'
import { auth } from '@/auth'
import { Session } from 'next-auth'
import { connectToNats } from '@/lib/nats'
import { NATS_ENDPOINT, NATS_NOBODY_CREDS_B64 } from '@/constants'

export interface ExtendedSessionProps extends Session {
  id_token?: string
}

export default async function NatsServerSidePage() {
  const session: ExtendedSessionProps | null = await auth()
  const currentUser = session?.user?.email
  const nats = await connectToNats(NATS_ENDPOINT, NATS_NOBODY_CREDS_B64, session)

  if (!nats) {
    return (
      <div className='grid min-h-screen w-full grid-cols-1 overflow-hidden bg-red-300'>
        <div>
          <p>Server Not Connected</p>
          <p>CurrentUser: {currentUser}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='grid min-h-screen w-full grid-cols-1 overflow-hidden bg-red-300'>
      <div>
        {nats ? <h1>Server Connected to {nats?.getServer()}</h1> : <h1>Connecting to NATS...</h1>}
        <p>Client Id: {nats?.info?.client_id}</p>
        <p>CurrentUser: {currentUser}</p>
      </div>
    </div>
  )
}
