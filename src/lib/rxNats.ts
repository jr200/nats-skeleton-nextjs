import { attempt, Schema } from 'joi'
import { Msg, Subscription, NatsConnection, PublishOptions } from '@nats-io/nats-core'
import { NextObserver, Observable, Subject } from 'rxjs'
import { Nuid } from 'nuid' // Correct import usage
import { map } from 'rxjs/operators'

// Interface for NATS message with generic types
export interface XMsg<T, R = unknown, P = void> {
  subject: NatsSubject<T, R, P>
  name: string
  data?: T
  reply?: NatsSubject<R, any>
  sid: number
  size: number
}

// Type definitions for NATS options
type RawNatsOptions<P> = Pick<NatsSubjectOptions<P>, 'queue' | 'max' | 'name'>

type NameFunction<P> = (params: P) => string
type NameParam<P> = NameFunction<P> | string

export interface NatsSubjectOptions<P> {
  name: NameParam<P>
  json?: boolean
  schema?: Schema
  queue?: string
  max?: number
  reply?: Omit<NatsSubjectOptions<void>, 'name'>
}

export type NewSubjectOptions<P> = Omit<NatsSubjectOptions<P>, 'queue'> & {
  queue?: true | string
}

// Utility function to get subject name
function getName<P>(name: NameParam<P>, params?: P): string {
  return typeof name === 'function' ? name(params as P) : name
}

// Class for managing hot NATS subjects
class HotNatsSubject<P> implements NextObserver<any> {
  private _subject = new Subject<Msg>()
  private _subscription?: Subscription

  constructor(
    private client: NatsConnection,
    private opts: RawNatsOptions<P>
  ) {}

  async natsSubscribe(props?: P): Promise<void> {
    const { queue, max } = this.opts
    const subjectName = getName(this.opts.name, props)

    // Correct usage of subscribe with SubscriptionOptions
    this._subscription = await this.client.subscribe(subjectName, {
      callback: (err: Error | null, msg: Msg) => (err ? this._subject.error(err) : this._subject.next(msg)),
      queue,
      max,
    })
  }

  natsUnsubscribe(complete: boolean = true) {
    if (this._subscription) this._subscription.unsubscribe()
    if (complete) this._subject.complete()
  }

  observable() {
    return this._subject.asObservable()
  }

  next(data?: any) {
    this.client.publish(getName(this.opts.name), data)
  }
}

// Class for managing cold NATS subjects
class ColdNatsSubject<P> extends Observable<Msg> implements NextObserver<any> {
  private _hot: HotNatsSubject<P>

  constructor(
    private client: NatsConnection,
    private opts: RawNatsOptions<P>,
    private params: P
  ) {
    super(subscriber => {
      const subscription = this._hot.observable().subscribe(subscriber)
      this._hot.natsSubscribe(params).catch(subscriber.error.bind(subscriber))
      return () => {
        subscription.unsubscribe()
        this._hot.natsUnsubscribe()
      }
    })
    this._hot = new HotNatsSubject(client, opts)
  }

  next(data?: any) {
    this.client.publish(getName(this.opts.name, this.params), data)
  }
}

// Custom error classes
export class RxNatsError extends Error {}
export class InvalidJSON extends RxNatsError {
  constructor(
    message: string,
    public data: any
  ) {
    super(message)
  }
}

// Interface for publish options
interface IPublishOptions<P> {
  reply?: string
  params?: P
}

// Class for managing NATS subjects
class NatsSubject<T, R, P = void> implements NextObserver<T> {
  private _hot: HotNatsSubject<P>

  get name() {
    return this.opts.name
  }

  readonly hot: Observable<XMsg<T, R, P>>

  cold(params?: P): Observable<XMsg<T, R, P>> {
    return new ColdNatsSubject(this.client, this.opts, params as P).pipe(this.parseMsg())
  }

  constructor(
    private client: NatsConnection,
    private opts: NatsSubjectOptions<P>
  ) {
    this._hot = new HotNatsSubject<P>(this.client, this.opts)
    this.hot = this._hot.observable().pipe(this.parseMsg())
  }

  natsSubscribe(props?: P) {
    return this._hot.natsSubscribe(props as P)
  }

  natsUnsubscribe() {
    this._hot.natsUnsubscribe()
  }

  request(data: T, params?: P): NatsSubject<R, any> {
    const subjectName = getName(this.opts.name, params)
    const nuid = new Nuid() // Correct usage
    const inboxName = `INBOX_${subjectName}_${nuid.next()}`
    this.publish(data, { reply: inboxName })
    const replyOpts = this.opts.reply || {}
    return new NatsSubject<R, any>(this.client, {
      name: inboxName,
      ...replyOpts,
    })
  }

  publish(data: T, opts?: IPublishOptions<P>): void {
    let toSend: any = data
    if (this.opts.schema) {
      toSend = attempt(data, this.opts.schema)
    }
    if (data && this.opts.json) {
      toSend = JSON.stringify(data)
    }

    const subjectName = getName(this.opts.name, opts?.params)
    //TODO: this.client.publish(subjectName, toSend as string, opts?.reply)
    this.client.publish(subjectName, toSend as string, opts as PublishOptions)
  }

  next(data: T) {
    this.publish(data)
  }

  private parseMsg() {
    return map((msg: Msg): XMsg<T, R, P> => {
      console.log('parseMsg', msg)
      let data: any = msg.data

      // If the data is a Uint8Array, decode it to a string
      if (data instanceof Uint8Array) {
        const decoder = new TextDecoder('utf-8')
        data = decoder.decode(data)
      }

      if (this.opts.json && data !== undefined) {
        try {
          data = JSON.parse(data)
        } catch (e: unknown) {
          if (e instanceof Error) {
            throw new InvalidJSON(e.message, msg.data)
          }
        }
        if (this.opts.schema) {
          data = attempt(data, this.opts.schema)
        }
      }

      const reply = msg.reply
        ? new NatsSubject<R, any>(this.client, {
            ...(this.opts.reply || {}),
            name: msg.reply,
          })
        : undefined

      return {
        subject: this,
        name: msg.subject,
        data,
        reply,
        sid: msg.sid,
        size: msg.data?.length, // Use data length if available
        // size: msg.size,
      }
    })
  }
}

// RxNats implementation and related classes
export class RxNats {
  constructor(
    private client: NatsConnection,
    public queue?: string
  ) {}

  subject<T = unknown, R = unknown, P = void>(opts: NewSubjectOptions<P> | NameParam<P>): NatsSubject<T, R, P> {
    if (!opts) throw new Error('Missing subject options')

    if (typeof opts === 'string' || typeof opts === 'function') {
      opts = { name: opts }
    }
    if (opts.queue === true) {
      if (!this.queue) {
        throw new Error('no default queue available')
      }
      opts.queue = this.queue
    }

    return new NatsSubject<T, R, P>(this.client, opts as NatsSubjectOptions<P>)
  }
}
