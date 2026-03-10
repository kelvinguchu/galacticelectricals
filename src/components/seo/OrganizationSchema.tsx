import { siteConfig } from '@/lib/site-config'
import { JsonLd } from './JsonLd'

export function OrganizationSchema() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'ElectricalStore',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        image: `${siteConfig.url}${siteConfig.ogImage}`,
        description: siteConfig.description,
        telephone: siteConfig.phone,
        email: siteConfig.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: siteConfig.address.street,
          addressLocality: siteConfig.address.city,
          addressRegion: siteConfig.address.region,
          postalCode: siteConfig.address.postalCode,
          addressCountry: siteConfig.address.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: -1.2841,
          longitude: 36.8155,
        },
        sameAs: [siteConfig.social.facebook, siteConfig.social.instagram, siteConfig.social.tiktok],
        priceRange: '$$',
        currenciesAccepted: siteConfig.currency,
        paymentAccepted: 'M-Pesa',
      }}
    />
  )
}
