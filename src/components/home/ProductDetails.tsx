'use client'

import { useEffect, useState } from 'react'
import {
  HiOutlineHeart,
  HiOutlineShoppingBag,
  HiShoppingBag,
  HiHeart,
  HiOutlineXMark,
  HiOutlineTag,
  HiOutlineArrowTopRightOnSquare,
} from 'react-icons/hi2'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import { useStore } from '@/stores/store'
import { useIsMobile } from '@/hooks/use-mobile'
import { formatKES } from '@/lib/utils'
import { fetchProductDetails } from '@/actions/product'
import type { ProductDetail, StorefrontProductCard } from '@/lib/get-storefront-home-data'

type ProductDetailsProps = {
  readonly product: StorefrontProductCard
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}

function DetailImage({
  product,
  detail,
  selectedImage,
  onSelect,
}: {
  readonly product: StorefrontProductCard
  readonly detail: ProductDetail | null
  readonly selectedImage: string | null
  readonly onSelect: (url: string | null) => void
}) {
  const displayImage = selectedImage ?? product.imageUrl

  return (
    <>
      <div className="flex h-44 items-center justify-center border-b-2 border-gray-300 bg-accent md:h-56">
        {displayImage ? (
          <img
            alt={product.imageAlt}
            className="h-full w-full object-contain p-4"
            src={displayImage}
          />
        ) : (
          <img
            alt={product.title}
            className="h-20 w-20 object-contain opacity-15 grayscale"
            src="/logo.png"
          />
        )}
      </div>

      {detail && detail.galleryUrls.length > 0 ? (
        <div className="flex gap-1.5 overflow-x-auto border-b border-gray-200 p-2">
          <button
            className={`h-12 w-12 shrink-0 cursor-pointer border-2 p-0.5 ${
              selectedImage === null ? 'border-primary' : 'border-gray-200'
            }`}
            onClick={() => onSelect(null)}
            type="button"
          >
            {product.imageUrl ? (
              <img alt="Main" className="h-full w-full object-contain" src={product.imageUrl} />
            ) : null}
          </button>
          {detail.galleryUrls.map((url) => (
            <button
              key={url}
              className={`h-12 w-12 shrink-0 cursor-pointer border-2 p-0.5 ${
                selectedImage === url ? 'border-primary' : 'border-gray-200'
              }`}
              onClick={() => onSelect(url)}
              type="button"
            >
              <img alt="Gallery" className="h-full w-full object-contain" src={url} />
            </button>
          ))}
        </div>
      ) : null}
    </>
  )
}

const stockStatusMeta: Record<string, { label: string; className: string }> = {
  instock: { label: 'In Stock', className: 'bg-green-100 text-green-700' },
  outofstock: { label: 'Out of Stock', className: 'bg-red-100 text-red-700' },
  onbackorder: { label: 'On Backorder', className: 'bg-amber-100 text-amber-700' },
}

const productTypeMeta: Record<string, { label: string; className: string }> = {
  simple: { label: 'Simple', className: 'bg-blue-100 text-blue-700' },
  variable: { label: 'Variable', className: 'bg-purple-100 text-purple-700' },
  external: { label: 'External / Affiliate', className: 'bg-orange-100 text-orange-700' },
}

