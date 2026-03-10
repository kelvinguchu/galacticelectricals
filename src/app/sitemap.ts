import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { siteConfig } from '@/lib/site-config'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config })

  const [productsResult, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { _status: { equals: 'published' } },
      limit: 10000,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'product-categories',
      limit: 500,
      depth: 0,
      select: { slug: true, updatedAt: true },
    }),
  ])

  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteConfig.url}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/categories`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const productEntries: MetadataRoute.Sitemap = productsResult.docs
    .filter(
      (doc): doc is typeof doc & { slug: string } =>
        typeof doc.slug === 'string' && doc.slug.trim() !== '',
    )
    .map((doc) => ({
      url: `${siteConfig.url}/products/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const categoryEntries: MetadataRoute.Sitemap = categoriesResult.docs
    .filter(
      (doc): doc is typeof doc & { slug: string } =>
        typeof doc.slug === 'string' && doc.slug.trim() !== '',
    )
    .map((doc) => ({
      url: `${siteConfig.url}/categories/${doc.slug}`,
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

  return [...staticEntries, ...productEntries, ...categoryEntries]
}
