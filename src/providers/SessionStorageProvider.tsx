'use client'

import { createContext, useContext, ReactNode } from 'react'

// Define types and interfaces
interface SessionStorageContextProps {
  setItemWithPrefix: (prefix: string, key: string, value: any) => void
  getItemWithPrefix: (prefix: string, key: string) => any
  removeItemWithPrefix: (prefix: string, key: string) => void
  clearItemsWithPrefix: (prefix: string) => void
}

interface SessionStorageProviderProps {
  children: ReactNode
}

// Helper functions for base64 encoding and decoding
const encodeBase64 = (value: string): string => btoa(value)
const decodeBase64 = (value: string): string => atob(value)

// Constants for size checks
const MAX_KEY_LENGTH = 100 // Reasonable limit for key length
const MAX_TOTAL_SIZE = 5 * 1024 * 1024 // 5MB in bytes, typical browser limit for session storage

// Create context
const SessionStorageContext = createContext<SessionStorageContextProps | undefined>(undefined)

// SessionStorageProvider component
export function SessionStorageProvider({ children }: SessionStorageProviderProps) {
  const setItemWithPrefix = (prefix: string, key: string, value: any) => {
    const storageKey = `${prefix}${key}`

    if (storageKey.length > MAX_KEY_LENGTH) {
      console.warn(`Key length exceeds ${MAX_KEY_LENGTH} characters and may not be compatible with all browsers.`)
      return
    }

    const encodedValue = encodeBase64(JSON.stringify(value)) // Encode value in base64

    if (encodedValue.length > MAX_TOTAL_SIZE) {
      console.error('Encoded value exceeds the maximum allowable size for session storage.')
      return
    }

    sessionStorage.setItem(storageKey, encodedValue)
  }

  const getItemWithPrefix = (prefix: string, key: string): any => {
    const storageKey = `${prefix}${key}`
    const storedValue = sessionStorage.getItem(storageKey)
    if (!storedValue) return null

    try {
      const decodedValue = decodeBase64(storedValue) // Decode value from base64
      return JSON.parse(decodedValue)
    } catch (error) {
      console.error('Failed to decode or parse stored value:', error)
      return null
    }
  }

  const removeItemWithPrefix = (prefix: string, key: string) => {
    const storageKey = `${prefix}${key}`
    sessionStorage.removeItem(storageKey)
  }

  const clearItemsWithPrefix = (prefix: string) => {
    Object.keys(sessionStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        sessionStorage.removeItem(key)
      }
    })
  }

  return (
    <SessionStorageContext.Provider
      value={{
        setItemWithPrefix,
        getItemWithPrefix,
        removeItemWithPrefix,
        clearItemsWithPrefix,
      }}
    >
      {children}
    </SessionStorageContext.Provider>
  )
}

// Custom hook to use SessionStorage context
export function useSessionStorage() {
  const context = useContext(SessionStorageContext)
  if (context === undefined) {
    throw new Error('useSessionStorage must be used within a SessionStorageProvider')
  }
  return context
}
