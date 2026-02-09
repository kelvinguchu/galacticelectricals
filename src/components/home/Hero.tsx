import Link from 'next/link'
import {
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineWallet,
} from 'react-icons/hi2'

import { Button } from '@/components/ui/button'
import { HeroMainProduct } from '@/components/home/HeroMainProduct'
import { HeroProductCard } from '@/components/home/HeroProductCard'
import type { StorefrontProductCard } from '@/lib/get-storefront-home-data'

const points = [
  { icon: HiOutlineShieldCheck, label: 'Warranty-backed products', short: 'Warranty' },
  { icon: HiOutlineTruck, label: 'Fast countrywide delivery', short: 'Fast Delivery' },
  { icon: HiOutlineWallet, label: 'M-Pesa checkout ready', short: 'M-Pesa' },
]

type Props = {
  readonly products: StorefrontProductCard[]
}

export function Hero({ products }: Props) {
  const mainProduct = products[0]
  const bottomProducts = products.slice(1, 10)

  return (
    <section className="flex flex-col border-b-2 border-gray-300 bg-background md:h-[calc(100dvh-63px)] md:bg-white">
      {/* Top section: text + main product */}
      <div className="grid min-h-0 flex-1 md:grid-cols-9">
        {/* Text panel */}
        <div className="flex min-h-0 flex-col gap-3 px-4 py-6 md:col-span-5 md:gap-4 md:border-r-2 md:border-gray-300 md:px-6 md:py-7 lg:px-8">
          <div>
            <h1 className="max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              <span>Solar &</span> <span className="text-primary">Electronics</span>{' '}
              <span>Delivered.</span>
            </h1>
            <p className="mt-3 max-w-lg border-l-4 border-gray-300 bg-accent px-3 py-1.5 text-sm text-black/80 md:mt-4 md:text-base">
              Shop solar systems, inverters, batteries, electrical equipment, and accessories with
              smooth M-Pesa checkout.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Button asChild className="rounded-none border border-gray-300 px-5" size="default">
              <Link href="/products">
                Shop All
                <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-none border-gray-300 bg-white px-5 text-black hover:bg-accent"
              size="default"
              variant="outline"
            >
              <Link href="/categories">
                Categories
                <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Main product — padded card on mobile */}
        <div className="flex min-h-0 flex-col px-4 pb-4 md:col-span-4 md:bg-accent md:p-0">
          {mainProduct ? <HeroMainProduct product={mainProduct} /> : null}
        </div>
      </div>

      {/* Bottom product strip */}
      {bottomProducts.length > 0 ? (
        <div className="md:border-t-2 md:border-gray-300">
          {/* Mobile: horizontal scroll with padding */}
          <div className="flex gap-3 overflow-x-auto px-4 pb-4 md:hidden">
            {bottomProducts.map((product) => (
              <div key={product.id} className="w-[42vw] shrink-0">
                <HeroProductCard product={product} />
              </div>
            ))}
          </div>
          {/* Desktop: grid */}
          <div className="hidden md:grid sm:grid-cols-3 lg:grid-cols-9">
            {bottomProducts.map((product) => (
              <HeroProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Trust band */}
      <div className="border-t-2 border-gray-300 bg-black">
        <div className="mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-3 py-2.5 md:gap-x-8 md:px-6 md:py-3">
          {points.map((point) => (
            <div key={point.label} className="flex items-center gap-1.5 md:gap-2">
              <point.icon className="h-4 w-4 shrink-0 text-secondary md:h-5 md:w-5" />
              <p className="text-xs font-medium text-white md:hidden">{point.short}</p>
              <p className="hidden text-sm font-medium text-white md:block">{point.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
