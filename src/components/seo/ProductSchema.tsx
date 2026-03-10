import { siteConfig } from '@/lib/site-config'
import { JsonLd } from './JsonLd'
import type { FullProduct } from '@/lib/get-storefront-home-data'

type Props = {
  readonly product: FullProduct
}

export function ProductSchema({ product }: Props) {
  const price = product.salePrice ?? product.regularPrice
  const availability = mapStockToSchemaUrl(product.stockStatus)

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        url: `${siteConfig.url}/products/${product.slug}`,
        image: product.imageUrl ? [product.imageUrl, ...(product.galleryUrls ?? [])] : undefined,
        description: product.shortDescriptionHtml
          ? product.shortDescriptionHtml.replaceAll(/<[^>]*>/g, '').slice(0, 5000)
          : undefined,
        sku: product.sku || undefined,
        brand: {
          '@type': 'Brand',
          name: siteConfig.shortName,
        },
        category: product.categoryNames?.join(', ') || undefined,
        offers: {
          '@type': 'Offer',
          url: `${siteConfig.url}/products/${product.slug}`,
          priceCurrency: siteConfig.currency,
          price: price?.toFixed(2),
          availability,
          seller: {
            '@type': 'Organization',
            name: siteConfig.name,
          },
        },
      }}
    />
  )
}

function mapStockToSchemaUrl(status?: string): string {
  switch (status) {
    case 'instock':
      return 'https://schema.org/InStock'
    case 'outofstock':
      return 'https://schema.org/OutOfStock'
    case 'onbackorder':
      return 'https://schema.org/BackOrder'
    default:
      return 'https://schema.org/InStock'
  }
}
