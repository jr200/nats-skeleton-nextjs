import { credsAuthenticator, type NatsConnection } from '@nats-io/nats-core'
import { Base64Codec, wsconnect } from '@nats-io/transport-node'
import { Session } from 'next-auth'

export interface ExtendedSessionProps extends Session {
  id_token?: string
}

export async function connectToNats(
  endpointUrl: string,
  sentintelCredentialsB64: string,
  session: ExtendedSessionProps | null
): Promise<NatsConnection | null> {
  if (!endpointUrl || !sentintelCredentialsB64 || !session || !session.user || !session.id_token) {
    console.error('connectToNats failed: missing params.')
    return null
  }

  const sentinelCredentials = Base64Codec.decode(sentintelCredentialsB64) as string
  const b64email = session.user.email ? btoa(session.user.email) : ''

  try {
    const nats = await wsconnect({
      servers: [endpointUrl],
      authenticator: credsAuthenticator(new TextEncoder().encode(sentinelCredentials)),
      user: b64email,
      pass: session.id_token,
      debug: true,
      // maxReconnectAttempts: 5,
    })

    return nats
  } catch (error) {
    console.error(error)
  }

  return null
}
