import type { CollectionConfig } from 'payload'

const isAdmin = (roles?: (string | null)[] | null) => roles?.includes('admin') || false

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
  }
  return fallback
}

const roundMoney = (value: number) => Math.round(value * 100) / 100

const generateOrderNumber = () => {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  return `GSE-${timestamp.slice(-8)}-${random}`
}

const resolveProductID = (product: unknown): string => {
  if (typeof product === 'object' && product) {
    return String((product as { id?: string | number }).id || '')
  }
  if (typeof product === 'string' || typeof product === 'number') {
    return String(product)
  }
  return ''
}

const adjustItemStock = async (
  item: Record<string, unknown>,
  req: Parameters<
    NonNullable<NonNullable<CollectionConfig['hooks']>['afterChange']>[number]
  >[0]['req'],
  context: Record<string, unknown>,
): Promise<void> => {
  const quantity = Math.max(0, Math.floor(toNumber(item.quantity, 0)))
  if (!quantity) return

  const productID = resolveProductID(item.product)
  if (!productID) return

  const product = await req.payload.findByID({
    collection: 'products',
    id: productID,
    depth: 0,
    req,
  })

  if (!product?.manageStock) return

  const nextQuantity = Math.max(0, toNumber(product.stockQuantity, 0) - quantity)

  await req.payload.update({
    collection: 'products',
    id: productID,
    req,
    context: { ...context, skipInventoryAdjustment: true },
    data: {
      stockQuantity: nextQuantity,
      stockStatus: nextQuantity > 0 ? 'instock' : 'outofstock',
    },
  })
}

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: [
      'orderNumber',
      'customerEmail',
      'pricing.total',
      'paymentStatus',
      'fulfillmentStatus',
      'createdAt',
    ],
    group: 'Shop',
  },
  access: {
    create: ({ req: { user } }) => isAdmin(user?.roles),
    update: ({ req: { user } }) => isAdmin(user?.roles),
    delete: ({ req: { user } }) => isAdmin(user?.roles),
    read: ({ req: { user } }) => {
      if (!user) return false
      if (isAdmin(user.roles)) return true
      return {
        customer: {
          equals: user.id,
        },
      }
    },
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation }) => {
        if (!data) return data

        const normalizedItems = Array.isArray(data.items)
          ? data.items.map((item: Record<string, unknown>) => {
              const quantity = Math.max(1, Math.floor(toNumber(item.quantity, 1)))
              const unitPrice = roundMoney(Math.max(0, toNumber(item.unitPrice, 0)))
              const lineTotal = roundMoney(quantity * unitPrice)

              return {
                ...item,
                quantity,
                unitPrice,
                lineTotal,
              }
            })
          : []

        const subtotal = roundMoney(
          normalizedItems.reduce((sum, item) => sum + toNumber(item.lineTotal, 0), 0),
        )

        const shipping = roundMoney(Math.max(0, toNumber(data?.pricing?.shipping, 0)))
        const tax = roundMoney(Math.max(0, toNumber(data?.pricing?.tax, 0)))
        const discount = roundMoney(Math.max(0, toNumber(data?.pricing?.discount, 0)))
        const total = roundMoney(Math.max(0, subtotal + shipping + tax - discount))

        data.items = normalizedItems
        data.currency = data.currency || 'KES'
        data.pricing = {
          subtotal,
          shipping,
          tax,
          discount,
          total,
          currency: data.currency,
        }

        if (operation === 'create' && !data.orderNumber) {
          data.orderNumber = generateOrderNumber()
        }

        if (!data.placedAt) {
          data.placedAt = new Date().toISOString()
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req, operation, context }) => {
        if (operation !== 'update') return doc
        if (context?.skipInventoryAdjustment) return doc
        if (previousDoc?.paymentStatus === 'paid' || doc?.paymentStatus !== 'paid') return doc
        if (!Array.isArray(doc.items)) return doc

        for (const item of doc.items) {
          await adjustItemStock(
            item as Record<string, unknown>,
            req,
            (context ?? {}) as Record<string, unknown>,
          )
        }

        return doc
      },
    ],
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      index: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'KES',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      defaultValue: 'mpesa',
      options: [{ label: 'M-Pesa', value: 'mpesa' }],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      index: true,
    },
    {
      name: 'fulfillmentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      index: true,
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'sku',
          type: 'text',
        },
        {
          name: 'quantity',
          type: 'number',
          min: 1,
          required: true,
        },
        {
          name: 'unitPrice',
          type: 'number',
          min: 0,
          required: true,
        },
        {
          name: 'lineTotal',
          type: 'number',
          min: 0,
          required: true,
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      fields: [
        { name: 'subtotal', type: 'number', min: 0, required: true },
        { name: 'shipping', type: 'number', min: 0, defaultValue: 0, required: true },
        { name: 'tax', type: 'number', min: 0, defaultValue: 0, required: true },
        { name: 'discount', type: 'number', min: 0, defaultValue: 0, required: true },
        { name: 'total', type: 'number', min: 0, required: true },
        { name: 'currency', type: 'text', defaultValue: 'KES', required: true },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'addressLine1', type: 'text', required: true },
        { name: 'addressLine2', type: 'text' },
        { name: 'city', type: 'text', required: true },
        { name: 'county', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'Kenya', required: true },
      ],
    },
    {
      name: 'mpesa',
      type: 'group',
      fields: [
        { name: 'merchantRequestID', type: 'text', index: true },
        { name: 'checkoutRequestID', type: 'text', index: true },
        { name: 'resultCode', type: 'number' },
        { name: 'resultDesc', type: 'text' },
        { name: 'receiptNumber', type: 'text', index: true },
        { name: 'transactionDate', type: 'text' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'placedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'paidAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
