import NextAuth from 'next-auth'
import Zitadel from 'next-auth/providers/zitadel'
import type { Provider } from 'next-auth/providers'
import { CUSTOM_SIGNIN_URL } from '@/constants'

// configure supported auth providers here
const providers: Provider[] = [Zitadel]

export const providerMap = providers
  .map(provider => {
    if (typeof provider === 'function') {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name, type: providerData.type }
    } else {
      return { id: provider.id, name: provider.name, type: provider.type }
    }
  })
  .filter(provider => provider.id !== 'credentials')

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: CUSTOM_SIGNIN_URL,
  },
  debug: true,
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // persist the id_token (needed for authentication with NATS later on)
        token.id_token = account.id_token
      }
      return token
    },
    session({ session, token }) {
      return { ...session, ...token }
    },
  },
})
