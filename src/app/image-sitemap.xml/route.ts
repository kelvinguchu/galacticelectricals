import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { siteConfig } from '@/lib/site-config'
import type { Product, Media } from '@/payload-types'

export const revalidate = 3600

export async function GET(): Promise<NextResponse> {
  const payload = await getPayload({ config })

  const products = await payload.find({
    collection: 'products',
    where: { _status: { equals: 'published' } },
    limit: 10000,
    depth: 1,
  })

  const urlEntries = products.docs
    .filter((p) => p.slug && p.featuredImage)
    .map((product) => {
      const productUrl = `${siteConfig.url}/products/${product.slug}`
      const images = collectImageUrls(product)

      if (images.length === 0) return ''

      const imageXml = images
        .map(
          (img) =>
            `    <image:image>
      <image:loc>${escapeXml(img.url)}</image:loc>
      <image:caption>${escapeXml(img.caption)}</image:caption>
      <image:title>${escapeXml(img.title)}</image:title>
    </image:image>`,
        )
        .join('\n')

      return `  <url>
    <loc>${escapeXml(productUrl)}</loc>
${imageXml}
  </url>`
    })
    .filter(Boolean)
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  })
}

function collectImageUrls(
  product: Product,
): Array<{ url: string; caption: string; title: string }> {
  const results: Array<{ url: string; caption: string; title: string }> = []
  const title = product.title ?? ''

  const featuredUrl = resolveMediaUrl(product.featuredImage)
  if (featuredUrl) {
    const alt =
      typeof product.featuredImage === 'object' && product.featuredImage !== null
        ? (product.featuredImage as Media).alt || title
        : title
    results.push({ url: featuredUrl, caption: alt, title })
  }

  if (Array.isArray(product.gallery)) {
    for (const item of product.gallery) {
      const galleryImage = item?.image
      const url = resolveMediaUrl(galleryImage)
      if (url) {
        const alt =
          typeof galleryImage === 'object' && galleryImage !== null
            ? (galleryImage as Media).alt || title
            : title
        results.push({ url, caption: alt, title })
      }
    }
  }

  return results
}

function resolveMediaUrl(media: string | Media | null | undefined): string | undefined {
  if (!media || typeof media === 'string') return undefined
  const doc = media

  if (doc._key) {
    return `https://utfs.io/f/${doc._key}`
  }
  if (doc.url) {
    return doc.url.startsWith('http') ? doc.url : `${siteConfig.url}${doc.url}`
  }
  return undefined
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
