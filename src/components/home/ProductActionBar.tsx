'use client'

import { useEffect, useState } from 'react'
import {
  HiOutlineEye,
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiHeart,
  HiShoppingBag,
  HiEye,
} from 'react-icons/hi2'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useStore } from '@/stores/store'
import { ProductDetails } from '@/components/home/ProductDetails'
import type { StorefrontProductCard } from '@/lib/get-storefront-home-data'
import { toast } from 'sonner'

type ProductActionBarProps = {
  readonly product: StorefrontProductCard
}

export function ProductActionBar({ product }: ProductActionBarProps) {
  const { addToCart, toggleWishlist, isInWishlist, isInCart } = useStore()
  const [adding, setAdding] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isOut = product.stockStatus === 'outofstock'
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

  const cartTooltip = isZeroPrice ? 'Contact for Price' : 'Add to Cart'
  const cartTooltipLabel = isOut ? 'Out of Stock' : cartTooltip

  const handleAddToCart = () => {
    if (isZeroPrice) {
      toast.warning('Price unavailable', {
        description: 'Please contact us for the actual price before ordering.',
      })
      return
    }
    setAdding(true)
    addToCart(productInfo)
    setTimeout(() => setAdding(false), 200)
  }

  const handleToggleWishlist = () => {
    setToggling(true)
    toggleWishlist(productInfo)
    setTimeout(() => setToggling(false), 200)
  }

  return (
    <>
      <TooltipProvider delayDuration={300}>
        <div className="grid w-full grid-cols-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Add to Wishlist"
                className={`inline-flex h-8 cursor-pointer items-center justify-center border-r border-rose-200 transition-colors ${
                  wishlisted
                    ? 'bg-rose-500 text-white'
                    : 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white'
                }`}
                disabled={toggling}
                onClick={handleToggleWishlist}
                type="button"
              >
                {wishlisted ? (
                  <HiHeart className="size-4" />
                ) : (
                  <HiOutlineHeart className="size-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{wishlisted ? 'Remove from Wishlist' : 'Wishlist'}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="View Details"
                className={`inline-flex h-8 cursor-pointer items-center justify-center border-r border-amber-200 transition-colors ${
                  detailsOpen
                    ? 'bg-secondary text-black'
                    : 'bg-amber-50 text-amber-600 hover:bg-secondary hover:text-black'
                }`}
                onClick={() => setDetailsOpen(true)}
                type="button"
              >
                {detailsOpen ? <HiEye className="size-4" /> : <HiOutlineEye className="size-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent>Details</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label="Add to Cart"
                className={`inline-flex h-8 cursor-pointer items-center justify-center transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  inCart && !adding
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-primary text-white hover:bg-primary/80'
                }`}
                disabled={isOut || isZeroPrice || adding}
                onClick={handleAddToCart}
                type="button"
              >
                {inCart ? (
                  <HiShoppingBag className="size-4" />
                ) : (
                  <HiOutlineShoppingBag className="size-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{cartTooltipLabel}</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      <ProductDetails open={detailsOpen} onOpenChange={setDetailsOpen} product={product} />
    </>
  )
}
