import { auth } from '@/auth'

import { AuthProvider } from '@/providers'
import AuthButtonClient from './AuthButton.client'
import { redirect } from 'next/navigation'
import { DEFAULT_HOMEPAGE_URL } from '@/constants'

export default async function AuthButton({ autoRedirect }: { autoRedirect: boolean }) {
  const sessionKey = new Date().valueOf()
  const session = await auth()

  if (session && session.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
    }
  }

  if (autoRedirect) {
    redirect(DEFAULT_HOMEPAGE_URL)
  }

  return (
    <AuthProvider session={session} sessionKey={sessionKey}>
      <AuthButtonClient />
    </AuthProvider>
  )
}
