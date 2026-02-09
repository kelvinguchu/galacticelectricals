import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { revalidateStorefrontCache } from '@/hooks/revalidate-storefront'
import { CACHE_TAG_CATEGORIES } from '@/lib/cache-tags'

const { afterChange, afterDelete } = revalidateStorefrontCache([CACHE_TAG_CATEGORIES])

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'parent', 'createdAt'],
    group: 'Shop',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    update: ({ req: { user } }) => user?.roles?.includes('admin') || false,
    delete: ({ req: { user } }) => user?.roles?.includes('admin') || false,
  },
  hooks: {
    afterChange: [afterChange],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({
      useAsSlug: 'name',
      position: 'sidebar',
    }),
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'product-categories',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
