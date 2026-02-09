'use server'

import { randomInt } from 'node:crypto'
import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import { render } from '@react-email/render'
import config from '@payload-config'

import { OtpEmail } from '@/emails/OtpEmail'
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail'
import { AdminOrderNotificationEmail } from '@/emails/AdminOrderNotificationEmail'

const otpStore = new Map<string, { code: string; expiresAt: number }>()
const OTP_TTL_MS = 10 * 60 * 1000

async function getAuthUser() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  return user ?? null
}

// ── Profile prefill ─────────────────────────────────────────────────────────────

export type CheckoutProfile = {
  email: string
  firstName: string
  lastName: string
  phone: string
  shippingAddress: CheckoutShippingAddress | null
}

export async function getCheckoutProfile(): Promise<CheckoutProfile | null> {
  const user = await getAuthUser()
  if (!user) return null

  const payload = await getPayload({ config })
  const full = await payload.findByID({ collection: 'users', id: user.id, depth: 0 })

  const addr = full.shippingAddress as Record<string, string> | undefined

  return {
    email: full.email,
    firstName: full.firstName || '',
    lastName: full.lastName || '',
    phone: full.phone || '',
    shippingAddress: addr?.addressLine1
      ? {
          firstName: addr.firstName || full.firstName || '',
          lastName: addr.lastName || full.lastName || '',
          addressLine1: addr.addressLine1 || '',
          addressLine2: addr.addressLine2 || '',
          city: addr.city || '',
          county: addr.county || '',
          postalCode: addr.postalCode || '',
          country: addr.country || 'Kenya',
        }
      : null,
  }
}

// ── OTP ─────────────────────────────────────────────────────────────────────────

