import type { Endpoint } from 'payload'
import { parseSTKCallback, type ParsedSTKCallback } from '@/lib/mpesa-api-client'
import { sendOrderEmails, type StoredCheckoutData } from '@/actions/checkout'

import { type EndpointReq, ensureCallbackAuth, markWebhookSeen, readJSON } from './endpoint-utils'

type PaymentDoc = { id: string; phone?: string | null; checkoutData?: unknown }

async function handlePaymentSuccess(
  req: EndpointReq,
  payment: PaymentDoc,
  callback: ParsedSTKCallback,
  rawPayload: unknown,
) {
  const checkoutData = payment.checkoutData as StoredCheckoutData | null

  if (!checkoutData) {
    await req.payload.update({
      collection: 'payments',
      id: payment.id,
      req,
      data: {
        status: 'success',
        resultCode: callback.resultCode,
        resultDesc: callback.resultDesc,
        mpesaReceiptNumber: callback.mpesaReceiptNumber || undefined,
        callbackPayload: rawPayload as Record<string, unknown>,
        phone: callback.phoneNumber || payment.phone || undefined,
      },
    })
    return
  }

  const order = await req.payload.create({
    collection: 'orders',
    req,
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
        merchantRequestID: callback.merchantRequestID,
        checkoutRequestID: callback.checkoutRequestID,
        resultCode: callback.resultCode,
        resultDesc: callback.resultDesc,
        receiptNumber: callback.mpesaReceiptNumber || undefined,
        transactionDate: callback.transactionDate || undefined,
      },
    },
  })

  await req.payload.update({
    collection: 'payments',
    id: payment.id,
    req,
    data: {
      order: order.id,
      reference: order.orderNumber,
      status: 'success',
      resultCode: callback.resultCode,
      resultDesc: callback.resultDesc,
      mpesaReceiptNumber: callback.mpesaReceiptNumber || undefined,
      callbackPayload: rawPayload as Record<string, unknown>,
      phone: callback.phoneNumber || payment.phone || undefined,
    },
  })

  // Sync user profile + clear cart in one update (prevents WriteConflict)
  if (checkoutData.customer) {
    try {
      await req.payload.update({
        collection: 'users',
        id: checkoutData.customer,
        req,
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
      // best-effort
    }
  }

  const orderNum = order.orderNumber || String(order.id)
  sendOrderEmails(req.payload, checkoutData, orderNum).catch(() => {})
}

export const mpesaSTKCallbackEndpoint: Endpoint = {
  path: '/mpesa/callback/stk',
  method: 'post',
  handler: async (req) => {
    try {
      if (!ensureCallbackAuth(req)) {
        return Response.json({ ResultCode: 1, ResultDesc: 'Unauthorized callback' })
      }

      const payload = await readJSON(req)
      const dedupe = await markWebhookSeen(req, 'stk_callback', payload)
      if (dedupe.isDuplicate) {
        return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      const callback = parseSTKCallback(payload)
      console.log('[STK Callback] Parsed:', JSON.stringify(callback, null, 2))

      if (!callback?.checkoutRequestID) {
        console.log('[STK Callback] No checkoutRequestID in callback, ignoring')
        return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      const paymentLookup = await req.payload.find({
        collection: 'payments',
        req,
        where: { checkoutRequestID: { equals: callback.checkoutRequestID } },
        depth: 0,
        limit: 1,
      })

      const payment = paymentLookup.docs[0]
      if (!payment) {
        console.log(
          '[STK Callback] No payment found for checkoutRequestID:',
          callback.checkoutRequestID,
        )
        return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      console.log('[STK Callback] Found payment', payment.id, '- resultCode:', callback.resultCode)

      if (callback.resultCode === 0) {
        await handlePaymentSuccess(req, payment, callback, payload)
        console.log('[STK Callback] Payment success handled for', payment.id)
      } else {
        await req.payload.update({
          collection: 'payments',
          id: payment.id,
          req,
          data: {
            status: 'failed',
            resultCode: callback.resultCode,
            resultDesc: callback.resultDesc,
            callbackPayload: payload as Record<string, unknown>,
            phone: callback.phoneNumber || payment.phone || undefined,
          },
        })
      }

      return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    } catch (err) {
      console.error('[STK Callback] Unhandled error:', err)
      return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }
  },
}
