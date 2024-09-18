'use client'

import { useSession } from 'next-auth/react'
import { signIn, signOut } from '@/auth/helpers'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AuthButton({ className, ...props }: React.ComponentPropsWithoutRef<'button'>) {
  const { status } = useSession()

  return status === 'authenticated' ? (
    <Button
      className={cn('btn btn-primary', className)}
      onClick={async () => {
        await signOut()
      }}
      {...props}
    >
      Sign Out
    </Button>
  ) : (
    <Button
      className={cn('btn btn-secondary', className)}
      onClick={async () => {
        await signIn()
      }}
      {...props}
    >
      Sign In
    </Button>
  )
}
