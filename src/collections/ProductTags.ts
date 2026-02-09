import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { revalidateStorefrontCache } from '@/hooks/revalidate-storefront'
import { CACHE_TAG_TAGS } from '@/lib/cache-tags'

const { afterChange, afterDelete } = revalidateStorefrontCache([CACHE_TAG_TAGS])

export const ProductTags: CollectionConfig = {
  slug: 'product-tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'createdAt'],
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
    slugField({ useAsSlug: 'name' }),
  ],
}
