import Form from 'next/form'
import Image from 'next/image'
import Link from 'next/link'
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2'

import { CategoryMegaMenu } from '@/components/layout/CategoryMegaMenu'
import { HeaderActions } from '@/components/layout/HeaderActions'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { ShopMegaMenu } from '@/components/layout/ShopMegaMenu'
import type { StorefrontCategoryCard, StorefrontProductCard } from '@/lib/get-storefront-home-data'

type HeaderProps = {
  readonly categories?: StorefrontCategoryCard[]
  readonly shopProducts?: StorefrontProductCard[]
  readonly dealProducts?: StorefrontProductCard[]
  readonly newInProducts?: StorefrontProductCard[]
}

export function Header({
  categories = [],
  shopProducts = [],
  dealProducts = [],
  newInProducts = [],
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b-2 border-gray-300 bg-white [--header-h:56px] md:[--header-h:62px]">
      <div className="mx-auto flex items-center gap-2 px-3 py-1 md:gap-4 md:px-6">
        <Link className="shrink-0 cursor-pointer" href="/">
          <Image
            alt="Galactic Solar and Electricals"
            className="h-12 w-auto object-contain md:h-14"
            height={112}
            priority
            src="/logo.png"
            width={420}
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex whitespace-nowrap">
          {shopProducts.length > 0 ? (
            <ShopMegaMenu label="Shop" products={shopProducts} />
          ) : (
            <Link
              className="cursor-pointer border-2 border-transparent px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:border-gray-300 hover:bg-accent"
              href="/products"
            >
              Shop
            </Link>
          )}
          {categories.length > 0 ? (
            <CategoryMegaMenu categories={categories} label="Categories" />
          ) : (
            <Link
              className="cursor-pointer border-2 border-transparent px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:border-gray-300 hover:bg-accent"
              href="/categories"
            >
              Categories
            </Link>
          )}
          {dealProducts.length > 0 ? (
            <ShopMegaMenu
              label="Deals"
              products={dealProducts}
              subtitle="Deals of the Day"
              viewAllHref="/categories/deal-of-the-day"
            />
          ) : (
            <Link
              className="cursor-pointer border-2 border-transparent px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:border-gray-300 hover:bg-accent"
              href="/categories/deal-of-the-day"
            >
              Deals
            </Link>
          )}
          {newInProducts.length > 0 ? (
            <ShopMegaMenu
              label="New In"
              products={newInProducts}
              subtitle="New Arrivals"
              viewAllHref="/products"
            />
          ) : (
            <Link
              className="cursor-pointer border-2 border-transparent px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:border-gray-300 hover:bg-accent"
              href="/products"
            >
              New In
            </Link>
          )}
          <Link
            className="cursor-pointer border-2 border-transparent px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:border-gray-300 hover:bg-accent"
            href="/about"
          >
            About
          </Link>
          <Link
            className="cursor-pointer border-2 border-transparent px-3 py-1.5 text-sm font-semibold uppercase tracking-[0.08em] text-black transition-colors hover:border-gray-300 hover:bg-accent"
            href="/contact"
          >
            Contact
          </Link>
        </nav>

        <Form action="/products" className="relative mx-2 hidden max-w-56 flex-1 lg:block">
          <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-black/50" />
          <input
            className="h-10 w-full cursor-text border-2 border-gray-300 bg-white pl-9 pr-3 text-sm text-black placeholder:text-black/45 focus:outline-none"
            name="q"
            placeholder="Search products..."
            type="search"
          />
        </Form>

        <div className="ml-auto flex items-center gap-1.5">
          <HeaderActions />
          <MobileMenu />
        </div>
      </div>
    </header>
  )
}