export async function sendCheckoutOtp(
  email: string,
): Promise<{ success: boolean; error?: string }> {
  if (!email?.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  const otp = randomInt(100000, 999999).toString()
  otpStore.set(email.toLowerCase(), { code: otp, expiresAt: Date.now() + OTP_TTL_MS })

  try {
    const payload = await getPayload({ config })
    const serverUrl = payload.config.serverURL || 'http://localhost:3000'

    const html = await render(OtpEmail({ serverUrl, otp, userEmail: email }))

    await payload.sendEmail({
      to: email,
      subject: `${otp} – Your checkout verification code`,
      html,
    })

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send verification email. Please try again.' }
  }
}

export async function verifyCheckoutOtp(
  email: string,
  code: string,
): Promise<{ success: boolean; error?: string }> {
  const entry = otpStore.get(email.toLowerCase())
  if (!entry) {
    return { success: false, error: 'No verification code found. Please request a new one.' }
  }
  if (Date.now() > entry.expiresAt) {
    otpStore.delete(email.toLowerCase())
    return { success: false, error: 'Code expired. Please request a new one.' }
  }
  if (entry.code !== code.trim()) {
    return { success: false, error: 'Invalid code. Please try again.' }
  }

  otpStore.delete(email.toLowerCase())
  return { success: true }
}

// ── Checkout / Order Placement ──────────────────────────────────────────────────

export type CheckoutItem = {
  productId: string
  title: string
  quantity: number
}

export type CheckoutShippingAddress = {
  firstName: string
  lastName: string
  addressLine1: string
  addressLine2?: string
  city: string
  county: string
  postalCode?: string
  country?: string
}

export type CheckoutInput = {
  customerEmail: string
  customerPhone: string
  shippingAddress: CheckoutShippingAddress
  items: CheckoutItem[]
  notes?: string
}

export type InitiateCheckoutResult = {
  success: boolean
  checkoutRequestID?: string
  error?: string
}

export type CheckoutStatusResult = {
  status: 'pending' | 'paid' | 'failed'
  orderNumber?: string
  total?: number
  error?: string
}

// ── Internal types ──────────────────────────────────────────────────────────────

type OrderItem = {
  product: string
  title: string
  sku?: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

type ValidatedItems =
  | { success: true; items: OrderItem[]; subtotal: number; total: number }
  | { success: false; error: string }

/** Checkout context stored on the Payment until the order is created. */
export type StoredCheckoutData = {
  customer: string | null
  customerEmail: string
  customerPhone: string
  shippingAddress: CheckoutShippingAddress & { phone: string; email: string }
  items: OrderItem[]
  pricing: {
    subtotal: number
    shipping: number
    tax: number
    discount: number
    total: number
    currency: string
  }
  notes: string
}

// ── Item validation ─────────────────────────────────────────────────────────────

async function validateAndBuildItems(
  items: CheckoutItem[],
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<ValidatedItems> {
  const orderItems: OrderItem[] = []

  for (const cartItem of items) {
    const qty = Math.max(1, Math.floor(cartItem.quantity))
    if (!cartItem.productId) {
      return { success: false, error: 'Each item must have a product ID.' }
    }

    const product = await payload.findByID({
      collection: 'products',
      id: cartItem.productId,
      depth: 0,
      draft: false,
    })

    const validationError = validateProduct(product, cartItem.title, qty)
    if (validationError) return { success: false, error: validationError }

    const salePrice = Number(product.salePrice) || 0
    const regularPrice = Number(product.regularPrice) || 0
    const unitPrice = Math.round((salePrice > 0 ? salePrice : regularPrice) * 100) / 100

    if (unitPrice <= 0) {
      return { success: false, error: `Invalid price for ${product.title}` }
    }

    orderItems.push({
      product: String(product.id),
      title: product.title || 'Untitled',
      sku: product.sku || undefined,
      quantity: qty,
      unitPrice,
      lineTotal: Math.round(unitPrice * qty * 100) / 100,
    })
  }

  const subtotal = Math.round(orderItems.reduce((s, i) => s + i.lineTotal, 0) * 100) / 100
  const total = Math.round(Math.max(0, subtotal) * 100) / 100

  return { success: true, items: orderItems, subtotal, total }
}

function validateProduct(
  product: {
    _status?: string | null
    title?: string | null
    stockStatus?: string | null
    manageStock?: boolean | null
    stockQuantity?: number | null
  },
  fallbackTitle: string,
  qty: number,
): string | null {
  if (!product) return `Product not found: ${fallbackTitle}`
  if (product._status !== 'published') return `Product unavailable: ${product.title}`
  if (product.stockStatus === 'outofstock') return `Out of stock: ${product.title}`
  if (
    product.manageStock &&
    product.stockStatus !== 'onbackorder' &&
    (product.stockQuantity ?? 0) < qty
  ) {
    return `Not enough stock for ${product.title}`
  }
  return null
}

// ── Main: initiateCheckout ──────────────────────────────────────────────────────

/**
 * Validates the cart, creates a Payment with checkout context,
 * and initiates M-Pesa STK push. The actual Order is created only
 * when the M-Pesa callback confirms payment.
 */
export async function initiateCheckout(input: CheckoutInput): Promise<InitiateCheckoutResult> {
  try {
    const payload = await getPayload({ config })
    const user = await getAuthUser()

    const validated = await validateAndBuildItems(input.items, payload)
    if (!validated.success) return { success: false, error: validated.error }

    const { items: orderItems, subtotal, total } = validated

    const checkoutData: StoredCheckoutData = {
      customer: user?.id ?? null,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      shippingAddress: {
        ...input.shippingAddress,
        country: input.shippingAddress.country || 'Kenya',
        phone: input.customerPhone,
        email: input.customerEmail,
      },
      items: orderItems,
      pricing: { subtotal, shipping: 0, tax: 0, discount: 0, total, currency: 'KES' },
      notes: input.notes || '',
    }

    const { initiateSTKPush } = await import('@/lib/mpesa-api-client')
    const baseURL = process.env.MPESA_CALLBACK_BASE_URL || process.env.NEXT_PUBLIC_SERVER_URL
    if (!baseURL) throw new Error('Payment configuration error. Please contact support.')

    const callbackToken = process.env.MPESA_CALLBACK_TOKEN
    const callbackURL = callbackToken
      ? `${baseURL}/api/mpesa/callback/stk?token=${callbackToken}`
      : `${baseURL}/api/mpesa/callback/stk`

    const stk = await initiateSTKPush({
      amount: total,
      phone: input.customerPhone,
      callbackURL,
      accountReference: 'GSE-CHECKOUT',
      transactionDesc: 'Galactic Solar Electricals checkout',
    })

    const res = stk.responsePayload as Record<string, string>
    const merchantRequestID = res.MerchantRequestID || ''
    const checkoutRequestID = res.CheckoutRequestID || ''

    await payload.create({
      collection: 'payments',
      data: {
        provider: 'mpesa',
        channel: 'stk_push',
        status: 'pending',
        amount: total,
        currency: 'KES',
        phone: input.customerPhone,
        checkoutRequestID,
        merchantRequestID,
        requestPayload: stk.requestPayload,
        callbackPayload: stk.responsePayload,
        resultCode: Number(res.ResponseCode) || 0,
        resultDesc: res.ResponseDescription || '',
        checkoutData: checkoutData as unknown as Record<string, unknown>,
      },
    })

    return { success: true, checkoutRequestID }
  } catch (err) {
    console.error('[Checkout] initiateCheckout error:', err)
    return {
      success: false,
      error: 'Unable to initiate payment. Please try again shortly.',
    }
  }
}

// ── Poll: getCheckoutStatus ─────────────────────────────────────────────────────

/** Threshold in ms before we proactively query M-Pesa when the callback hasn't arrived. */
const STK_QUERY_AFTER_MS = 15_000

type PaymentForFallback = {
  id: string
  merchantRequestID?: string | null
  amount?: number | null
  checkoutData?: unknown
  createdAt: string
}

async function handleSTKQueryFallback(
  payload: Awaited<ReturnType<typeof getPayload>>,
  payment: PaymentForFallback,
  checkoutRequestID: string,
): Promise<CheckoutStatusResult | null> {
  const { querySTKStatus } = await import('@/lib/mpesa-api-client')
  const stkResult = await querySTKStatus(checkoutRequestID)
  console.log(
    '[CheckoutStatus] STK query fallback for',
    payment.id,
    '→ resultCode:',
    stkResult.resultCode,
  )

  if (stkResult.resultCode === 0) {
    return await processSuccessfulFallback(payload, payment, checkoutRequestID, stkResult)
  }

  if (stkResult.resultCode > 0) {
    await payload.update({
      collection: 'payments',
      id: payment.id,
      data: {
        status: 'failed',
        resultCode: stkResult.resultCode,
        resultDesc: stkResult.resultDesc,
        callbackPayload: stkResult.responsePayload as Record<string, unknown>,
      },
    })
    return { status: 'failed', error: stkResult.resultDesc || 'Payment was not completed.' }
  }

  return null // resultCode === -1: M-Pesa hasn't processed yet
}

async function processSuccessfulFallback(
  payload: Awaited<ReturnType<typeof getPayload>>,
  payment: PaymentForFallback,
  checkoutRequestID: string,
  stkResult: Awaited<ReturnType<typeof import('@/lib/mpesa-api-client').querySTKStatus>>,
): Promise<CheckoutStatusResult> {
  const checkoutData = payment.checkoutData as StoredCheckoutData | null

  if (!checkoutData) {
    await payload.update({
      collection: 'payments',
      id: payment.id,
      data: {
        status: 'success',
        resultCode: stkResult.resultCode,
        resultDesc: stkResult.resultDesc,
        callbackPayload: stkResult.responsePayload as Record<string, unknown>,
      },
    })
    return { status: 'paid', total: payment.amount ?? 0 }
  }

  const order = await payload.create({
    collection: 'orders',
    data: {
      customer: checkoutData.customer || undefined,
      customerEmail: checkoutData.customerEmail,
      customerPhone: checkoutData.customerPhone,
      paymentMethod: 'mpesa',
      paymentStatus: 'paid',
      paidAt: new Date().toISOString(),
      fulfillmentStatus: 'pending',
      currency: 'KES',
      items: checkoutData.items,
      pricing: checkoutData.pricing,
      shippingAddress: {
        ...checkoutData.shippingAddress,
        country: checkoutData.shippingAddress.country || 'Kenya',
      },
      notes: checkoutData.notes || undefined,
      mpesa: {
        merchantRequestID:
          stkResult.merchantRequestID || (payment.merchantRequestID as string) || '',
        checkoutRequestID,
        resultCode: stkResult.resultCode,
        resultDesc: stkResult.resultDesc,
      },
    },
  })

  await payload.update({
    collection: 'payments',
    id: payment.id,
    data: {
      order: order.id,
      reference: order.orderNumber,
      status: 'success',
      resultCode: stkResult.resultCode,
      resultDesc: stkResult.resultDesc,
      callbackPayload: stkResult.responsePayload as Record<string, unknown>,
    },
  })

  if (checkoutData.customer) {
    try {
      await payload.update({
        collection: 'users',
        id: checkoutData.customer,
        data: {
          firstName: checkoutData.shippingAddress.firstName,
          lastName: checkoutData.shippingAddress.lastName,
          phone: checkoutData.customerPhone,
          shippingAddress: {
            addressLine1: checkoutData.shippingAddress.addressLine1,
            addressLine2: checkoutData.shippingAddress.addressLine2 || '',
            city: checkoutData.shippingAddress.city,
            county: checkoutData.shippingAddress.county || '',
            postalCode: checkoutData.shippingAddress.postalCode || '',
            country: checkoutData.shippingAddress.country || 'Kenya',
          },
          cart: [],
        },
      })
    } catch {
      /* best-effort */
    }
  }

  const orderNum = order.orderNumber || String(order.id)
  sendOrderEmails(payload, checkoutData, orderNum).catch(() => {})

  return {
    status: 'paid',
    orderNumber: order.orderNumber || undefined,
    total: checkoutData.pricing.total,
  }
}

function extractOrderId(order: unknown): string | null {
  if (!order) return null
  if (typeof order === 'object') {
    return String((order as { id?: string }).id || '')
  }
  return typeof order === 'string' || typeof order === 'number' ? String(order) : null
}

async function resolveSuccessPayment(
  payload: Awaited<ReturnType<typeof getPayload>>,
  payment: { order?: unknown; amount?: number | null; checkoutData?: unknown },
): Promise<CheckoutStatusResult> {
  const orderId = extractOrderId(payment.order)

  if (orderId) {
    const order = await payload.findByID({ collection: 'orders', id: orderId, depth: 0 })
    return {
      status: 'paid',
      orderNumber: order.orderNumber || undefined,
      total: typeof order.pricing?.total === 'number' ? order.pricing.total : (payment.amount ?? 0),
    }
  }

  const cd = payment.checkoutData as StoredCheckoutData | null
  return {
    status: 'paid',
    total: cd?.pricing?.total ?? payment.amount ?? 0,
  }
}

async function trySTKFallback(
  payload: Awaited<ReturnType<typeof getPayload>>,
  payment: PaymentForFallback,
  checkoutRequestID: string,
): Promise<CheckoutStatusResult | null> {
  const pendingSinceMs = Date.now() - new Date(payment.createdAt).getTime()
  if (pendingSinceMs <= STK_QUERY_AFTER_MS) return null

  try {
    return await handleSTKQueryFallback(payload, payment, checkoutRequestID)
  } catch (error_) {
    console.error('[CheckoutStatus] STK query fallback error:', error_)
    return null
  }
}

export async function getCheckoutStatus(checkoutRequestID: string): Promise<CheckoutStatusResult> {
  try {
    const payload = await getPayload({ config })

    const lookup = await payload.find({
      collection: 'payments',
      where: { checkoutRequestID: { equals: checkoutRequestID } },
      depth: 0,
      limit: 1,
    })

    const payment = lookup.docs[0]
    if (!payment) {
      console.log('[CheckoutStatus] No payment found for', checkoutRequestID)
      return { status: 'pending' }
    }

    console.log('[CheckoutStatus] Payment', payment.id, 'status:', payment.status)

    if (payment.status === 'success') {
      return resolveSuccessPayment(payload, payment)
    }

    if (payment.status === 'failed' || payment.status === 'rejected') {
      return {
        status: 'failed',
        error: (payment.resultDesc as string) || 'Payment was not completed.',
      }
    }

    const fallbackResult = await trySTKFallback(payload, payment, checkoutRequestID)
    return fallbackResult ?? { status: 'pending' }
  } catch (error_) {
    console.error('[CheckoutStatus] Error:', error_)
    return { status: 'pending' }
  }
}

// ── Email sending (used by STK callback endpoint) ───────────────────────────────

export async function sendOrderEmails(
  payload: Awaited<ReturnType<typeof getPayload>>,
  checkoutData: StoredCheckoutData,
  orderNumber: string,
): Promise<void> {
  const serverUrl = payload.config.serverURL || 'http://localhost:3000'

  const emailItems = checkoutData.items.map((i) => ({
    title: i.title,
    quantity: i.quantity,
    unitPrice: i.unitPrice,
    lineTotal: i.lineTotal,
  }))

  const confirmationHtml = await render(
    OrderConfirmationEmail({
      serverUrl,
      orderNumber,
      customerName: checkoutData.shippingAddress.firstName,
      items: emailItems,
      subtotal: checkoutData.pricing.subtotal,
      shipping: checkoutData.pricing.shipping,
      total: checkoutData.pricing.total,
      shippingAddress: {
        addressLine1: checkoutData.shippingAddress.addressLine1,
        city: checkoutData.shippingAddress.city,
        county: checkoutData.shippingAddress.county,
        country: checkoutData.shippingAddress.country,
      },
    }),
  )

  payload
    .sendEmail({
      to: checkoutData.customerEmail,
      subject: `Order ${orderNumber} confirmed – Galactic Solar & Electricals`,
      html: confirmationHtml,
    })
    .catch(() => {})

  const adminEmail = process.env.TO_EMAIL
  if (!adminEmail) return

  const adminHtml = await render(
    AdminOrderNotificationEmail({
      serverUrl,
      orderNumber,
      customerEmail: checkoutData.customerEmail,
      customerPhone: checkoutData.customerPhone,
      items: emailItems,
      total: checkoutData.pricing.total,
      shippingCity: checkoutData.shippingAddress.city,
    }),
  )

  payload
    .sendEmail({
      to: adminEmail,
      subject: `New order ${orderNumber} – ${Math.round(checkoutData.pricing.total).toLocaleString()} KES`,
      html: adminHtml,
    })
    .catch(() => {})
}
