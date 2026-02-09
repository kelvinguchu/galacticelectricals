import Link from 'next/link'
import { HiOutlineArrowRight } from 'react-icons/hi2'

import { ProductCard } from '@/components/home/ProductCard'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'
import type { StorefrontProductCard } from '@/lib/get-storefront-home-data'

type Props = {
  id: string
  title: string
  products: StorefrontProductCard[]
  showDealBadges?: boolean
  viewAllHref?: string
}

export function ProductShelf({
  id,
  title,
  products,
  showDealBadges = false,
  viewAllHref = '/products',
}: Readonly<Props>) {
  if (!products.length) return null

  return (
    <section className="border-b-2 border-gray-300 bg-background py-6 md:py-8" id={id}>
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <SectionHeading>{title}</SectionHeading>
          <Button
            asChild
            className="shrink-0 rounded-none border-gray-300 px-4 text-xs font-semibold uppercase"
            size="sm"
            variant="outline"
          >
            <Link href={viewAllHref}>
              View All
              <HiOutlineArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showDealBadge={showDealBadges} />
          ))}
        </div>
      </div>
    </section>
  )
}
