import type { Endpoint } from 'payload'

import { badRequest, isAdmin } from './endpoint-utils'

export const getOrderByNumberEndpoint: Endpoint = {
  path: '/ecommerce/orders/:orderNumber',
  method: 'get',
  handler: async (req) => {
    const orderNumber = req.routeParams?.orderNumber
    if (!orderNumber) {
      return badRequest('Missing order number.')
    }

    const lookup = await req.payload.find({
      collection: 'orders',
      req,
      where: { orderNumber: { equals: orderNumber } },
      depth: 1,
      limit: 1,
    })

    const order = lookup.docs[0]
    if (!order) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }

    if (isAdmin(req.user?.roles)) {
      return Response.json({ order })
    }

    if (req.user?.id && String(order.customer) === String(req.user.id)) {
      return Response.json({ order })
    }

    const email = req.url ? new URL(req.url).searchParams.get('email') : null
    if (email && order.customerEmail?.toLowerCase() === email.toLowerCase()) {
      return Response.json({ order })
    }

    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  },
}
