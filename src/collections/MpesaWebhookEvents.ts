import type { CollectionConfig } from 'payload'

const isAdmin = (roles?: (string | null)[] | null) => roles?.includes('admin') || false

export const MpesaWebhookEvents: CollectionConfig = {
  slug: 'mpesa-webhook-events',
  admin: {
    useAsTitle: 'eventHash',
    defaultColumns: ['channel', 'eventHash', 'processed', 'createdAt'],
    group: 'Shop',
    hidden: true,
  },
  access: {
    create: ({ req: { user } }) => isAdmin(user?.roles),
    update: ({ req: { user } }) => isAdmin(user?.roles),
    delete: ({ req: { user } }) => isAdmin(user?.roles),
    read: ({ req: { user } }) => isAdmin(user?.roles),
  },
  fields: [
    {
      name: 'channel',
      type: 'select',
      required: true,
      options: [
        { label: 'STK Callback', value: 'stk_callback' },
        { label: 'C2B Validate', value: 'c2b_validate' },
        { label: 'C2B Confirm', value: 'c2b_confirm' },
        { label: 'Transaction Status Result', value: 'transaction_status_result' },
        { label: 'Transaction Status Timeout', value: 'transaction_status_timeout' },
      ],
      index: true,
    },
    {
      name: 'eventHash',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'processed',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },
    {
      name: 'payload',
      type: 'json',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
