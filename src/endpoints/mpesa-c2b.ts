import type { Endpoint } from 'payload'
import { parseC2BPayload, registerC2BUrls } from '@/lib/mpesa-api-client'

import {
  buildCallbackURL,
  canUseProtectedEndpoint,
  ensureCallbackAuth,
  getBaseURL,
  getOrderByNumber,
  markWebhookSeen,
  readJSON,
  toNumber,
} from './endpoint-utils'

export const mpesaC2BValidateEndpoint: Endpoint = {
  path: '/mpesa/c2b/validate',
  method: 'post',
  handler: async (req) => {
    try {
      if (!ensureCallbackAuth(req)) {
        return Response.json({ ResultCode: 1, ResultDesc: 'Unauthorized callback' })
      }

      const payload = await readJSON(req)
      const dedupe = await markWebhookSeen(req, 'c2b_validate', payload)
      if (dedupe.isDuplicate) {
        return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      const parsed = parseC2BPayload(payload)
      if (!parsed.billRefNumber) {
        return Response.json({ ResultCode: 1, ResultDesc: 'BillRefNumber is required' })
      }

      const order = await getOrderByNumber(req, parsed.billRefNumber)
      if (!order) {
        return Response.json({ ResultCode: 1, ResultDesc: 'Order not found' })
      }

      if (order.paymentStatus === 'paid') {
        return Response.json({ ResultCode: 1, ResultDesc: 'Order is already paid' })
      }

      const expectedAmount = toNumber(order.pricing?.total, 0)
      if (expectedAmount > 0 && parsed.amount < expectedAmount) {
        return Response.json({
          ResultCode: 1,
          ResultDesc: `Amount is lower than order total. Expected at least ${expectedAmount}`,
        })
      }

      return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    } catch {
      return Response.json({ ResultCode: 1, ResultDesc: 'Validation failed' })
    }
  },
}

export const mpesaC2BConfirmEndpoint: Endpoint = {
  path: '/mpesa/c2b/confirm',
  method: 'post',
  handler: async (req) => {
    try {
      if (!ensureCallbackAuth(req)) {
        return Response.json({ ResultCode: 1, ResultDesc: 'Unauthorized callback' })
      }

      const payload = await readJSON(req)
      const dedupe = await markWebhookSeen(req, 'c2b_confirm', payload)
      if (dedupe.isDuplicate) {
        return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      const parsed = parseC2BPayload(payload)
      if (!parsed.billRefNumber || !parsed.transID) {
        return Response.json({ ResultCode: 1, ResultDesc: 'Missing transaction details' })
      }

      const order = await getOrderByNumber(req, parsed.billRefNumber)
      if (!order) {
        return Response.json({ ResultCode: 1, ResultDesc: 'Order not found' })
      }

      const existingPaymentLookup = await req.payload.find({
        collection: 'payments',
        req,
        where: { mpesaReceiptNumber: { equals: parsed.transID } },
        depth: 0,
        limit: 1,
      })

      if (!existingPaymentLookup.docs[0]) {
        await req.payload.create({
          collection: 'payments',
          req,
          data: {
            order: order.id,
            provider: 'mpesa',
            channel: 'c2b',
            status: 'success',
            amount: parsed.amount,
            currency: 'KES',
            phone: parsed.msisdn,
            reference: parsed.billRefNumber,
            mpesaReceiptNumber: parsed.transID,
            resultCode: 0,
            resultDesc: 'C2B confirmed',
            callbackPayload: payload as Record<string, unknown>,
          },
        })
      }

      if (order.paymentStatus !== 'paid') {
        await req.payload.update({
          collection: 'orders',
          id: order.id,
          req,
          data: {
            paymentStatus: 'paid',
            paidAt: new Date().toISOString(),
            mpesa: {
              receiptNumber: parsed.transID,
              resultCode: 0,
              resultDesc: 'C2B payment confirmed',
              transactionDate: parsed.transTime || undefined,
            },
          },
        })
      }

      return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    } catch {
      return Response.json({ ResultCode: 1, ResultDesc: 'Confirmation failed' })
    }
  },
}

export const mpesaC2BRegisterEndpoint: Endpoint = {
  path: '/mpesa/c2b/register',
  method: 'post',
  handler: async (req) => {
    try {
      if (!canUseProtectedEndpoint(req, 'MPESA_REGISTER_TOKEN', 'x-mpesa-register-token')) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const baseURL = getBaseURL()
      if (!baseURL) {
        return Response.json(
          { error: 'Missing MPESA_CALLBACK_BASE_URL or NEXT_PUBLIC_SERVER_URL' },
          { status: 500 },
        )
      }

      const result = await registerC2BUrls(
        buildCallbackURL(baseURL, '/api/mpesa/c2b/validate'),
        buildCallbackURL(baseURL, '/api/mpesa/c2b/confirm'),
      )

      return Response.json({ success: true, result })
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : 'Unable to register C2B URLs' },
        { status: 500 },
      )
    }
  },
}
