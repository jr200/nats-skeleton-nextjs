import React from 'react'
import { auth } from '@/auth'

export default async function DashboardPage() {
  const session = await auth()

  return (
    <>
      <div>Dashboard</div>
      <div>User: {session?.user?.name}</div>
    </>
  )
}
