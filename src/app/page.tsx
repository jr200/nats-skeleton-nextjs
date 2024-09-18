import { CUSTOM_SIGNIN_URL } from '@/constants'
import { redirect } from 'next/navigation'

export default async function Index() {
  redirect(CUSTOM_SIGNIN_URL)
}
