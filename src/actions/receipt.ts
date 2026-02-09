'use server'

import { getPayload } from 'payload'
import { headers as getHeaders } from 'next/headers'
import config from '@payload-config'
import type { ReceiptData, ReceiptItem } from '@/components/checkout/pdf/receipt-types'

export async function getReceiptData(orderNumber: string): Promise<ReceiptData | null> {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const { user } = await payload.auth({ headers })

    const result = await payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      depth: 0,
      limit: 1,
      overrideAccess: !user,
      user: user ?? undefined,
    })

    const order = result.docs[0]
    if (!order) return null

    const items: ReceiptItem[] = Array.isArray(order.items)
      ? order.items.map((item) => ({
          title: item.title || 'Untitled',
          sku: item.sku || undefined,
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          lineTotal: item.lineTotal || 0,
        }))
      : []

    const pricing = {
      subtotal: order.pricing?.subtotal ?? 0,
      shipping: order.pricing?.shipping ?? 0,
      tax: order.pricing?.tax ?? 0,
      discount: order.pricing?.discount ?? 0,
      total: order.pricing?.total ?? 0,
      currency: order.pricing?.currency || order.currency || 'KES',
    }

    let mpesaReceiptNumber: string | undefined
    let paidAt: string | undefined

    const paymentLookup = await payload.find({
      collection: 'payments',
      where: {
        order: { equals: order.id },
        status: { equals: 'success' },
      },
      depth: 0,
      limit: 1,
      overrideAccess: true,
    })

    const paymentDoc = paymentLookup.docs[0]
    if (paymentDoc) {
      mpesaReceiptNumber = paymentDoc.mpesaReceiptNumber || undefined
    }

    paidAt = order.paidAt || undefined

    const sa = order.shippingAddress ?? {}

    return {
      orderNumber: order.orderNumber || orderNumber,
      orderDate: order.placedAt || order.createdAt,
      items,
      pricing,
      payment: {
        method: order.paymentMethod || 'mpesa',
        phone: order.customerPhone || undefined,
        mpesaReceiptNumber,
        paidAt,
      },
      shippingAddress: {
        firstName: sa.firstName || '',
        lastName: sa.lastName || '',
        phone: sa.phone || order.customerPhone || undefined,
        email: sa.email || order.customerEmail || undefined,
        addressLine1: sa.addressLine1 || '',
        addressLine2: sa.addressLine2 || undefined,
        city: sa.city || '',
        county: sa.county || undefined,
        postalCode: sa.postalCode || undefined,
        country: sa.country || 'Kenya',
      },
      customerEmail: order.customerEmail,
    }
  } catch (err) {
    console.error('[getReceiptData] Error:', err)
    return null
  }
}
