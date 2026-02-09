'use client'

import Link from 'next/link'
import { HiOutlineShoppingBag } from 'react-icons/hi2'

import { useStore } from '@/stores/store'
import { formatKES } from '@/lib/utils'

export function CartSection() {
  const { cart, clearCart, removeFromCart, updateCartQuantity } = useStore()

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <HiOutlineShoppingBag className="size-12 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Your cart is empty</p>
        <Link
          className="inline-flex h-9 items-center justify-center bg-primary px-5 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:opacity-90"
          href="/"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {cart.reduce((s, i) => s + i.quantity, 0)} item
          {cart.reduce((s, i) => s + i.quantity, 0) === 1 ? '' : 's'} in cart
        </p>
        <button
          className="cursor-pointer text-xs font-medium text-rose-500 hover:text-rose-700"
          onClick={clearCart}
          type="button"
        >
          Clear All
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {cart.map((item) => {
          const activePrice = item.salePrice ?? item.price
          return (
            <div
              key={item.productId}
              className="flex items-start gap-2.5 border-2 border-gray-300 bg-white p-2.5 sm:items-center sm:gap-3 sm:p-3"
            >
              <div className="flex size-11 shrink-0 items-center justify-center border border-gray-200 bg-accent sm:size-12">
                {item.imageUrl ? (
                  <img alt={item.title} className="size-full object-contain" src={item.imageUrl} />
                ) : (
                  <HiOutlineShoppingBag className="size-5 text-muted-foreground/30" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-semibold text-foreground">{item.title}</p>
                <p className="text-[11px] text-muted-foreground">{formatKES(activePrice)}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <button
                    className="flex size-6 cursor-pointer items-center justify-center border border-gray-300 text-xs hover:bg-gray-50"
                    onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                    type="button"
                  >
                    −
                  </button>
                  <span className="text-xs font-semibold">{item.quantity}</span>
                  <button
                    className="flex size-6 cursor-pointer items-center justify-center border border-gray-300 text-xs hover:bg-gray-50"
                    onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                    type="button"
                  >
                    +
                  </button>
                  <button
                    className="ml-auto cursor-pointer text-[11px] text-rose-500 hover:text-rose-700 sm:hidden"
                    onClick={() => removeFromCart(item.productId)}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <button
                className="hidden shrink-0 cursor-pointer text-xs text-rose-500 hover:text-rose-700 sm:block"
                onClick={() => removeFromCart(item.productId)}
                type="button"
              >
                Remove
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
