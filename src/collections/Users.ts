import type { CollectionConfig } from 'payload'
import { render } from '@react-email/render'
import { VerifyEmail } from '@/emails/VerifyEmail'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  access: {
    admin: ({ req: { user } }) => {
      if (!user) return false
      return user.roles?.includes('admin') || user.roles?.includes('editor') || false
    },
  },
  auth: {
    verify: {
      generateEmailHTML: ({ token, user, req }) => {
        const serverUrl = req.payload.config.serverURL || 'http://localhost:3000'
        return render(VerifyEmail({ serverUrl, token, userEmail: user.email }))
      },
      generateEmailSubject: () => 'Verify your email – Galactic Solar & Electricals',
    },
  },
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'user'],
      defaultValue: ['user'],
      required: true,
      saveToJWT: true,
      access: {
        update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
      },
    },
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
      required: true,
      index: true,
    },
    {
      name: 'shippingAddress',
      type: 'group',
      label: 'Shipping Address',
      fields: [
        { name: 'addressLine1', type: 'text', label: 'Address Line 1' },
        { name: 'addressLine2', type: 'text', label: 'Address Line 2' },
        { name: 'city', type: 'text', label: 'City' },
        { name: 'county', type: 'text', label: 'County / State' },
        { name: 'postalCode', type: 'text', label: 'Postal Code' },
        { name: 'country', type: 'text', label: 'Country', defaultValue: 'Kenya' },
      ],
    },
    {
      name: 'cart',
      type: 'json',
      defaultValue: [],
      admin: { hidden: true },
    },
    {
      name: 'wishlist',
      type: 'json',
      defaultValue: [],
      admin: { hidden: true },
    },
  ],
}
