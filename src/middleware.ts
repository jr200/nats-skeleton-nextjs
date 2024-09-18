import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { CUSTOM_SIGNIN_URL } from './constants'

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|healthz|splash.svg).*)'],
}

export default auth(req => {
  const reqUrl = new URL(req.url)
  if (!req.auth && reqUrl?.pathname !== CUSTOM_SIGNIN_URL) {
    return NextResponse.redirect(
      new URL(`${CUSTOM_SIGNIN_URL}?callbackUrl=${encodeURIComponent(reqUrl?.pathname)}`, req.url)
    )
  }
})
