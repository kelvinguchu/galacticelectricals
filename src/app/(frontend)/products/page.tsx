import Link from 'next/link'
import { Suspense } from 'react'
import { HiOutlineHome } from 'react-icons/hi2'

import { ProductCard } from '@/components/home/ProductCard'
import { ProductFilters } from '@/components/home/ProductFilters'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { searchProducts, getAllCategories } from '@/lib/get-storefront-home-data'

export const metadata = {
  title: 'All Products – Galactic Solar & Electricals',
  description: 'Browse our full catalog of solar panels, inverters, batteries & electrical gear.',
}

type Props = {
  readonly searchParams: Promise<{
    page?: string
    q?: string
    categories?: string
    stockStatus?: string
    productType?: string
    minPrice?: string
    maxPrice?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = Math.max(1, Number.parseInt(sp.page || '1', 10) || 1)

  const [data, allCategories] = await Promise.all([
    searchProducts({
      page,
      q: sp.q,
      categories: sp.categories?.split(',').filter(Boolean),
      stockStatus: sp.stockStatus,
      productType: sp.productType,
      minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
      maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
      sort: sp.sort,
    }),
    getAllCategories(),
  ])

  const filterCategories = allCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
  }))

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (p > 1) params.set('page', p.toString())
    if (sp.q) params.set('q', sp.q)
    if (sp.categories) params.set('categories', sp.categories)
    if (sp.stockStatus) params.set('stockStatus', sp.stockStatus)
    if (sp.productType) params.set('productType', sp.productType)
    if (sp.minPrice) params.set('minPrice', sp.minPrice)
    if (sp.maxPrice) params.set('maxPrice', sp.maxPrice)
    if (sp.sort) params.set('sort', sp.sort)
    const qs = params.toString()
    const base = '/products'
    return qs ? `${base}?${qs}` : base
  }

  return (
    <section className="py-4 md:py-6">
      <Suspense>
        <ProductFilters categories={filterCategories}>
          <div className="px-3 md:px-6">
            <div className="mb-4 flex items-center gap-2 md:mb-6 md:gap-3">
              <Button
                asChild
                className="shrink-0 rounded-none border-gray-300"
                size="sm"
                variant="outline"
              >
                <Link href="/">
                  <HiOutlineHome className="h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Link>
              </Button>
              <SectionHeading>All Products</SectionHeading>
              <span className="text-sm text-black/50">
                ({data.totalDocs} {data.totalDocs === 1 ? 'product' : 'products'})
              </span>
            </div>

            {data.docs.length === 0 ? (
              <div className="flex min-h-[30vh] items-center justify-center">
                <p className="text-sm text-black/50">No products found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5 md:gap-3 md:grid-cols-3 xl:grid-cols-4">
                {data.docs.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {data.totalPages > 1 ? (
              <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-8">
                {data.hasPrevPage ? (
                  <Button
                    asChild
                    className="rounded-none border-gray-300"
                    size="sm"
                    variant="outline"
                  >
                    <Link href={buildHref(page - 1)}>Previous</Link>
                  </Button>
                ) : null}
                <span className="px-3 text-sm text-black/60">
                  Page {data.page} of {data.totalPages}
                </span>
                {data.hasNextPage ? (
                  <Button
                    asChild
                    className="rounded-none border-gray-300"
                    size="sm"
                    variant="outline"
                  >
                    <Link href={buildHref(page + 1)}>Next</Link>
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        </ProductFilters>
      </Suspense>
    </section>
  )
}
