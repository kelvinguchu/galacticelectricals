'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { HiOutlineArrowRight, HiOutlineChevronDown } from 'react-icons/hi2'

import type { StorefrontCategoryCard } from '@/lib/get-storefront-home-data'

type Props = {
  readonly categories: StorefrontCategoryCard[]
  readonly label: string
}

export function CategoryMegaMenu({ categories, label }: Props) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }

  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150)
  }

  const displayCategories = categories.slice(0, 20)
  const hasMore = categories.length > 20

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

            <div className="max-h-[90vh] overflow-y-auto p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-widest text-black/50">
                  All Categories
                </p>
                {hasMore ? (
                  <Link
                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary transition-colors hover:text-primary/70"
                    href="/categories"
                    onClick={() => setOpen(false)}
                  >
                    View All
                    <HiOutlineArrowRight className="size-3.5" />
                  </Link>
                ) : null}
              </div>

              <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7">
                {displayCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    className="group relative flex flex-col items-center overflow-hidden border border-gray-200 bg-gray-50 p-3 transition-all hover:border-primary/30 hover:bg-accent hover:shadow-md"
                    href={`/categories/${cat.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    <div className="mb-2 flex size-12 items-center justify-center">
                      {cat.imageUrl ? (
                        <img
                          alt={cat.imageAlt}
                          className="size-10 object-contain transition-transform duration-200 group-hover:scale-110"
                          loading="lazy"
                          src={cat.imageUrl}
                        />
                      ) : (
                        <img
                          alt={cat.name}
                          className="size-10 object-contain opacity-20 grayscale"
                          src="/logo.png"
                        />
                      )}
                    </div>
                    <span className="line-clamp-2 text-center text-[11px] font-semibold leading-tight text-black/70 transition-colors group-hover:text-primary">
                      {cat.name}
                    </span>
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
