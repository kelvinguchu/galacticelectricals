import { createHash } from 'node:crypto'
import type { Endpoint } from 'payload'

export type EndpointReq = Parameters<Endpoint['handler']>[0]

export type CreateOrderBody = {
  customerEmail: string
  customerPhone: string
  items: Array<{ productId: string; quantity: number }>
  shippingAddress: {
    firstName: string
    lastName: string
    addressLine1: string
    city: string
    county: string
    postalCode?: string
    country?: string
    phone?: string
    email?: string
  }
  notes?: string
  shipping?: number
  tax?: number
  discount?: number
}

export type ReconcileBody = {
  orderNumber?: string
  transactionID?: string
}

export type WebhookChannel =
  | 'stk_callback'
  | 'c2b_validate'
  | 'c2b_confirm'
  | 'transaction_status_result'
  | 'transaction_status_timeout'

export const isAdmin = (roles?: (string | null)[] | null) => roles?.includes('admin') || false

export const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

export const roundMoney = (value: number) => Math.round(value * 100) / 100

export const badRequest = (message: string, status = 400) =>
  Response.json({ error: message }, { status })

export const readJSON = async (req: {
  text?: () => Promise<string>
  json?: () => Promise<unknown>
}) => {
  if (typeof req.text !== 'function' && typeof req.json !== 'function') {
    throw new TypeError('Request body is not available for this endpoint.')
  }

  // Read as text first so we can detect an empty body instead of an opaque JSON parse error
  if (typeof req.text === 'function') {
    const raw = await req.text()
    if (!raw || raw.trim().length === 0) {
      throw new SyntaxError(
        'Request body is empty — the sender may have closed the connection before the body was received.',
      )
    }
    return JSON.parse(raw)
  }

  return req.json!()
}

export const parseCreateOrderBody = (body: unknown): CreateOrderBody | null => {
  if (!body || typeof body !== 'object') return null

  const payload = body as Partial<CreateOrderBody>
  if (!payload.customerEmail || !payload.customerPhone) return null
  if (!Array.isArray(payload.items) || payload.items.length === 0) return null
  if (!payload.shippingAddress || typeof payload.shippingAddress !== 'object') return null
  if (!payload.shippingAddress.firstName || !payload.shippingAddress.lastName) return null
  if (!payload.shippingAddress.addressLine1 || !payload.shippingAddress.city) return null
  if (!payload.shippingAddress.county) return null

  return payload as CreateOrderBody
}

export const parseReconcileBody = (body: unknown): ReconcileBody => {
  if (!body || typeof body !== 'object') return {}
  return body as ReconcileBody
}

export const getBaseURL = () =>
  process.env.MPESA_CALLBACK_BASE_URL || process.env.NEXT_PUBLIC_SERVER_URL

export const buildCallbackURL = (baseURL: string, path: string) => {
  const url = new URL(path, baseURL)
  const callbackToken = process.env.MPESA_CALLBACK_TOKEN
  if (callbackToken) {
    url.searchParams.set('token', callbackToken)
  }
  return url.toString()
}

export const ensureCallbackAuth = (req: EndpointReq) => {
  const callbackToken = process.env.MPESA_CALLBACK_TOKEN
  if (!callbackToken) return true
  if (!req.url) return false

  const url = new URL(req.url)
  return url.searchParams.get('token') === callbackToken
}

const hashWebhookPayload = (channel: string, payload: unknown) =>
  createHash('sha256')
    .update(`${channel}:${JSON.stringify(payload)}`)
    .digest('hex')

export const markWebhookSeen = async (
  req: EndpointReq,
  channel: WebhookChannel,
  payload: unknown,
) => {
  const eventHash = hashWebhookPayload(channel, payload)

  const existing = await req.payload.find({
    collection: 'mpesa-webhook-events',
    req,
    where: { eventHash: { equals: eventHash } },
    depth: 0,
    limit: 1,
  })

  if (existing.docs[0]) {
    return { isDuplicate: true, eventHash }
  }

  await req.payload.create({
    collection: 'mpesa-webhook-events',
    req,
    data: {
      channel,
      eventHash,
      payload: payload as Record<string, unknown>,
      processed: true,
    },
  })

  return { isDuplicate: false, eventHash }
}

export const canUseProtectedEndpoint = (
  req: EndpointReq,
  envTokenName: string,
  headerName: string,
) => {
  if (isAdmin(req.user?.roles)) return true
  const token = process.env[envTokenName]
  if (!token) return false
  return req.headers.get(headerName) === token
}

export const getOrderByNumber = async (req: EndpointReq, orderNumber: string) => {
  const lookup = await req.payload.find({
    collection: 'orders',
    req,
    where: { orderNumber: { equals: orderNumber } },
    depth: 0,
    limit: 1,
  })

  return lookup.docs[0]
}
