'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Config = Record<string, any>

const ConfigContext = createContext<Config | null>(null)

export const useServerStaticConfig = (): Config | null => {
  return useContext(ConfigContext)
}

interface ServerStaticConfigProviderProps {
  apiPaths: string[]
  children: ReactNode
}

export const ServerStaticConfigProvider: React.FC<ServerStaticConfigProviderProps> = ({ apiPaths, children }) => {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    if (!apiPaths) {
      console.error('Failed to load static configuration: no apiPaths provided')
      setConfig(null)
      return
    }

    const fetchAll = async () => {
      const requests = apiPaths.map(apiPath => fetch(apiPath).then(response => response.json()))
      const results = await Promise.all(requests)
      const mergedResults = results.reduce((acc, curr) => ({ ...acc, ...curr }), {})
      setConfig(mergedResults)
    }
    fetchAll().catch(error => {
      console.error('Failed to load static configuration:', error)
      setConfig(null)
    })
  }, [apiPaths])

  if (!config) return <div>Loading configuration...</div>

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
}
