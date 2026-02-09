'use client'

import Link from 'next/link'
import {
  HiOutlineHeart,
  HiOutlineTrash,
  HiOutlineShoppingBag,
  HiShoppingBag,
} from 'react-icons/hi2'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useStore } from '@/stores/store'
import { formatKES } from '@/lib/utils'

export function WishlistSheet() {
  const { wishlist, toggleWishlist, addToCart, clearWishlist, isInCart } = useStore()
  const wishlistCount = wishlist.length

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Wishlist"
          className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center border-2 border-gray-300 bg-white text-black transition-colors hover:bg-accent"
          type="button"
        >
          <HiOutlineHeart className="size-6" />
          <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full border border-gray-300 bg-secondary px-1 text-[10px] font-semibold text-black">
            {wishlistCount}
          </span>
        </button>
      </SheetTrigger>

      <SheetContent className="flex min-w-[95vw] flex-col md:min-w-[40vw]" side="right">
        <SheetHeader className="border-b-2 border-gray-300">
          <SheetTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
            <HiOutlineHeart className="size-5 text-rose-500" />
            Wishlist ({wishlistCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {wishlist.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3">
              <HiOutlineHeart className="size-12 text-black/15" />
              <p className="text-sm text-black/50">Your wishlist is empty</p>
              <SheetClose asChild>
                <Link
                  className="inline-flex h-9 cursor-pointer items-center justify-center bg-primary px-4 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90"
                  href="/"
                >
                  Discover Products
                </Link>
              </SheetClose>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {wishlist.map((item) => {
                const activePrice = item.salePrice ?? item.price
                const hasSale = item.salePrice !== null && item.salePrice < item.price

                return (
                  <li key={item.productId} className="flex items-center gap-3 py-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center border border-gray-300 bg-accent">
                      {item.imageUrl ? (
                        <img
                          alt={item.title}
                          className="h-full w-full object-contain"
                          src={item.imageUrl}
                        />
                      ) : (
                        <HiOutlineHeart className="size-6 text-black/20" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-xs font-semibold text-black">{item.title}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{formatKES(activePrice)}</span>
                        {hasSale ? (
                          <span className="text-[10px] text-black/40 line-through">
                            {formatKES(item.price)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    {isInCart(item.productId) ? (
                      <span
                        aria-label="Already in cart"
                        className="inline-flex size-8 items-center justify-center text-green-600"
                        title="In Cart"
                      >
                        <HiShoppingBag className="size-4" />
                      </span>
                    ) : (
                      <button
                        aria-label="Move to cart"
                        className="inline-flex size-8 cursor-pointer items-center justify-center text-primary hover:text-primary/70"
                        onClick={() =>
                          addToCart({
                            id: item.productId,
                            title: item.title,
                            imageUrl: item.imageUrl,
                            price: item.price,
                            salePrice: item.salePrice,
                          })
                        }
                        type="button"
                      >
                        <HiOutlineShoppingBag className="size-4" />
                      </button>
                    )}
                    <button
                      aria-label="Remove from wishlist"
                      className="inline-flex size-8 cursor-pointer items-center justify-center text-rose-500 hover:text-rose-700"
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
                      <HiOutlineTrash className="size-4" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {wishlist.length > 0 ? (
          <div className="border-t-2 border-gray-300 p-4">
            <button
              className="w-full cursor-pointer py-2 text-center text-xs font-medium text-rose-500 hover:text-rose-700"
              onClick={clearWishlist}
              type="button"
            >
              Clear All Items
            </button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
