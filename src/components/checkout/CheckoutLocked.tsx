'use client'

import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa6'
import { HiOutlineShoppingBag } from 'react-icons/hi2'

import { useStore } from '@/stores/store'
import { SectionHeading } from '@/components/ui/section-heading'
import { formatKES } from '@/lib/utils'
import { buildCartWhatsAppMessage, buildWhatsAppHref } from '@/lib/whatsapp'

export function CheckoutLocked() {
  const { cart } = useStore()
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const total = cart.reduce((sum, item) => sum + (item.salePrice ?? item.price) * item.quantity, 0)
  const whatsappMessage = buildCartWhatsAppMessage(cart, total)
  const whatsappHref = buildWhatsAppHref(whatsappMessage)

  return (
    <main className="mx-auto max-w-3xl px-3 py-6 md:px-4 md:py-10">
      <SectionHeading as="h1" className="mb-4 justify-center sm:mb-6" size="md">
        Checkout Temporarily Paused
      </SectionHeading>

      <div className="border-2 border-gray-300 bg-white p-4 text-center sm:p-6">
        <p className="text-sm text-black/70">
          Online checkout is temporarily unavailable. Please place your order directly on WhatsApp.
        </p>

        {cart.length > 0 ? (
          <div className="mt-4 border-2 border-gray-200 bg-accent p-3 text-left sm:mx-auto sm:max-w-md">
            <p className="text-xs uppercase tracking-widest text-black/50">
              Cart Summary
            </p>
            <p className="mt-1 text-sm font-semibold text-black">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
            <p className="text-sm text-black/70">Total: {formatKES(total)}</p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-black/50">
            Your cart is empty. Add products first, then send your order on WhatsApp.
          </p>
        )}

        <div className="mt-5 flex flex-col gap-2 sm:mx-auto sm:max-w-sm">
          <a
            className="inline-flex h-11 items-center justify-center gap-2 bg-[#25D366] px-4 text-sm font-semibold uppercase tracking-widest text-white hover:opacity-90"
            href={whatsappHref}
            rel="noopener noreferrer"
            target="_blank"
          >
            <FaWhatsapp className="size-4" />
            Order on WhatsApp
          </a>
          <Link
            className="inline-flex h-10 items-center justify-center border-2 border-gray-300 px-4 text-xs font-semibold uppercase tracking-widest text-black hover:bg-accent"
            href="/products"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  )
}
