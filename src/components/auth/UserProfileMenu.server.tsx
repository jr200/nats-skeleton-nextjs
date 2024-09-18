import { auth } from '@/auth'

import { AuthProvider } from '@/providers'
import { UserProfileMenuClient } from './UserProfileMenu.client'

export default async function UserProfileMenu() {
  const sessionKey = new Date().valueOf()
  const session = await auth()

  if (session && session.user) {
    session.user = {
      name: session.user.name,
      email: session.user.email,
    }
  }

  return (
    <AuthProvider session={session} sessionKey={sessionKey}>
      <UserProfileMenuClient />
    </AuthProvider>
  )
}
