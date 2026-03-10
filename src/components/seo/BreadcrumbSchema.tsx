import { siteConfig } from '@/lib/site-config'
import { JsonLd } from './JsonLd'

type BreadcrumbItem = {
  name: string
  href: string
}

type Props = {
  readonly items: BreadcrumbItem[]
}

export function BreadcrumbSchema({ items }: Props) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${siteConfig.url}${item.href}`,
        })),
      }}
    />
  )
}
