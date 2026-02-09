import type { Endpoint } from 'payload'
import { initiateSTKPush } from '@/lib/mpesa-api-client'

import {
  badRequest,
  buildCallbackURL,
  getBaseURL,
  parseCreateOrderBody,
  readJSON,
  roundMoney,
  toNumber,
} from './endpoint-utils'

type OrderItem = {
  product: string
  title: string
  sku?: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

type BuildResult = { items: OrderItem[] } | { error: string }

function validateProduct(
  product: {
    _status?: string | null
    productType?: string | null
    stockStatus?: string | null
    manageStock?: boolean | null
    stockQuantity?: number | null
    title?: string | null
  },
  quantity: number,
): string | null {
  if (product._status !== 'published') {
    return `Product is not available for sale: ${product.title}`
  }
  if (product.productType !== 'simple') {
    return `Only simple products are currently supported at checkout: ${product.title}`
  }
  if (product.stockStatus === 'outofstock') {
    return `Product is out of stock: ${product.title}`
  }
  if (
    product.manageStock &&
    product.stockStatus !== 'onbackorder' &&
    toNumber(product.stockQuantity, 0) < quantity
  ) {
    return `Insufficient stock for ${product.title}`
  }
  return null
}

const buildOrderItems = async (
  req: Parameters<Endpoint['handler']>[0],
  items: Array<{ productId: string; quantity: number }>,
): Promise<BuildResult> => {
  const orderItems: OrderItem[] = []

  for (const item of items) {
    const quantity = Math.max(1, Math.floor(toNumber(item.quantity, 1)))
    if (!item.productId) return { error: 'Each order item must include productId.' }

    const product = await req.payload.findByID({
      collection: 'products',
      id: item.productId,
      depth: 0,
      draft: false,
      req,
    })

    if (!product) return { error: `Product not found: ${item.productId}` }

    const validationError = validateProduct(product, quantity)
    if (validationError) return { error: validationError }

    const salePrice = toNumber(product.salePrice, 0)
    const regularPrice = toNumber(product.regularPrice, 0)
    const unitPrice = roundMoney(salePrice > 0 ? salePrice : regularPrice)

    if (unitPrice <= 0) {
      return { error: `Product price is not valid for checkout: ${product.title}` }
    }

    orderItems.push({
      product: String(product.id),
      title: product.title || 'Untitled Product',
      sku: product.sku || undefined,
      quantity,
      unitPrice,
      lineTotal: roundMoney(unitPrice * quantity),
    })
  }

  return { items: orderItems }
}

const syncUserProfile = async (
  req: Parameters<Endpoint['handler']>[0],
  body: ReturnType<typeof parseCreateOrderBody> & object,
) => {
  if (!req.user?.id) return

  const currentUser = await req.payload.findByID({
    collection: 'users',
    id: req.user.id,
    depth: 0,
    req,
  })

  const profileUpdate: Record<string, unknown> = {}
  const sa = body.shippingAddress

  if (sa.firstName && sa.firstName !== currentUser.firstName) {
    profileUpdate.firstName = sa.firstName
  }
  if (sa.lastName && sa.lastName !== currentUser.lastName) {
    profileUpdate.lastName = sa.lastName
  }
  if (body.customerPhone && body.customerPhone !== currentUser.phone) {
    profileUpdate.phone = body.customerPhone
  }

  const currentAddr = (currentUser.shippingAddress ?? {}) as Record<string, unknown>
  const addrUpdate: Record<string, unknown> = {}
  const addrFields: Array<[string, string | undefined]> = [
    ['addressLine1', sa.addressLine1],
    ['city', sa.city],
    ['county', sa.county],
    ['postalCode', sa.postalCode],
    ['country', sa.country || 'Kenya'],
  ]

  for (const [key, value] of addrFields) {
    if (value && value !== currentAddr[key]) {
      addrUpdate[key] = value
    }
  }

  if (Object.keys(addrUpdate).length > 0) {
    profileUpdate.shippingAddress = { ...currentAddr, ...addrUpdate }
  }

  if (Object.keys(profileUpdate).length > 0) {
    await req.payload.update({
      collection: 'users',
      id: req.user.id,
      data: profileUpdate,
      req,
    })
  }
}

const initiatePayment = async (
  req: Parameters<Endpoint['handler']>[0],
  order: { id: string; orderNumber?: string | null },
  total: number,
  phone: string,
) => {
  const baseURL = getBaseURL()
  if (!baseURL) {
    throw new Error('Missing MPESA_CALLBACK_BASE_URL or NEXT_PUBLIC_SERVER_URL')
  }

  const stk = await initiateSTKPush({
    amount: total,
    phone,
    callbackURL: buildCallbackURL(baseURL, '/api/mpesa/callback/stk'),
    accountReference: order.orderNumber || String(order.id),
    transactionDesc: `Order ${order.orderNumber || order.id}`,
  })

  const responsePayload = stk.responsePayload as Record<string, unknown>
  const merchantRequestID = String(responsePayload.MerchantRequestID || '')
  const checkoutRequestID = String(responsePayload.CheckoutRequestID || '')

  await req.payload.create({
    collection: 'payments',
    req,
    data: {
      order: order.id,
      provider: 'mpesa',
      channel: 'stk_push',
      status: 'pending',
      amount: total,
      currency: 'KES',
      phone,
      reference: order.orderNumber,
      checkoutRequestID,
      merchantRequestID,
      requestPayload: stk.requestPayload,
      callbackPayload: stk.responsePayload,
      resultCode: toNumber(responsePayload.ResponseCode, 0),
      resultDesc: String(responsePayload.ResponseDescription || ''),
    },
  })

  await req.payload.update({
    collection: 'orders',
    id: order.id,
    req,
    data: {
      paymentStatus: 'processing',
      mpesa: {
        merchantRequestID,
        checkoutRequestID,
        resultCode: toNumber(responsePayload.ResponseCode, 0),
        resultDesc: String(responsePayload.ResponseDescription || ''),
      },
    },
  })

  return stk.responsePayload
}

const recordPaymentFailure = async (
  req: Parameters<Endpoint['handler']>[0],
  order: { id: string; orderNumber?: string | null },
  total: number,
  phone: string,
  error: unknown,
) => {
  const message = error instanceof Error ? error.message : 'STK push initiation failed'

  await req.payload.create({
    collection: 'payments',
    req,
    data: {
      order: order.id,
      provider: 'mpesa',
      channel: 'stk_push',
      status: 'failed',
      amount: total,
      currency: 'KES',
      phone,
      reference: order.orderNumber,
      resultDesc: message,
    },
  })

  await req.payload.update({
    collection: 'orders',
    id: order.id,
    req,
    data: {
      paymentStatus: 'failed',
      mpesa: { resultDesc: message },
    },
  })
}

export const createOrderEndpoint: Endpoint = {
  path: '/ecommerce/orders/create',
  method: 'post',
  handler: async (req) => {
    try {
      const requestBody = await readJSON(req)
      const body = parseCreateOrderBody(requestBody)

      if (!body) {
        return badRequest('Invalid payload for order creation.')
      }

      const result = await buildOrderItems(req, body.items)
      if ('error' in result) return badRequest(result.error)
      const orderItems = result.items
      const subtotal = roundMoney(orderItems.reduce((sum, item) => sum + item.lineTotal, 0))
      const shipping = roundMoney(Math.max(0, toNumber(body.shipping, 0)))
      const tax = roundMoney(Math.max(0, toNumber(body.tax, 0)))
      const discount = roundMoney(Math.max(0, toNumber(body.discount, 0)))
      const total = roundMoney(Math.max(0, subtotal + shipping + tax - discount))

      const order = await req.payload.create({
        collection: 'orders',
        req,
        data: {
          customer: req.user?.id,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone,
          paymentMethod: 'mpesa',
          paymentStatus: 'pending',
          fulfillmentStatus: 'pending',
          currency: 'KES',
          items: orderItems,
          pricing: { subtotal, shipping, tax, discount, total, currency: 'KES' },
          shippingAddress: {
            ...body.shippingAddress,
            country: body.shippingAddress.country || 'Kenya',
            phone: body.shippingAddress.phone || body.customerPhone,
            email: body.shippingAddress.email || body.customerEmail,
          },
          notes: body.notes,
        },
      })

      // Best-effort: sync checkout details back to user profile (skip email)
      try {
        await syncUserProfile(req, body)
      } catch {
        // do not fail the order
      }

      try {
        const mpesaResponse = await initiatePayment(req, order, total, body.customerPhone)

        return Response.json({
          success: true,
          orderID: order.id,
          orderNumber: order.orderNumber,
          amount: total,
          mpesa: mpesaResponse,
        })
      } catch (error) {
        await recordPaymentFailure(req, order, total, body.customerPhone, error)
        throw error
      }
    } catch (error) {
      return badRequest(error instanceof Error ? error.message : 'Failed to create order', 500)
    }
  },
}
