'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useNats } from './NatsProvider'
import { RxNats } from '@/lib/rxNats'

interface NatsSubjectProviderProps {
  children: ReactNode
}

// NatsProvider component
export function NatsSubjectProvider({ children }: NatsSubjectProviderProps) {
  const { nats: client, isConnected } = useNats()
  const [rxNatsInstance, setRxNatsInstance] = useState<RxNats | null>(null)

  useEffect(() => {
    if (isConnected && client) {
      const rxNats = new RxNats(client)

      setRxNatsInstance(rxNats)
    } else {
      setRxNatsInstance(null)
    }
  }, [isConnected, client])

  return <NatsSubjectContext.Provider value={{ rxnats: rxNatsInstance }}>{children}</NatsSubjectContext.Provider>
}

interface NatsContextProps {
  rxnats: RxNats | null
}

const NatsSubjectContext = createContext<NatsContextProps | undefined>(undefined)

export const useNatsSubject = () => {
  const context = useContext(NatsSubjectContext)
  if (context === undefined) {
    throw new Error('useNatsSubject must be used within a NatsSubjectProvider')
  }
  return context
}
