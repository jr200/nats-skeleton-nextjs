'use client'

import { useServerStaticConfig } from '@/providers'
import { useMemo } from 'react'

export function Footer() {
  const config = useServerStaticConfig()
  const year = useMemo(() => new Date().getFullYear(), [])
  const cfg = useMemo(() => config, [config])
  return (
    <footer className='fixed bottom-0 flex w-full flex-wrap items-center justify-center gap-6 text-[0.6rem]'>
      {cfg?.packageName} {cfg?.packageVersion} © {year} jr200
    </footer>
  )
}
