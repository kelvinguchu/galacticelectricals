'use client'

import Link from 'next/link'
import { HiOutlineShoppingBag, HiOutlineTrash, HiHeart } from 'react-icons/hi2'

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

export function CartSheet() {
  const { cart, clearCart, removeFromCart, updateCartQuantity, isInWishlist } = useStore()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const cartTotal = cart.reduce((sum, item) => {
    const price = item.salePrice ?? item.price
    return sum + price * item.quantity
  }, 0)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Cart"
          className="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center border-2 border-gray-300 bg-primary text-white transition-colors hover:opacity-90"
          type="button"
        >
          <HiOutlineShoppingBag className="size-6" />
          <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-4 min-w-4 items-center justify-center rounded-full border border-gray-300 bg-secondary px-1 text-[10px] font-semibold text-black">
            {cartCount}
          </span>
        </button>
      </SheetTrigger>

      <SheetContent className="flex min-w-[95vw] flex-col md:min-w-[40vw]" side="right">
        <SheetHeader className="border-b-2 border-gray-300">
          <SheetTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest">
            <HiOutlineShoppingBag className="size-5 text-primary" />
            Cart ({cartCount})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4">
          {cart.length === 0 ? (
            <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3">
              <HiOutlineShoppingBag className="size-12 text-black/15" />
              <p className="text-sm text-black/50">Your cart is empty</p>
              <SheetClose asChild>
                <Link
                  className="inline-flex h-9 cursor-pointer items-center justify-center bg-primary px-4 text-xs font-semibold uppercase tracking-widest text-white hover:opacity-90"
                  href="/"
                >
                  Start Shopping
                </Link>
              </SheetClose>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => {
                const itemPrice = item.salePrice ?? item.price
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
                        <HiOutlineShoppingBag className="size-6 text-black/20" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="line-clamp-1 text-xs font-semibold text-black">{item.title}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <span className="text-xs font-semibold">{formatKES(itemPrice)}</span>
                        {hasSale ? (
                          <span className="text-[10px] text-black/40 line-through">
                            {formatKES(item.price)}
                          </span>
                        ) : null}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <button
                          className="flex size-7 cursor-pointer items-center justify-center border border-gray-300 text-sm hover:bg-gray-50"
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                          type="button"
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          className="flex size-7 cursor-pointer items-center justify-center border border-gray-300 text-sm hover:bg-gray-50"
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {isInWishlist(item.productId) ? (
                      <span
                        aria-label="In wishlist"
                        className="inline-flex size-8 items-center justify-center text-rose-500"
                        title="In Wishlist"
                      >
                        <HiHeart className="size-4" />
                      </span>
                    ) : null}
                    <button
                      aria-label="Remove item"
                      className="inline-flex size-8 cursor-pointer items-center justify-center text-rose-500 hover:text-rose-700"
                      onClick={() => removeFromCart(item.productId)}
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

        {cart.length > 0 ? (
          <div className="border-t-2 border-gray-300 p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold uppercase tracking-widest">Total</span>
              <span className="text-base font-bold">{formatKES(cartTotal)}</span>
            </div>
            <SheetClose asChild>
              <Link
                className="flex h-11 w-full cursor-pointer items-center justify-center bg-primary text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
                href="/checkout"
              >
                Proceed to Checkout
              </Link>
            </SheetClose>
            <button
              className="mt-2 w-full cursor-pointer py-2 text-center text-xs font-medium text-rose-500 hover:text-rose-700"
              onClick={clearCart}
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
