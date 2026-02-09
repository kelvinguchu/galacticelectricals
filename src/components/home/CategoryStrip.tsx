import Link from 'next/link'
import { HiOutlineArrowRight } from 'react-icons/hi2'

import { CategoryCard } from '@/components/home/CategoryCard'
import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'
import type { StorefrontCategoryCard } from '@/lib/get-storefront-home-data'

type Props = {
  categories: StorefrontCategoryCard[]
}

export function CategoryStrip({ categories }: Readonly<Props>) {
  if (!categories.length) return null

  return (
    <section className="border-b-2 border-gray-300 bg-white py-6 md:py-7" id="categories">
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <SectionHeading>Shop by Category</SectionHeading>
          <Button
            asChild
            className="shrink-0 rounded-none border-gray-300 px-4 text-xs font-semibold uppercase"
            size="sm"
            variant="outline"
          >
            <Link href="/categories">
              View All
              <HiOutlineArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 md:gap-3 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
        </div>
      </div>
    </section>
  )
}