function DetailInfo({
  detail,
  loading,
}: {
  readonly detail: ProductDetail | null
  readonly loading: boolean
}) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2 py-2">
        <div className="h-3 w-3/4 animate-pulse bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse bg-gray-200" />
        <div className="h-3 w-2/3 animate-pulse bg-gray-200" />
        <div className="h-3 w-1/2 animate-pulse bg-gray-200" />
      </div>
    )
  }

  if (!detail) return null

  const stock = stockStatusMeta[detail.stockStatus] ?? stockStatusMeta.instock
  const pType = productTypeMeta[detail.productType] ?? productTypeMeta.simple

  return (
    <>
      {/* Badges row: product type + stock status */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`inline-block rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${pType.className}`}
        >
          {pType.label}
        </span>
        <span
          className={`inline-block rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${stock.className}`}
        >
          {stock.label}
        </span>
        {detail.manageStock && detail.stockQuantity !== null ? (
          <span className="inline-block rounded-sm bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
            Qty: {detail.stockQuantity}
          </span>
        ) : null}
      </div>

      {/* Short description */}
      {detail.shortDescriptionHtml ? (
        <div
          className="prose prose-sm max-w-none text-xs leading-relaxed text-black/70"
          dangerouslySetInnerHTML={{ __html: detail.shortDescriptionHtml }}
        />
      ) : null}

      {/* SKU */}
      {detail.sku ? (
        <p className="text-[10px] uppercase tracking-widest text-black/40">SKU: {detail.sku}</p>
      ) : null}

      {/* Attributes */}
      {detail.attributes.length > 0 ? (
        <div className="flex flex-col gap-1 border-t border-gray-200 pt-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-black/50">
            Specifications
          </p>
          {detail.attributes.map((attr) => (
            <div key={attr.name} className="flex items-start gap-2 text-xs">
              <span className="shrink-0 font-semibold text-black/70">{attr.name}:</span>
              <span className="text-black/55">
                {attr.values
                  .split('|')
                  .map((v) => v.trim())
                  .join(' · ')}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {/* Full description */}
      {detail.descriptionHtml ? (
        <div className="border-t border-gray-200 pt-2">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-black/50">
            Description
          </p>
          <div
            className="prose prose-sm max-w-none text-xs leading-relaxed text-black/60"
            dangerouslySetInnerHTML={{ __html: detail.descriptionHtml }}
          />
        </div>
      ) : null}

      {/* Categories */}
      {detail.categoryNames.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-200 pt-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-black/50">
            Categories:
          </span>
          {detail.categoryNames.map((name) => (
            <span
              key={name}
              className="inline-block rounded-sm bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600"
            >
              {name}
            </span>
          ))}
        </div>
      ) : null}

      {/* Tags */}
      {detail.tagNames.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-200 pt-2">
          <HiOutlineTag className="size-3 text-black/40" />
          {detail.tagNames.map((name) => (
            <span
              key={name}
              className="inline-block rounded-sm bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-500"
            >
              {name}
            </span>
          ))}
        </div>
      ) : null}

      {/* External / Affiliate link */}
      {detail.productType === 'external' && detail.externalUrl ? (
        <a
          href={detail.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
        >
          <HiOutlineArrowTopRightOnSquare className="size-3.5" />
          {detail.buttonText || 'Buy from partner'}
        </a>
      ) : null}
    </>
  )
}

function DetailActions({
  product,
  detail,
  onClose,
}: {
  readonly product: StorefrontProductCard
  readonly detail: ProductDetail | null
  readonly onClose: () => void
}) {
  const { addToCart, toggleWishlist, isInWishlist, isInCart } = useStore()
  const [adding, setAdding] = useState(false)

  const isOut = product.stockStatus === 'outofstock'
  const isExternal = detail?.productType === 'external'
  const wishlisted = isInWishlist(product.id)
  const inCart = isInCart(product.id)

  const productInfo = {
    id: product.id,
    title: product.title,
    imageUrl: product.imageUrl,
    price: product.regularPrice,
    salePrice: product.salePrice,
  }

  const handleAdd = () => {
    setAdding(true)
    addToCart(productInfo)
    setTimeout(() => {
      setAdding(false)
      onClose()
    }, 300)
  }

  const cartLabel = inCart ? 'In Cart' : 'Add to Cart'
  const cartText = adding ? 'Added!' : cartLabel

  return (
    <div className="flex gap-2 border-t border-gray-200 bg-white p-4">
      {isExternal && detail?.externalUrl ? (
        <a
          href={detail.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-10 flex-1 items-center justify-center gap-2 bg-primary text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90"
        >
          <HiOutlineArrowTopRightOnSquare className="size-4" />
          {detail.buttonText || 'Buy Now'}
        </a>
      ) : (
        <button
          className={`flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 text-sm font-semibold uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 ${
            inCart && !adding ? 'bg-green-600' : 'bg-primary'
          }`}
          disabled={isOut || adding}
          onClick={handleAdd}
          type="button"
        >
          {inCart ? (
            <HiShoppingBag className="size-4" />
          ) : (
            <HiOutlineShoppingBag className="size-4" />
          )}
          {cartText}
        </button>
      )}
      <button
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className={`flex h-10 w-11 cursor-pointer items-center justify-center border-2 transition-colors ${
          wishlisted
            ? 'border-rose-500 bg-rose-500 text-white'
            : 'border-gray-300 bg-white text-rose-500 hover:bg-rose-50'
        }`}
        onClick={() => toggleWishlist(productInfo)}
        type="button"
      >
        {wishlisted ? <HiHeart className="size-5" /> : <HiOutlineHeart className="size-5" />}
      </button>
    </div>
  )
}

function DetailsBody({
  product,
  detail,
  loading,
}: {
  readonly product: StorefrontProductCard
  readonly detail: ProductDetail | null
  readonly loading: boolean
}) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const activePrice = product.salePrice ?? product.regularPrice
  const hasSale = product.salePrice !== null && product.salePrice < product.regularPrice

  return (
    <div className="flex flex-1 flex-col">
      <DetailImage
        detail={detail}
        onSelect={setSelectedImage}
        product={product}
        selectedImage={selectedImage}
      />

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="text-base font-bold leading-tight">{product.title}</h2>

        <div className="flex items-end gap-2">
          <span className="text-lg font-bold">{formatKES(activePrice)}</span>
          {hasSale ? (
            <span className="text-xs text-black/40 line-through">
              {formatKES(product.regularPrice)}
            </span>
          ) : null}
        </div>

        <DetailInfo detail={detail} loading={loading} />
      </div>
    </div>
  )
}

export function ProductDetails({ product, open, onOpenChange }: ProductDetailsProps) {
  const isMobile = useIsMobile()
  const [detail, setDetail] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetchedId, setFetchedId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    if (fetchedId === product.id) return

    setLoading(true)
    setDetail(null)
    fetchProductDetails(product.id)
      .then((d) => {
        setDetail(d)
        setFetchedId(product.id)
      })
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [open, product.id, fetchedId])

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
        <DrawerContent className="h-[90vh] max-h-[90vh] overflow-hidden rounded-t-lg">
          <DrawerHeader className="flex flex-row items-center justify-between border-b-2 border-gray-300">
            <DrawerTitle className="text-sm font-semibold uppercase tracking-widest">
              Product Details
            </DrawerTitle>
            <DrawerClose asChild>
              <button
                aria-label="Close"
                className="inline-flex size-8 cursor-pointer items-center justify-center rounded-xs text-black/60 hover:text-black"
                type="button"
              >
                <HiOutlineXMark className="size-5" />
              </button>
            </DrawerClose>
          </DrawerHeader>
          <div className="flex flex-1 flex-col overflow-y-auto">
            <DetailsBody detail={detail} loading={loading} product={product} />
          </div>
          <DetailActions detail={detail} onClose={() => onOpenChange(false)} product={product} />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex min-w-[95vw] flex-col md:min-w-[40vw]"
        side="right"
        showCloseButton
      >
        <SheetHeader className="border-b-2 border-gray-300">
          <SheetTitle className="text-sm font-semibold uppercase tracking-widest">
            Product Details
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <DetailsBody detail={detail} loading={loading} product={product} />
        </div>
        <DetailActions detail={detail} onClose={() => onOpenChange(false)} product={product} />
      </SheetContent>
    </Sheet>
  )
}
