import { APP_BASE_URL } from '@/constants'
import { headers } from 'next/headers'

import React from 'react'

// passes headers from the client request to proxy through auth info
async function WhoAmIRSC() {
  const url = `${APP_BASE_URL}/api/whoami`
  console.log('whoamirsc: ', url)
  const response = await fetch(url, {
    method: 'GET',
    headers: headers(),
  })
    .then(res => res.json())
    .catch(e => console.error(e))

  return <p>WhoAmI (RSC): {response?.user ?? 'error'}</p>
}

export default WhoAmIRSC
