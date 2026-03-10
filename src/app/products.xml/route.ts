import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { siteConfig } from '@/lib/site-config'
import type { Product, Media, ProductCategory } from '@/payload-types'

export const revalidate = 3600

const BRAND = siteConfig.shortName

export async function GET(): Promise<NextResponse> {
  const payload = await getPayload({ config })

  const productsResult = await payload.find({
    collection: 'products',
    where: { _status: { equals: 'published' } },
    limit: 10000,
    depth: 2,
  })

  const items = productsResult.docs
    .map(normalizeProduct)
    .filter((item): item is NonNullable<typeof item> => item !== undefined)

  const generatedAt = new Date().toUTCString()

  const xmlItems = items
    .map((item) => {
      const lines = [
        '    <item>',
        `      <g:id>${escapeXml(item.id)}</g:id>`,
        `      <title>${escapeXml(item.title)}</title>`,
        `      <description>${escapeXml(item.description)}</description>`,
        `      <link>${escapeXml(item.link)}</link>`,
        `      <g:image_link>${escapeXml(item.imageLink)}</g:image_link>`,
        `      <g:availability>${escapeXml(item.availability)}</g:availability>`,
        `      <g:price>${escapeXml(item.price)}</g:price>`,
        `      <g:condition>new</g:condition>`,
        `      <g:brand>${escapeXml(BRAND)}</g:brand>`,
      ]

      if (item.salePrice) {
        lines.push(`      <g:sale_price>${escapeXml(item.salePrice)}</g:sale_price>`)
      }
      if (item.sku) {
        lines.push(`      <g:mpn>${escapeXml(item.sku)}</g:mpn>`)
      }
      if (item.productType) {
        lines.push(`      <g:product_type>${escapeXml(item.productType)}</g:product_type>`)
      }
      if (item.googleProductCategory) {
        lines.push(
          `      <g:google_product_category>${escapeXml(item.googleProductCategory)}</g:google_product_category>`,
        )
      }

      lines.push('    </item>')
      return lines.join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    '  <channel>',
    `    <title>${escapeXml(siteConfig.name)} Products</title>`,
    `    <link>${escapeXml(siteConfig.url)}</link>`,
    `    <description>Google Merchant product feed — generated ${escapeXml(generatedAt)}</description>`,
    xmlItems || '    <!-- No active products -->',
    '  </channel>',
    '</rss>',
  ].join('\n')

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
    },
  })
}

function normalizeProduct(doc: Product) {
  if (!doc.slug || !doc.title) return undefined

  const imageUrl = resolveMediaUrl(doc.featuredImage)
  if (!imageUrl) return undefined

  const price = typeof doc.regularPrice === 'number' ? doc.regularPrice : 0
  if (price <= 0) return undefined

  const salePrice =
    typeof doc.salePrice === 'number' && doc.salePrice > 0 && doc.salePrice < price
      ? doc.salePrice
      : undefined

  const description = extractPlainText(doc.shortDescription) || doc.title

  return {
    id: String(doc.id),
    title: doc.title,
    description,
    link: `${siteConfig.url}/products/${doc.slug}`,
    imageLink: imageUrl,
    availability: mapAvailability(doc.stockStatus),
    price: `${price.toFixed(2)} ${siteConfig.currency}`,
    salePrice: salePrice ? `${salePrice.toFixed(2)} ${siteConfig.currency}` : undefined,
    sku: doc.sku || undefined,
    productType: buildProductType(doc.categories),
    googleProductCategory: 'Hardware > Electrical',
  }
}

function resolveMediaUrl(media: Product['featuredImage']): string | undefined {
  if (!media || typeof media === 'string') return undefined
  const doc = media as Media & { _key?: string }
  if (doc._key) return `https://utfs.io/f/${doc._key}`
  if (doc.url) {
    return doc.url.startsWith('http') ? doc.url : `${siteConfig.url}${doc.url}`
  }
  return undefined
}

function mapAvailability(status: Product['stockStatus']): string {
  if (status === 'outofstock') return 'out of stock'
  if (status === 'onbackorder') return 'preorder'
  return 'in stock'
}

function buildProductType(categories: Product['categories']): string | undefined {
  if (!Array.isArray(categories) || categories.length === 0) return undefined
  const names: string[] = []
  for (const cat of categories) {
    if (typeof cat === 'object' && cat !== null && 'name' in cat) {
      names.push((cat as ProductCategory).name)
    }
  }
  return names.length > 0 ? names.join(' > ') : undefined
}

function extractPlainText(richText: unknown): string {
  if (!richText || typeof richText !== 'object') return ''
  const root = (richText as { root?: { children?: unknown[] } }).root
  if (!root || !Array.isArray(root.children)) return ''

  const segments: string[] = []
  for (const node of root.children) {
    if (!node || typeof node !== 'object') continue
    const children = (node as { children?: unknown[] }).children
    if (!Array.isArray(children)) continue
    for (const child of children) {
      if (child && typeof (child as { text?: string }).text === 'string') {
        segments.push((child as { text: string }).text)
      }
    }
  }
  return segments.join(' ').trim().slice(0, 5000)
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
