'use client'

import Link from 'next/link'
import { HiOutlineTag } from 'react-icons/hi2'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { ProductActionBar } from '@/components/home/ProductActionBar'
import { formatKES } from '@/lib/utils'
import type { StorefrontProductCard } from '@/lib/get-storefront-home-data'

const stockLabel: Record<StorefrontProductCard['stockStatus'], string> = {
  instock: 'In Stock',
  onbackorder: 'Backorder',
  outofstock: 'Out of Stock',
}

type ProductCardProps = {
  readonly product: StorefrontProductCard
  readonly showDealBadge?: boolean
}

export function ProductCard({ product, showDealBadge = false }: ProductCardProps) {
  const activePrice = product.salePrice ?? product.regularPrice
  const hasSale = product.salePrice !== null && product.salePrice < product.regularPrice

  return (
    <Card className="h-full gap-0 rounded-none border-2 border-gray-300 py-0 shadow-none transition-transform duration-200 hover:-translate-y-0.5">
      <Link
        href={`/products/${product.slug}`}
        className="relative block h-32 border-b-2 border-gray-300 bg-accent"
      >
        {product.imageUrl ? (
          <img
            alt={product.imageAlt}
            className="h-full w-full object-contain"
            loading="lazy"
            src={product.imageUrl}
          />
        ) : (
          <img
            alt={product.title}
            className="mx-auto h-full w-16 object-contain opacity-15 grayscale"
            src="/logo.png"
          />
        )}
        {hasSale && showDealBadge ? (
          <Badge className="absolute left-2 top-2 rounded-none border-gray-300 bg-secondary px-2 py-0.5 text-[10px] font-semibold text-black uppercase tracking-widest">
            <HiOutlineTag className="h-3.5 w-3.5" />
            Deal
          </Badge>
        ) : null}
      </Link>

      <CardContent className="flex flex-1 flex-col gap-1.5 p-2">
        <p className="text-[10px] font-medium uppercase tracking-widest text-black/65">
          {product.categoryNames[0] || 'Electrical'}
        </p>
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-2 min-h-8 text-sm font-semibold leading-tight hover:underline"
        >
          {product.title}
        </Link>

        <div className="flex items-end gap-1.5">
          <p className="text-base font-semibold">{formatKES(activePrice)}</p>
          {hasSale ? (
            <p className="text-xs font-medium text-black/50 line-through">
              {formatKES(product.regularPrice)}
            </p>
          ) : null}
        </div>

        <p className="text-[10px] font-medium uppercase tracking-widest text-black/70">
          {stockLabel[product.stockStatus]}
        </p>
      </CardContent>

      <CardFooter className="mt-auto border-t-2 border-gray-300 p-0">
        <ProductActionBar product={product} />
      </CardFooter>
    </Card>
  )
}
