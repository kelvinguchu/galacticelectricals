import type { Endpoint } from 'payload'
import { parseTransactionStatusCallback, queryTransactionStatus } from '@/lib/mpesa-api-client'

import {
  badRequest,
  buildCallbackURL,
  canUseProtectedEndpoint,
  ensureCallbackAuth,
  getBaseURL,
  getOrderByNumber,
  markWebhookSeen,
  parseReconcileBody,
  readJSON,
  toNumber,
} from './endpoint-utils'

export const mpesaTransactionStatusQueryEndpoint: Endpoint = {
  path: '/mpesa/transaction-status/query',
  method: 'post',
  handler: async (req) => {
    try {
      if (!canUseProtectedEndpoint(req, 'MPESA_RECONCILE_TOKEN', 'x-mpesa-reconcile-token')) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const body = parseReconcileBody(await readJSON(req))
      let transactionID = body.transactionID || ''

      if (body.orderNumber) {
        const targetOrder = await getOrderByNumber(req, body.orderNumber)
        if (!targetOrder) {
          return badRequest('Order not found.', 404)
        }
        transactionID = targetOrder.mpesa?.receiptNumber || transactionID
      }

      if (!transactionID) {
        return badRequest(
          'Provide transactionID, or provide orderNumber with a known mpesa receipt number.',
        )
      }

      const baseURL = getBaseURL()
      if (!baseURL) {
        return badRequest('Missing MPESA_CALLBACK_BASE_URL or NEXT_PUBLIC_SERVER_URL', 500)
      }

      const query = await queryTransactionStatus({
        transactionID,
        resultURL: buildCallbackURL(baseURL, '/api/mpesa/transaction-status/result'),
        timeoutURL: buildCallbackURL(baseURL, '/api/mpesa/transaction-status/timeout'),
      })

      const responsePayload = query.responsePayload as Record<string, unknown>
      const conversationID =
        typeof responsePayload.ConversationID === 'string' ? responsePayload.ConversationID : ''
      const originatorConversationID =
        typeof responsePayload.OriginatorConversationID === 'string'
          ? responsePayload.OriginatorConversationID
          : ''

      const paymentLookup = await req.payload.find({
        collection: 'payments',
        req,
        where: { mpesaReceiptNumber: { equals: transactionID } },
        depth: 0,
        limit: 1,
      })

      const payment = paymentLookup.docs[0]
      if (payment) {
        await req.payload.update({
          collection: 'payments',
          id: payment.id,
          req,
          data: {
            transactionStatus: {
              conversationID,
              originatorConversationID,
              resultCode: toNumber(responsePayload.ResponseCode, 0),
              resultDesc:
                typeof responsePayload.ResponseDescription === 'string'
                  ? responsePayload.ResponseDescription
                  : '',
              rawPayload: query.responsePayload,
              checkedAt: new Date().toISOString(),
            },
          },
        })
      }

      return Response.json({
        success: true,
        transactionID,
        conversationID,
        originatorConversationID,
        mpesa: query.responsePayload,
      })
    } catch (error) {
      return badRequest(
        error instanceof Error ? error.message : 'Transaction status query failed',
        500,
      )
    }
  },
}

export const mpesaTransactionStatusResultEndpoint: Endpoint = {
  path: '/mpesa/transaction-status/result',
  method: 'post',
  handler: async (req) => {
    try {
      if (!ensureCallbackAuth(req)) {
        return Response.json({ ResultCode: 1, ResultDesc: 'Unauthorized callback' })
      }

      const payload = await readJSON(req)
      const dedupe = await markWebhookSeen(req, 'transaction_status_result', payload)
      if (dedupe.isDuplicate) {
        return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      const parsed = parseTransactionStatusCallback(payload)
      if (!parsed) {
        return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      const payment = await findPaymentForStatusResult(req, parsed)
      if (payment) {
        await applyTransactionStatusToPayment(req, payment, parsed, payload)
      }

      return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    } catch {
      return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }
  },
}

export const mpesaTransactionStatusTimeoutEndpoint: Endpoint = {
  path: '/mpesa/transaction-status/timeout',
  method: 'post',
  handler: async (req) => {
    try {
      if (!ensureCallbackAuth(req)) {
        return Response.json({ ResultCode: 1, ResultDesc: 'Unauthorized callback' })
      }

      const payload = await readJSON(req)
      const dedupe = await markWebhookSeen(req, 'transaction_status_timeout', payload)
      if (dedupe.isDuplicate) {
        return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
      }

      return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    } catch {
      return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }
  },
}

async function findPaymentForStatusResult(
  req: Parameters<Endpoint['handler']>[0],
  parsed: NonNullable<ReturnType<typeof parseTransactionStatusCallback>>,
) {
  if (parsed.transactionID) {
    const byReceipt = await req.payload.find({
      collection: 'payments',
      req,
      where: { mpesaReceiptNumber: { equals: parsed.transactionID } },
      depth: 0,
      limit: 1,
    })
    if (byReceipt.docs[0]) return byReceipt.docs[0]
  }

  if (parsed.originatorConversationID) {
    const byConversation = await req.payload.find({
      collection: 'payments',
      req,
      where: {
        'transactionStatus.originatorConversationID': {
          equals: parsed.originatorConversationID,
        },
      },
      depth: 0,
      limit: 1,
    })
    if (byConversation.docs[0]) return byConversation.docs[0]
  }

  return null
}

async function applyTransactionStatusToPayment(
  req: Parameters<Endpoint['handler']>[0],
  payment: Awaited<ReturnType<typeof findPaymentForStatusResult>> & object,
  parsed: NonNullable<ReturnType<typeof parseTransactionStatusCallback>>,
  rawPayload: unknown,
) {
  const isPaid = parsed.resultCode === 0

  await req.payload.update({
    collection: 'payments',
    id: payment.id,
    req,
    data: {
      status: isPaid ? 'success' : 'failed',
      mpesaReceiptNumber: parsed.transactionID || payment.mpesaReceiptNumber || undefined,
      transactionStatus: {
        conversationID: parsed.conversationID,
        originatorConversationID: parsed.originatorConversationID,
        resultCode: parsed.resultCode,
        resultDesc: parsed.resultDesc,
        rawPayload: rawPayload as Record<string, unknown>,
        checkedAt: new Date().toISOString(),
      },
    },
  })

  if (payment.order) {
    await req.payload.update({
      collection: 'orders',
      id: typeof payment.order === 'object' ? payment.order.id : payment.order,
      req,
      data: {
        paymentStatus: isPaid ? 'paid' : 'failed',
        paidAt: isPaid ? new Date().toISOString() : undefined,
        mpesa: {
          receiptNumber: parsed.transactionID || undefined,
          resultCode: parsed.resultCode,
          resultDesc: parsed.resultDesc,
        },
      },
    })
  }
}
