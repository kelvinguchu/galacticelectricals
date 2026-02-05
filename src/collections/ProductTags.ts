import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

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
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField({ useAsSlug: 'name' }),
  ],
}
