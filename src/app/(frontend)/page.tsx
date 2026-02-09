import React from 'react'
import { CategoryStrip } from '@/components/home/CategoryStrip'
import { Hero } from '@/components/home/Hero'
import { ProductShelf } from '@/components/home/ProductShelf'
import { TrustBand } from '@/components/home/TrustBand'
import { getStorefrontHomeData } from '@/lib/get-storefront-home-data'

export default async function HomePage() {
  const data = await getStorefrontHomeData()

  return (
    <>
      <Hero
        products={data.featuredProducts.length > 0 ? data.featuredProducts : data.newArrivals}
      />
      <CategoryStrip categories={data.categories} />
      <ProductShelf id="shop" products={data.featuredProducts} title="Featured" />
      <ProductShelf
        id="deals"
        products={data.dealProducts}
        showDealBadges
        title="Deals Right Now"
        viewAllHref="/categories/deal-of-the-day"
      />
      <ProductShelf id="new" products={data.newArrivals} title="New Arrivals" />
      <TrustBand />
    </>
  )
}
