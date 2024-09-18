'use client'

import { useNatsSubject } from '@/providers'
import { useEffect, useState } from 'react'

const MyRequestReplyComponent = () => {
  const { rxnats } = useNatsSubject()
  const [requestData, setRequestData] = useState<string | undefined>(undefined)
  const [responseData, setResponseData] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (!rxnats) {
      return
    }

    // Create a new NATS subject for requests
    const requestSubject$ = rxnats.subject<string, string>({
      name: 'service.request',
    })

    // Subscribe to the subject and handle requests
    const requestSubscription = requestSubject$.cold().subscribe({
      next: msg => {
        console.log('Received request:', msg.data)
        setRequestData(msg.data)
        if (msg.reply) {
          // Respond to the request
          msg.reply.publish('This is the response to your request.')
        }
      },
      error: err => console.error('Error in request subscription:', err),
    })

    // Send a request
    const responseSubject$ = requestSubject$.request('Can I get a response?')
    const responseSubscription = responseSubject$.cold().subscribe({
      next: msg => {
        console.log('Received response:', msg.data)
        setResponseData(msg.data)
      },
    })

    // Clean up the subscription
    return () => {
      requestSubscription.unsubscribe()
      responseSubscription.unsubscribe()
    }
  }, [rxnats])

  return (
    <>
      <div>Request-Reply Example</div>
      <div>Request: {requestData}</div>
      <div>Reply: {responseData}</div>
    </>
  )
}

export default MyRequestReplyComponent
