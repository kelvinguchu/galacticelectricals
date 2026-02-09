'use client'

import Link from 'next/link'

import { ProductActionBar } from '@/components/home/ProductActionBar'
import { formatKES } from '@/lib/utils'
import type { StorefrontProductCard } from '@/lib/get-storefront-home-data'

type Props = {
  readonly product: StorefrontProductCard
}

export function HeroMainProduct({ product }: Props) {
  const activePrice = product.salePrice ?? product.regularPrice
  const hasSale = product.salePrice !== null && product.salePrice < product.regularPrice

  return (
    <div className="flex min-h-0 flex-1 flex-col border-2 border-gray-300 bg-white md:border-0 md:border-t-0">
      <Link
        href={`/products/${product.slug}`}
        className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-white p-4 sm:p-5 md:p-6"
      >
        <div className="flex h-full max-h-56 items-center justify-center md:max-h-72">
          {product.imageUrl ? (
            <img
              alt={product.imageAlt}
              className="max-h-full max-w-full object-contain"
              src={product.imageUrl}
            />
          ) : (
            <span className="text-sm text-black/40">{product.title}</span>
          )}
        </div>
      </Link>
      <div className="border-t-2 border-gray-300 bg-white px-4 py-3 md:px-5 md:py-3">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-semibold uppercase leading-tight hover:underline md:text-base"
        >
          {product.title}
        </Link>
        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-base font-semibold text-primary md:text-lg">
            {formatKES(activePrice)}
          </span>
          {hasSale ? (
            <span className="text-sm text-black/40 line-through">
              {formatKES(product.regularPrice)}
            </span>
          ) : null}
        </div>
      </div>
      <div className="border-t-2 border-gray-300">
        <ProductActionBar product={product} />
      </div>
    </div>
  )
}
