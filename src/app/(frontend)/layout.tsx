import React from 'react'
import type { Metadata } from 'next'
import './styles.css'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { ScrollToTop } from '@/components/providers/ScrollToTop'
import { StoreHydration } from '@/components/providers/StoreHydration'
import { Toaster } from '@/components/ui/sonner'
import { OrganizationSchema } from '@/components/seo/OrganizationSchema'
import {
  getAllCategories,
  getDealDropdownProducts,
  getNewInDropdownProducts,
  getShopProducts,
} from '@/lib/get-storefront-home-data'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: { icon: '/favicon.png' },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
}

export default async function RootLayout(props: Readonly<{ children: React.ReactNode }>) {
  const { children } = props
  const [categories, shopProducts, dealProducts, newInProducts] = await Promise.all([
    getAllCategories(),
    getShopProducts(),
    getDealDropdownProducts(),
    getNewInDropdownProducts(),
  ])

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://utfs.io" />
        <link rel="dns-prefetch" href="https://utfs.io" />
      </head>
      <body>
        <StoreHydration />
        <ScrollToTop />
        <div className="min-h-screen bg-background text-foreground">
          <Header
            categories={categories}
            dealProducts={dealProducts}
            newInProducts={newInProducts}
            shopProducts={shopProducts}
          />
          <main>{children}</main>
          <Footer />
          <div data-whatsapp-global>
            <WhatsAppButton />
          </div>
        </div>
        <Toaster position="top-center" richColors closeButton />
        <OrganizationSchema />
      </body>
    </html>
  )
}
