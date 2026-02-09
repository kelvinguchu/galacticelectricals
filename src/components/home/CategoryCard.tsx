import Link from 'next/link'
import { HiOutlineArrowRight } from 'react-icons/hi2'

import { Button } from '@/components/ui/button'
import type { StorefrontCategoryCard } from '@/lib/get-storefront-home-data'

type CategoryCardProps = {
  readonly category: StorefrontCategoryCard
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      className="group relative flex min-h-36 flex-col justify-end overflow-hidden border-2 border-gray-300 bg-neutral-100 md:min-h-44"
      href={`/categories/${category.slug}`}
    >
      {category.imageUrl ? (
        <img
          alt={category.imageAlt}
          className="absolute inset-0 h-full w-full object-contain"
          loading="lazy"
          src={category.imageUrl}
        />
      ) : (
        <img
          alt={category.name}
          className="absolute inset-0 m-auto h-20 w-20 object-contain opacity-20 grayscale"
          src="/logo.png"
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-black/5 via-black/20 to-black/65" />

      <div className="relative flex items-center justify-between gap-2 p-2.5 md:p-3">
        <h3 className="truncate text-sm font-semibold text-white md:text-lg">{category.name}</h3>
        <Button
          asChild
          className="shrink-0 rounded-none border-gray-300 bg-white text-xs font-semibold uppercase text-black hover:bg-accent md:px-3"
          size="sm"
          variant="outline"
        >
          <span>
            <span className="hidden md:inline">Explore</span>
            <HiOutlineArrowRight className="h-3.5 w-3.5" />
          </span>
        </Button>
      </div>
    </Link>
  )
}
