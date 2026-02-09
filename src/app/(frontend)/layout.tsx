import React from 'react'
import './styles.css'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { StoreHydration } from '@/components/providers/StoreHydration'
import { Toaster } from '@/components/ui/sonner'
import {
  getAllCategories,
  getDealDropdownProducts,
  getNewInDropdownProducts,
  getShopProducts,
} from '@/lib/get-storefront-home-data'

export const metadata = {
  description: 'Shop solar and electrical products with fast M-Pesa checkout in Kenya.',
  title: 'Galactic Solar & Electricals',
  icons: {
    icon: './favicon.png',
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
      <body>
        <StoreHydration />
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
      </body>
    </html>
  )
}
