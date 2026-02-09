import type { CollectionConfig } from 'payload'

const isAdmin = (roles?: (string | null)[] | null) => roles?.includes('admin') || false

export const Payments: CollectionConfig = {
  slug: 'payments',
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['order', 'provider', 'channel', 'status', 'amount', 'createdAt'],
    group: 'Shop',
  },
  access: {
    create: ({ req: { user } }) => isAdmin(user?.roles),
    update: ({ req: { user } }) => isAdmin(user?.roles),
    delete: ({ req: { user } }) => isAdmin(user?.roles),
    read: ({ req: { user } }) => isAdmin(user?.roles),
  },
  fields: [
    {
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      index: true,
    },
    {
      name: 'checkoutData',
      type: 'json',
      admin: {
        description: 'Stores checkout context until order is created after payment confirmation',
      },
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      defaultValue: 'mpesa',
      options: [{ label: 'M-Pesa', value: 'mpesa' }],
      index: true,
    },
    {
      name: 'channel',
      type: 'select',
      required: true,
      defaultValue: 'stk_push',
      options: [
        { label: 'STK Push', value: 'stk_push' },
        { label: 'C2B', value: 'c2b' },
      ],
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'initiated',
      options: [
        { label: 'Initiated', value: 'initiated' },
        { label: 'Pending', value: 'pending' },
        { label: 'Success', value: 'success' },
        { label: 'Failed', value: 'failed' },
        { label: 'Rejected', value: 'rejected' },
      ],
      index: true,
    },
    {
      name: 'amount',
      type: 'number',
      min: 0,
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'KES',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'reference',
      type: 'text',
      index: true,
    },
    {
      name: 'checkoutRequestID',
      type: 'text',
      index: true,
    },
    {
      name: 'merchantRequestID',
      type: 'text',
      index: true,
    },
    {
      name: 'mpesaReceiptNumber',
      type: 'text',
      index: true,
    },
    {
      name: 'resultCode',
      type: 'number',
    },
    {
      name: 'resultDesc',
      type: 'text',
    },
    {
      name: 'requestPayload',
      type: 'json',
    },
    {
      name: 'callbackPayload',
      type: 'json',
    },
    {
      name: 'transactionStatus',
      type: 'group',
      fields: [
        {
          name: 'conversationID',
          type: 'text',
          index: true,
        },
        {
          name: 'originatorConversationID',
          type: 'text',
          index: true,
        },
        {
          name: 'resultCode',
          type: 'number',
        },
        {
          name: 'resultDesc',
          type: 'text',
        },
        {
          name: 'rawPayload',
          type: 'json',
        },
        {
          name: 'checkedAt',
          type: 'date',
        },
      ],
    },
  ],
}
