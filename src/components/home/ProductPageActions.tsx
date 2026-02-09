'use client'

import { useEffect, useState } from 'react'
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineShoppingBag,
  HiShoppingBag,
  HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2'

import { useStore } from '@/stores/store'
import type { FullProduct } from '@/lib/get-storefront-home-data'
import { toast } from 'sonner'

type Props = {
  readonly product: FullProduct
}

export function ProductPageActions({ product }: Props) {
  const { addToCart, toggleWishlist, isInWishlist, isInCart } = useStore()
  const [adding, setAdding] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isOut = product.stockStatus === 'outofstock'
  const isExternal = product.productType === 'external'
  const activePrice = product.salePrice ?? product.regularPrice
  const isZeroPrice = activePrice <= 0
  const wishlisted = mounted && isInWishlist(product.id)
  const inCart = mounted && isInCart(product.id)

  const productInfo = {
    id: product.id,
    title: product.title,
    imageUrl: product.imageUrl,
    price: product.regularPrice,
    salePrice: product.salePrice,
  }

  const handleAdd = () => {
    if (isZeroPrice) {
      toast.warning('Price unavailable', {
        description: 'Please contact us for the actual price before ordering.',
      })
      return
    }
    setAdding(true)
    addToCart(productInfo)
    setTimeout(() => setAdding(false), 300)
  }

  const cartLabel = inCart ? 'In Cart' : 'Add to Cart'
  const cartText = adding ? 'Added!' : cartLabel

  return (
    <div className="flex gap-2 md:gap-3">
      {isExternal && product.externalUrl ? (
        <a
          href={product.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 flex-1 items-center justify-center gap-2 bg-primary text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 md:h-12 md:text-sm"
        >
          <HiOutlineArrowTopRightOnSquare className="size-4 md:size-5" />
          {product.buttonText || 'Buy Now'}
        </a>
      ) : (
        <button
          className={`flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:h-12 md:text-sm ${
            inCart && !adding ? 'bg-green-600' : 'bg-primary'
          }`}
          disabled={isOut || isZeroPrice || adding}
          onClick={handleAdd}
          type="button"
        >
          {inCart ? (
            <HiShoppingBag className="size-4 md:size-5" />
          ) : (
            <HiOutlineShoppingBag className="size-4 md:size-5" />
          )}
          {cartText}
        </button>
      )}
      <button
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`flex h-11 w-12 cursor-pointer items-center justify-center border-2 transition-colors md:h-12 md:w-14 ${
          wishlisted
            ? 'border-rose-500 bg-rose-500 text-white'
            : 'border-gray-300 bg-white text-rose-500 hover:bg-rose-50'
        }`}
        onClick={() => toggleWishlist(productInfo)}
        type="button"
      >
        {wishlisted ? (
          <HiHeart className="size-5 md:size-6" />
        ) : (
          <HiOutlineHeart className="size-5 md:size-6" />
        )}
      </button>
    </div>
  )
}
