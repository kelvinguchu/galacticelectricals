import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { revalidateStorefrontCache } from '@/hooks/revalidate-storefront'
import { CACHE_TAG_PRODUCTS } from '@/lib/cache-tags'

const { afterChange, afterDelete } = revalidateStorefrontCache([CACHE_TAG_PRODUCTS])

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'productType',
      'regularPrice',
      'stockStatus',
      'featured',
      'createdAt',
    ],
    group: 'Shop',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return { _status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') || false,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            slugField({ useAsSlug: 'title' }),
            {
              name: 'productType',
              type: 'select',
              required: true,
              defaultValue: 'simple',
              options: [
                { label: 'Simple', value: 'simple' },
                { label: 'Variable', value: 'variable' },
                { label: 'External / Affiliate', value: 'external' },
              ],
              index: true,
            },
            {
              name: 'description',
              type: 'richText',
            },
            {
              name: 'shortDescription',
              type: 'richText',
            },
          ],
        },
        {
          label: 'Pricing',
          fields: [
            {
              name: 'regularPrice',
              type: 'number',
              min: 0,
            },
            {
              name: 'salePrice',
              type: 'number',
              min: 0,
            },
            {
              name: 'sku',
              type: 'text',
              unique: true,
              index: true,
              admin: {
                description: 'Stock Keeping Unit identifier',
              },
            },
          ],
        },
        {
          label: 'Inventory',
          fields: [
            {
              name: 'manageStock',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'stockQuantity',
              type: 'number',
              min: 0,
              admin: {
                condition: (data) => data.manageStock === true,
              },
            },
            {
              name: 'stockStatus',
              type: 'select',
              defaultValue: 'instock',
              options: [
                { label: 'In Stock', value: 'instock' },
                { label: 'Out of Stock', value: 'outofstock' },
                { label: 'On Backorder', value: 'onbackorder' },
              ],
              index: true,
            },
          ],
        },
        {
          label: 'Images',
          fields: [
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'gallery',
              type: 'array',
              labels: { singular: 'Image', plural: 'Images' },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Attributes',
          fields: [
            {
              name: 'attributes',
              type: 'array',
              labels: { singular: 'Attribute', plural: 'Attributes' },
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'values',
                  type: 'text',
                  required: true,
                  admin: {
                    description: 'Pipe-separated values, e.g. "6A | 10A | 16A"',
                  },
                },
                {
                  name: 'isVariation',
                  type: 'checkbox',
                  defaultValue: false,
                  admin: {
                    description: 'Use this attribute for product variations',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'External',
          fields: [
            {
              name: 'externalUrl',
              type: 'text',
              admin: {
                condition: (data) => data.productType === 'external',
                description: 'URL for external/affiliate product',
              },
            },
            {
              name: 'buttonText',
              type: 'text',
              admin: {
                condition: (data) => data.productType === 'external',
                description: 'Custom buy button label',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
      index: true,
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'product-tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
