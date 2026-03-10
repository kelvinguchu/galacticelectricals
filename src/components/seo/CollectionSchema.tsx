import { siteConfig } from '@/lib/site-config'
import { JsonLd } from './JsonLd'
import type { StorefrontProductCard } from '@/lib/get-storefront-home-data'

type Props = {
  readonly name: string
  readonly slug: string
  readonly description?: string
  readonly products: StorefrontProductCard[]
}

export function CollectionSchema({ name, slug, description, products }: Props) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        url: `${siteConfig.url}/categories/${slug}`,
        description: description || `Shop ${name} products`,
        numberOfItems: products.length,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: products.length,
          itemListElement: products.slice(0, 20).map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `${siteConfig.url}/products/${product.slug}`,
            name: product.title,
          })),
        },
      }}
    />
  )
}
