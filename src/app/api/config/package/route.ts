import { NextResponse } from 'next/server'

export async function GET() {
  const config = {
    packageName: process.env.packageName,
    packageVersion: process.env.packageVersion,
  }
  return NextResponse.json(config)
}
