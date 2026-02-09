import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { HiOutlineArrowLeft } from 'react-icons/hi2'

import { ProductCard } from '@/components/home/ProductCard'
import { ProductFilters } from '@/components/home/ProductFilters'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { getCategoryBySlug, searchProducts } from '@/lib/get-storefront-home-data'

type Props = {
  readonly params: Promise<{ slug: string }>
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

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Category Not Found' }
  return {
    title: `${category.name} – Galactic Solar & Electricals`,
    description: `Shop ${category.name} products.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const sp = await searchParams
  const page = Math.max(1, Number.parseInt(sp.page || '1', 10) || 1)

  const category = await getCategoryBySlug(slug)

  if (!category) notFound()

  const data = await searchProducts({
    page,
    q: sp.q,
    categories: [category.id],
    stockStatus: sp.stockStatus,
    productType: sp.productType,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    sort: sp.sort,
  })

  const buildHref = (p: number) => {
    const params = new URLSearchParams()
    if (p > 1) params.set('page', p.toString())
    if (sp.q) params.set('q', sp.q)
    if (sp.stockStatus) params.set('stockStatus', sp.stockStatus)
    if (sp.productType) params.set('productType', sp.productType)
    if (sp.minPrice) params.set('minPrice', sp.minPrice)
    if (sp.maxPrice) params.set('maxPrice', sp.maxPrice)
    if (sp.sort) params.set('sort', sp.sort)
    const qs = params.toString()
    const base = `/categories/${slug}`
    return qs ? `${base}?${qs}` : base
  }

  return (
    <section className="py-4 md:py-6">
      <Suspense>
        <ProductFilters categories={[]} fixedCategoryId={category.id}>
          <div className="px-3 md:px-6">
            <div className="mb-4 flex items-center gap-2 md:mb-6 md:gap-3">
              <Button
                asChild
                className="shrink-0 rounded-none border-gray-300"
                size="sm"
                variant="outline"
              >
                <Link href="/categories">
                  <HiOutlineArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Categories</span>
                </Link>
              </Button>
              <SectionHeading className="min-w-0">
                <span className="truncate">{category.name}</span>
              </SectionHeading>
              <span className="shrink-0 whitespace-nowrap text-sm text-black/50">
                ({data.totalDocs})
              </span>
            </div>

            {data.docs.length === 0 ? (
              <div className="flex min-h-[30vh] items-center justify-center">
                <p className="text-sm text-black/50">No products in this category yet.</p>
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
