import { Metadata } from 'next'
import Image from 'next/image'

import { providerMap } from '@/auth'
import ProviderLoginButton from '@/components/auth/ProviderLoginButton'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default async function SignInPage(props: { searchParams: { callbackUrl: string | undefined } }) {
  return (
    <>
      <div className='w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]'>
        <div className='flex items-center justify-center py-12'>
          <div className='mx-auto grid w-[350px] gap-6'>
            <div className='grid gap-2 text-center'>
              <h1 className='text-3xl font-bold'>Login</h1>
              <p className='text-balance text-muted-foreground'>You will be redirected to the login provider.</p>
            </div>
            <div className='grid justify-center gap-4'>
              {Object.values(providerMap).map(provider => (
                <ProviderLoginButton
                  key={provider.id}
                  provider={provider}
                  callbackUrl={props.searchParams?.callbackUrl}
                />
              ))}
            </div>
          </div>
        </div>
        <div className='hidden bg-muted lg:block'>
          <Image
            src='/splash.svg'
            alt='Vite Image'
            width='1920'
            height='1080'
            className='h-full w-full object-cover dark:brightness-[0.2] dark:grayscale'
          />
        </div>
      </div>
    </>
  )
}
