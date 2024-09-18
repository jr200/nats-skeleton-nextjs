import React from 'react'
import { auth } from '@/auth'
import WhoAmIServerAction from './WhoAmIServerAction'
import WhoAmIAPI from './WhoAmIAPI'
import WhoAmIRSC from './WhoAmIRSC'

export default async function DashboardPage() {
  const session = await auth()

  async function onGetUserAction() {
    'use server'
    const session = await auth()
    return session?.user?.name ?? null
  }

  return (
    <>
      <div>Server Side Calls</div>
      <p>User: {session?.user?.name}</p>
      <div className='mt-5'>
        <WhoAmIServerAction onGetUserAction={onGetUserAction} />
        <WhoAmIAPI />
        <WhoAmIRSC />
      </div>
    </>
  )
}
