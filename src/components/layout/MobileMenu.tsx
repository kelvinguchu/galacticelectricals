'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Form from 'next/form'
import {
  HiOutlineBars3,
  HiOutlineMagnifyingGlass,
  HiOutlineBolt,
  HiOutlineSquares2X2,
  HiOutlineSparkles,
  HiOutlineTag,
  HiOutlineArrowRight,
  HiOutlineUserCircle,
  HiOutlineInformationCircle,
  HiOutlinePhone,
} from 'react-icons/hi2'

import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const navItems = [
  { label: 'Shop', href: '/products', icon: HiOutlineBolt },
  { label: 'Categories', href: '/categories', icon: HiOutlineSquares2X2 },
  { label: 'Deals', href: '/categories/deal-of-the-day', icon: HiOutlineTag },
  { label: 'New In', href: '/products', icon: HiOutlineSparkles },
  { label: 'About Us', href: '/about', icon: HiOutlineInformationCircle },
  { label: 'Contact', href: '/contact', icon: HiOutlinePhone },
]

export function MobileMenu() {
  const [open, setOpen] = useState(false)
  const [shouldFocusSearch, setShouldFocusSearch] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  const openFromSearch = useCallback(() => {
    setShouldFocusSearch(true)
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
    if (!next) setShouldFocusSearch(false)
  }, [])

  useEffect(() => {
    if (open && shouldFocusSearch) {
      const timer = setTimeout(() => searchRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [open, shouldFocusSearch])

  return (
    <>
      {/* Search button — visible on mobile only */}
      <button
        aria-label="Search"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border-2 border-gray-300 bg-white text-black transition-colors hover:bg-accent lg:hidden"
        onClick={openFromSearch}
        type="button"
      >
        <HiOutlineMagnifyingGlass className="size-5" />
      </button>

      {/* Hamburger button */}
      <Sheet open={open} onOpenChange={handleOpenChange}>
        <button
          aria-label="Open menu"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border-2 border-gray-300 bg-white text-black transition-colors hover:bg-accent lg:hidden"
          onClick={() => {
            setShouldFocusSearch(false)
            setOpen(true)
          }}
          type="button"
        >
          <HiOutlineBars3 className="size-6" />
        </button>

        <SheetContent className="flex min-w-[95vw] flex-col" showCloseButton side="right">
          <SheetHeader className="border-b-2 border-gray-300">
            <SheetTitle className="text-sm font-semibold uppercase tracking-widest">
              Menu
            </SheetTitle>
          </SheetHeader>

          {/* Search */}
          <div className="border-b border-gray-200 px-4 py-3">
            <Form action="/products" className="relative" onSubmit={() => setOpen(false)}>
              <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/50" />
              <input
                ref={searchRef}
                className="h-10 w-full border-2 border-gray-300 bg-white pl-9 pr-3 text-sm text-black placeholder:text-black/45 focus:border-primary focus:outline-none"
                name="q"
                placeholder="Search products..."
                type="search"
              />
            </Form>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto">
            <ul className="divide-y divide-gray-100">
              {navItems.map((item) => (
                <li key={item.label}>
                  <SheetClose asChild>
                    <Link
                      className="flex items-center gap-3 px-4 py-4 text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-accent"
                      href={item.href}
                    >
                      <item.icon className="size-5 text-primary" />
                      {item.label}
                      <HiOutlineArrowRight className="ml-auto size-4 text-black/30" />
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>

          {/* Account link at bottom */}
          <div className="border-t-2 border-gray-300 p-4">
            <SheetClose asChild>
              <Link
                className="flex h-11 w-full items-center justify-center gap-2 border-2 border-gray-300 bg-white text-sm font-semibold uppercase tracking-widest text-black transition-colors hover:bg-accent"
                href="/account"
              >
                <HiOutlineUserCircle className="size-5" />
                My Account
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
