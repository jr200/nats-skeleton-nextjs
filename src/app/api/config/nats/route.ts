import { NATS_ENDPOINT, NATS_NOBODY_CREDS_B64 } from '@/constants'
import { NextResponse } from 'next/server'

export async function GET() {
  const config = {
    natsEndpoint: NATS_ENDPOINT,
    natsNobodyUserB64: NATS_NOBODY_CREDS_B64,
  }
  return NextResponse.json(config)
}
