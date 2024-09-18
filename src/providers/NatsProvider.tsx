'use client'

import { useSession } from 'next-auth/react'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

import { type NatsConnection } from '@nats-io/nats-core'
import { connectToNats } from '@/lib/nats'
import { useServerStaticConfig } from '.'

// Define the context interface
interface NatsContextProps {
  nats: NatsConnection | null
  isConnected: boolean
}

// Create context
const NatsContext = createContext<NatsContextProps | undefined>(undefined)

// NatsProvider Props
interface NatsProviderProps {
  children: ReactNode
}

// NatsProvider component
export function NatsProvider({ children }: NatsProviderProps) {
  const { data: session, status } = useSession()
  const config = useServerStaticConfig()
  const [nats, setNats] = useState<NatsConnection | null>(null)

  useEffect(() => {
    if (status != 'authenticated' || !config) return

    // Automatically establish a connection to NATS
    connectToNats(config.natsEndpoint, config.natsNobodyUserB64, session)
      .then(c => setNats(c))
      .catch(error => {
        console.log('error connecting to nats: ', error)
        setNats(null)
      })

    return () => {
      if (nats) {
        nats
          .drain()
          .then(() => {
            setNats(null)
            console.log('closed NATS connection')
          })
          .catch(error => {
            console.log('error closing connection: ', error)
          })
      }
    }
  }, [status, session, config])

  return (
    <NatsContext.Provider
      value={{
        nats,
        isConnected: !!nats,
      }}
    >
      {children}
    </NatsContext.Provider>
  )
}

// Custom hook to use NatsContext
export function useNats() {
  const context = useContext(NatsContext)
  if (context === undefined) {
    throw new Error('useNats must be used within a NatsProvider')
  }
  return context
}
