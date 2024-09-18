// workaround for: https://github.com/nextauthjs/next-auth/issues/9504
'use client'

import { useMemo } from 'react'
import { SessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import { AUTH_BASE_PATH } from '@/constants'

export interface AuthProviderProps {
  session: Session | null
  sessionKey: number
  children: React.ReactNode
}

export function AuthProvider({ session, sessionKey, children }: AuthProviderProps) {
  const memoizedSessionKey = useMemo(() => {
    console.log('session changed >>> ', session)

    return sessionKey
  }, [session])

  return (
    <SessionProvider basePath={AUTH_BASE_PATH} key={memoizedSessionKey} session={session}>
      {children}
    </SessionProvider>
  )
}
