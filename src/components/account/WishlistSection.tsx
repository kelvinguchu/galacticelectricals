'use client'

import Link from 'next/link'
import { HiOutlineHeart } from 'react-icons/hi2'

import { useStore } from '@/stores/store'
import { formatKES } from '@/lib/utils'

export function WishlistSection() {
  const { wishlist, toggleWishlist } = useStore()

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <HiOutlineHeart className="size-12 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
        <Link
          className="inline-flex h-9 items-center justify-center bg-primary px-5 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:opacity-90"
          href="/"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {wishlist.map((item) => {
        const activePrice = item.salePrice ?? item.price
        return (
          <div
            key={item.productId}
            className="flex items-center gap-2.5 border-2 border-gray-300 bg-white p-2.5 sm:gap-3 sm:p-3"
          >
            <div className="flex size-11 shrink-0 items-center justify-center border border-gray-200 bg-accent sm:size-12">
              {item.imageUrl ? (
                <img alt={item.title} className="size-full object-contain" src={item.imageUrl} />
              ) : (
                <HiOutlineHeart className="size-5 text-muted-foreground/30" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-1 text-xs font-semibold text-foreground">{item.title}</p>
              <p className="text-[11px] text-muted-foreground">{formatKES(activePrice)}</p>
            </div>
            <button
              className="cursor-pointer text-xs text-rose-500 hover:text-rose-700"
              onClick={() =>
                toggleWishlist({
                  id: item.productId,
                  title: item.title,
                  imageUrl: item.imageUrl,
                  price: item.price,
                  salePrice: item.salePrice,
                })
              }
              type="button"
            >
              Remove
            </button>
          </div>
        )
      })}
    </div>
  )
}
