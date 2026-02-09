'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { HiOutlineArrowRight, HiOutlineChevronDown } from 'react-icons/hi2'

import { formatKES } from '@/lib/utils'
import type { StorefrontProductCard } from '@/lib/get-storefront-home-data'

type Props = {
  readonly products: StorefrontProductCard[]
  readonly label: string
  readonly subtitle?: string
  readonly viewAllHref?: string
}

export function ShopMegaMenu({
  products,
  label,
  subtitle = 'Popular Products',
  viewAllHref = '/products',
}: Props) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  return (
    <div className="static" onMouseEnter={show} onMouseLeave={hide}>
      <button
        className="inline-flex cursor-pointer items-center gap-1 border-2 border-transparent px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:border-gray-300 hover:bg-accent"
        type="button"
      >
        {label}
        <HiOutlineChevronDown
          className={`size-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open ? (
        <div className="fixed inset-x-0 top-[calc(var(--header-h,56px)+2px)] z-50 flex justify-center px-4">
          <div className="w-full max-w-6xl overflow-hidden border-2 border-gray-300 bg-white shadow-2xl">
            <div className="flex h-1">
              <div className="flex-1 bg-primary" />
              <div className="flex-1 bg-secondary" />
            </div>

            <div className="max-h-[90vh] overflow-y-auto p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-black/50">
                  {subtitle}
                </p>
                <Link
                  className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:text-primary/70"
                  href={viewAllHref}
                  onClick={() => setOpen(false)}
                >
                  View All
                  <HiOutlineArrowRight className="size-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-5">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    className="group flex flex-col overflow-hidden border border-gray-200 bg-gray-50 transition-all hover:border-primary/30 hover:shadow-md"
                    href={`/products/${product.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    <div className="flex h-24 items-center justify-center bg-accent p-1">
                      {product.imageUrl ? (
                        <img
                          alt={product.imageAlt}
                          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                          loading="lazy"
                          src={product.imageUrl}
                        />
                      ) : (
                        <img
                          alt={product.title}
                          className="h-10 w-10 object-contain opacity-15 grayscale"
                          src="/logo.png"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5 p-2">
                      <p className="line-clamp-1 text-[11px] font-semibold leading-tight text-black/80 group-hover:text-primary">
                        {product.title}
                      </p>
                      <p className="text-xs font-bold text-black">
                        {formatKES(product.salePrice ?? product.regularPrice)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
