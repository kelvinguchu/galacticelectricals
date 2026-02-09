'use client'

import Link from 'next/link'

import { ProductActionBar } from '@/components/home/ProductActionBar'
import { formatKES } from '@/lib/utils'
import type { StorefrontProductCard } from '@/lib/get-storefront-home-data'

type Props = {
  readonly product: StorefrontProductCard
}

export function HeroProductCard({ product }: Props) {
  const activePrice = product.salePrice ?? product.regularPrice

  return (
    <div className="group flex flex-col border-r-2 border-gray-300 bg-white last:border-r-0">
      <div className="flex flex-1 flex-col p-2 md:p-3">
        <Link
          href={`/products/${product.slug}`}
          className="mb-1.5 flex h-16 items-center justify-center md:mb-2 md:h-20"
        >
          {product.imageUrl ? (
            <img
              alt={product.imageAlt}
              className="max-h-full w-auto object-contain"
              loading="lazy"
              src={product.imageUrl}
            />
          ) : null}
        </Link>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-1 text-xs font-semibold uppercase text-black hover:underline"
        >
          {product.title}
        </Link>
        <span className="mt-auto pt-1 text-sm font-semibold text-primary">
          {formatKES(activePrice)}
        </span>
      </div>
      <div className="border-t border-gray-200">
        <ProductActionBar product={product} />
      </div>
    </div>
  )
}
