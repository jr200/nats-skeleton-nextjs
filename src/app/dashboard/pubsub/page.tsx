'use client'

import { useEffect, useState } from 'react'
import Joi from 'joi'
import { useNatsSubject } from '@/providers'

type MsgNonce = { message: string; nonce?: number }

const NatsPubSubExample = () => {
  const { rxnats } = useNatsSubject()
  const [msg, setMsg] = useState<MsgNonce>()

  useEffect(() => {
    if (!rxnats) {
      console.warn('NATS instance not available')
      return // Early return if NATS instance is not available
    }

    console.log('NATS instance available, setting up subject...')

    // Create a new NATS subject with JSON schema validation
    const msgNonceSchema = Joi.object({
      message: Joi.string().required(),
      nonce: Joi.number().optional(),
    })

    const validatedSubject$ = rxnats.subject<MsgNonce>({
      name: 'validated.subject',
      json: true,
      schema: msgNonceSchema,
    })

    // Subscribe to the subject
    const subscription = validatedSubject$.cold().subscribe({
      next: msg => {
        console.log('Received validated message:', msg.data)
        setMsg(msg.data)
      },
      error: err => {
        console.error('Validation error or subscription error:', err)
      },
      complete: () => {
        console.log('Subscription completed.')
      },
    })

    // Publish a valid message
    console.log('Publishing messages...')
    validatedSubject$.publish({ message: 'Valid message 1', nonce: 1 })
    validatedSubject$.publish({ message: 'Valid message 2', nonce: 2 })

    // Cleanup: Unsubscribe when component unmounts
    return () => {
      console.log('Unsubscribing from NATS subject')
      subscription.unsubscribe()
    }
  }, [rxnats]) // Dependency array ensures the effect runs when rxnats changes

  if (!rxnats) {
    return <div>Nothing to show...</div>
  }
  return (
    <>
      <div>JSON Schema Validation Example</div>
      <div>Cold Msg: {msg?.message}</div>
      <div>Cold Nonce: {msg?.nonce}</div>
    </>
  )
}

export default NatsPubSubExample
