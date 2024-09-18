import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { CommonProviderOptions } from 'next-auth/providers'

import { signIn } from '@/auth'
import { Button } from '@/components/ui/button'
import { DEFAULT_HOMEPAGE_URL, SIGNIN_ERROR_URL } from '@/constants'

export type ProviderLoginButtonProps = {
  provider: CommonProviderOptions
  callbackUrl?: string
}

export default async function ProviderLoginButton({ provider, callbackUrl }: ProviderLoginButtonProps) {
  const sanitisedCallbackUrl = !callbackUrl || callbackUrl === '/' ? DEFAULT_HOMEPAGE_URL : callbackUrl

  return (
    <form
      action={async () => {
        'use server'
        try {
          await signIn(provider.id, {
            redirectTo: sanitisedCallbackUrl,
          })
        } catch (error) {
          // Signin can fail for a number of reasons, such as the user
          // not existing, or the user not having the correct role.
          // In some cases, you may want to redirect to a custom error
          if (error instanceof AuthError) {
            return redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`)
          }
          console.log('ERROR', error)

          // Otherwise if a redirects happens Next.js can handle it
          // so you can just re-thrown the error and let Next.js handle it.
          // Docs:
          // https://nextjs.org/docs/app/api-reference/functions/redirect#server-component
          throw error
        }
      }}
    >
      <Button type='submit'>
        <span>Sign in with {provider.name}</span>
      </Button>
    </form>
  )
}
