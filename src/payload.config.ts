import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { resendAdapter } from '@payloadcms/email-resend'
import { uploadthingStorage } from '@payloadcms/storage-uploadthing'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { ProductCategories } from './collections/ProductCategories'
import { ProductTags } from './collections/ProductTags'
import { Orders } from './collections/Orders'
import { Payments } from './collections/Payments'
import { MpesaWebhookEvents } from './collections/MpesaWebhookEvents'
import { createOrderEndpoint } from './endpoints/create-order'
import { getOrderByNumberEndpoint } from './endpoints/get-order'
import {
  mpesaC2BConfirmEndpoint,
  mpesaC2BRegisterEndpoint,
  mpesaC2BValidateEndpoint,
} from './endpoints/mpesa-c2b'
import { mpesaSTKCallbackEndpoint } from './endpoints/mpesa-stk-callback'
import {
  mpesaTransactionStatusQueryEndpoint,
  mpesaTransactionStatusResultEndpoint,
  mpesaTransactionStatusTimeoutEndpoint,
} from './endpoints/mpesa-transaction-status'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: 'Galactic Solar & Electricals Admin',
      titleSuffix: ' | Galactic Solar & Electricals',
      description: 'Solar electrical solutions for everyday life.',
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        },
      ],
      openGraph: {
        title: 'Galactic Solar & Electricals Admin',
        description: 'Solar electrical solutions for everyday life.',
        siteName: 'Galactic Solar & Electricals',
        images: [
          {
            url: '/logo.png',
            width: 1200,
            height: 630,
          },
        ],
      },
    },
    components: {
      graphics: {
        Logo: '/components/admin/Logo',
        Icon: '/components/admin/Icon',
      },
    },
  },
  collections: [
    Users,
    Media,
    Products,
    ProductCategories,
    ProductTags,
    Orders,
    Payments,
    MpesaWebhookEvents,
  ],
  endpoints: [
    createOrderEndpoint,
    getOrderByNumberEndpoint,
    mpesaSTKCallbackEndpoint,
    mpesaC2BValidateEndpoint,
    mpesaC2BConfirmEndpoint,
    mpesaC2BRegisterEndpoint,
    mpesaTransactionStatusQueryEndpoint,
    mpesaTransactionStatusResultEndpoint,
    mpesaTransactionStatusTimeoutEndpoint,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  email: resendAdapter({
    defaultFromAddress: process.env.FROM_EMAIL || 'noreply@example.com',
    defaultFromName: process.env.FROM_NAME || 'Galactic Solar & Electricals',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  sharp,
  plugins: [
    uploadthingStorage({
      collections: {
        media: true,
      },
      options: {
        token: process.env.UPLOADTHING_TOKEN,
        acl: 'public-read',
      },
    }),
  ],
})
