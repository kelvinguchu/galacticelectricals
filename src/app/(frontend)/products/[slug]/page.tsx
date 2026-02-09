import { notFound } from 'next/navigation'
import Link from 'next/link'
import { HiOutlineArrowLeft, HiOutlineTag, HiOutlineArrowTopRightOnSquare } from 'react-icons/hi2'

import { SectionHeading } from '@/components/ui/section-heading'
import { Button } from '@/components/ui/button'
import {
  getProductBySlug,
  getRelatedProducts,
  type FullProduct,
} from '@/lib/get-storefront-home-data'
import { formatKES } from '@/lib/utils'
import { ProductPageActions } from '@/components/home/ProductPageActions'
import { ProductCard } from '@/components/home/ProductCard'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'

type Props = {
  readonly params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.title} – Galactic Solar & Electricals`,
    description: product.shortDescriptionHtml
      ? product.shortDescriptionHtml.replaceAll(/<[^>]*>/g, '').slice(0, 160)
      : `Buy ${product.title} at Galactic Solar & Electricals.`,
  }
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

function ProductImages({
  product,
  allImages,
}: {
  readonly product: FullProduct
  readonly allImages: string[]
}) {
  return (
    <div className="flex flex-col gap-3 md:gap-3">
      <div className="flex aspect-square items-center justify-center border-2 border-gray-300 bg-accent">
        {product.imageUrl ? (
          <img
            alt={product.imageAlt}
            className="h-full w-full object-contain p-4 md:p-6"
            src={product.imageUrl}
          />
        ) : (
          <img
            alt={product.title}
            className="h-24 w-24 object-contain opacity-15 grayscale"
            src="/logo.png"
          />
        )}
      </div>
      {allImages.length > 1 ? (
        <div className="grid grid-cols-4 gap-1.5 md:grid-cols-5 md:gap-2">
          {allImages.map((url) => (
            <div
              key={url}
              className="flex aspect-square items-center justify-center border-2 border-gray-200 bg-accent p-1"
            >
              <img alt="Gallery" className="h-full w-full object-contain" src={url} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function ProductMeta({ product }: { readonly product: FullProduct }) {
  const stock = stockStatusMeta[product.stockStatus] ?? stockStatusMeta.instock
  const pType = productTypeMeta[product.productType] ?? productTypeMeta.simple
  const activePrice = product.salePrice ?? product.regularPrice
  const hasSale = product.salePrice !== null && product.salePrice < product.regularPrice

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight text-black sm:text-2xl">{product.title}</h1>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-block rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${pType.className}`}
        >
          {pType.label}
        </span>
        <span
          className={`inline-block rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${stock.className}`}
        >
          {stock.label}
        </span>
        {product.manageStock && product.stockQuantity !== null ? (
          <span className="inline-block rounded-sm bg-gray-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-600">
            Qty: {product.stockQuantity}
          </span>
        ) : null}
      </div>

      <div className="flex items-end gap-2 md:gap-3">
        <span className="text-2xl font-bold md:text-3xl">{formatKES(activePrice)}</span>
        {hasSale ? (
          <span className="text-base text-black/40 line-through md:text-lg">
            {formatKES(product.regularPrice)}
          </span>
        ) : null}
      </div>

      {product.shortDescriptionHtml ? (
        <div
          className="prose prose-sm max-w-none text-sm leading-relaxed text-black/70"
          dangerouslySetInnerHTML={{ __html: product.shortDescriptionHtml }}
        />
      ) : null}

      {product.sku ? (
        <p className="text-xs uppercase tracking-widest text-black/40">SKU: {product.sku}</p>
      ) : null}
    </>
  )
}

function ProductSpecs({ product }: { readonly product: FullProduct }) {
  return (
    <>
      {product.productType === 'external' && product.externalUrl ? (
        <a
          href={product.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <HiOutlineArrowTopRightOnSquare className="size-4" />
          {product.buttonText || 'Buy from partner'}
        </a>
      ) : null}

      {product.attributes.length > 0 ? (
        <div className="flex flex-col gap-2 border-t border-gray-200 pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-black/50">
            Specifications
          </p>
          {product.attributes.map((attr) => (
            <div key={attr.name} className="flex items-start gap-3 text-sm">
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

      {product.descriptionHtml ? (
        <div className="border-t border-gray-200 pt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-black/50">
            Description
          </p>
          <div
            className="prose prose-sm max-w-none text-sm leading-relaxed text-black/60"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        </div>
      ) : null}

      {product.categoryNames.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-black/50">
            Categories:
          </span>
          {product.categoryNames.map((name) => (
            <span
              key={name}
              className="inline-block rounded-sm bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600"
            >
              {name}
            </span>
          ))}
        </div>
      ) : null}

      {product.tagNames.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 pt-4">
          <HiOutlineTag className="size-3.5 text-black/40" />
          {product.tagNames.map((name) => (
            <span
              key={name}
              className="inline-block rounded-sm bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500"
            >
              {name}
            </span>
          ))}
        </div>
      ) : null}
    </>
  )
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const [allImages, relatedProducts] = await Promise.all([
    Promise.resolve(
      [product.imageUrl, ...product.galleryUrls].filter((url): url is string => Boolean(url)),
    ),
    getRelatedProducts(product.id, product.categoryIds, 10),
  ])

  return (
    <section className="py-4 md:py-10" data-has-whatsapp>
      <div className="mx-auto max-w-7xl px-3 md:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 md:mb-6 md:gap-3">
          <Button
            asChild
            className="shrink-0 rounded-none border-gray-300"
            size="sm"
            variant="outline"
          >
            <Link href="/products">
              <HiOutlineArrowLeft className="h-4 w-4" />
              Products
            </Link>
          </Button>
          {product.categoryNames.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1 text-xs text-black/40">
              {product.categorySlugs.map((catSlug, idx) => (
                <span key={catSlug} className="inline-flex items-center gap-1">
                  {idx > 0 ? <span>/</span> : null}
                  <Link
                    href={`/categories/${catSlug}`}
                    className="hover:text-primary hover:underline"
                  >
                    {product.categoryNames[idx]}
                  </Link>
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
          <ProductImages product={product} allImages={allImages} />

          <div className="flex flex-col gap-4">
            <ProductMeta product={product} />
            <ProductPageActions product={product} />
            <ProductSpecs product={product} />
          </div>
        </div>

        {relatedProducts.length > 0 ? (
          <div className="mt-8 border-t-2 border-gray-200 pt-6 md:mt-10 md:pt-8">
            <SectionHeading size="sm">Related Products</SectionHeading>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:mt-4 md:grid-cols-4 md:gap-3 lg:grid-cols-5">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
      <WhatsAppButton
        message={`Hi Galactic, I am interested in ${product.title} ${process.env.NEXT_PUBLIC_SERVER_URL || 'https://galacticelectricals.com'}/products/${slug}`}
      />
    </section>
  )
}
