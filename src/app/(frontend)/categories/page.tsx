import { HiOutlineArrowLeft } from 'react-icons/hi2'
import Link from 'next/link'

import { CategoryCard } from '@/components/home/CategoryCard'
import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import { getAllCategories } from '@/lib/get-storefront-home-data'

export const metadata = {
  title: 'Categories – Galactic Solar & Electricals',
  description: 'Browse all product categories for solar panels, inverters, batteries and more.',
}

export default async function CategoriesPage() {
  const categories = await getAllCategories()

  return (
    <section className="py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 md:mb-6 md:gap-3">
          <Button
            asChild
            className="shrink-0 rounded-none border-gray-300"
            size="sm"
            variant="outline"
          >
            <Link href="/">
              <HiOutlineArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <SectionHeading>All Categories</SectionHeading>
        </div>

        {categories.length === 0 ? (
          <div className="flex min-h-[30vh] items-center justify-center">
            <p className="text-sm text-black/50">No categories found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 md:gap-3 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard category={category} key={category.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
