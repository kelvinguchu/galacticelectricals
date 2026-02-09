import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import config from '@/payload.config'
import type { Media, Product, ProductCategory, ProductTag } from '@/payload-types'
import { CACHE_TAG_PRODUCTS, CACHE_TAG_CATEGORIES, CACHE_TAG_TAGS } from '@/lib/cache-tags'

export type StorefrontCategoryCard = {
  id: string
  name: string
  slug: string
  imageUrl: string | null
  imageAlt: string
  isDealOfDay: boolean
}

export type StorefrontProductCard = {
  id: string
  title: string
  slug: string
  regularPrice: number
  salePrice: number | null
  stockStatus: 'instock' | 'outofstock' | 'onbackorder'
  imageUrl: string | null
  imageAlt: string
  categoryNames: string[]
}

export type StorefrontHomeData = {
  categories: StorefrontCategoryCard[]
  featuredProducts: StorefrontProductCard[]
  dealProducts: StorefrontProductCard[]
  newArrivals: StorefrontProductCard[]
}

const getPayloadClient = cache(async () => {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
})

const asMedia = (value: unknown): Media | null => {
  if (!value || typeof value !== 'object') return null
  const media = value as Media
  if (!media.url) return null
  if (media._key) {
    media.url = `https://utfs.io/f/${media._key}`
  }
  return media
}

const asCategoryName = (value: unknown): string | null => {
  if (!value) return null
  if (typeof value === 'object') {
    const category = value as ProductCategory
    if (category.name) return category.name
  }
  return null
}

const toProductCard = (product: Product): StorefrontProductCard => {
  const image = asMedia(product.featuredImage)
  const categoryNames = Array.isArray(product.categories)
    ? product.categories.map(asCategoryName).filter((name): name is string => Boolean(name))
    : []

  return {
    id: product.id,
    title: product.title,
    slug: product.slug,
    regularPrice: Number(product.regularPrice || 0),
    salePrice:
      typeof product.salePrice === 'number' && product.salePrice > 0
        ? Number(product.salePrice)
        : null,
    stockStatus: product.stockStatus || 'instock',
    imageUrl: image?.url || null,
    imageAlt: image?.alt || product.title,
    categoryNames,
  }
}

const toCategoryCard = (category: ProductCategory): StorefrontCategoryCard => {
  const image = asMedia(category.image)
  const isDealOfDay = category.slug === 'deal-of-the-day'

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    imageUrl: image?.url || null,
    imageAlt: image?.alt || category.name,
    isDealOfDay,
  }
}

// --- Cache tags ---

const getFeaturedProducts = async () => {
  const payload = await getPayloadClient()

  const featured = await payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 1,
    limit: 20,
    sort: '-createdAt',
    where: {
      and: [{ _status: { equals: 'published' } }, { productType: { equals: 'simple' } }],
    },
  })

  return featured.docs.map(toProductCard)
}

const getDealProducts = async () => {
  const payload = await getPayloadClient()

  const deals = await payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 1,
    limit: 10,
    sort: '-createdAt',
    where: {
      and: [
        { _status: { equals: 'published' } },
        { productType: { equals: 'simple' } },
        { salePrice: { greater_than: 0 } },
      ],
    },
  })

  return deals.docs.map(toProductCard)
}

const getNewArrivals = async () => {
  const payload = await getPayloadClient()

  const arrivals = await payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 1,
    limit: 20,
    sort: '-createdAt',
    where: {
      and: [{ _status: { equals: 'published' } }, { productType: { equals: 'simple' } }],
    },
  })

  return arrivals.docs.map(toProductCard)
}

const fetchCategoriesWithImages = async () => {
  const payload = await getPayloadClient()

  const [categoriesResult, productsResult] = await Promise.all([
    payload.find({
      collection: 'product-categories',
      overrideAccess: false,
      depth: 1,
      limit: 50,
      sort: '-createdAt',
    }),
    payload.find({
      collection: 'products',
      overrideAccess: false,
      depth: 1,
      limit: 0,
      sort: '-createdAt',
      where: {
        and: [{ _status: { equals: 'published' } }, { productType: { equals: 'simple' } }],
      },
    }),
  ])

  const firstProductImageByCategory = new Map<string, { url: string; alt: string }>()

  for (const product of productsResult.docs) {
    const image = asMedia(product.featuredImage)
    if (!image?.url || !Array.isArray(product.categories)) continue

    for (const category of product.categories) {
      let categoryID: string | null = null

      if (typeof category === 'string') {
        categoryID = category
      } else if (category && typeof category === 'object' && 'id' in category) {
        categoryID = String(category.id)
      }

      if (!categoryID || firstProductImageByCategory.has(categoryID)) continue

      firstProductImageByCategory.set(categoryID, {
        url: image.url,
        alt: image.alt || product.title,
      })
    }
  }

  const categories = categoriesResult.docs.map(toCategoryCard).map((category) => {
    const firstProductImage = firstProductImageByCategory.get(category.id)
    if (!firstProductImage) return category

    return {
      ...category,
      imageUrl: firstProductImage.url,
      imageAlt: firstProductImage.alt,
    }
  })

  categories.sort((a, b) => {
    if (a.isDealOfDay && !b.isDealOfDay) return -1
    if (!a.isDealOfDay && b.isDealOfDay) return 1
    return a.name.localeCompare(b.name)
  })

  return categories
}

export const getCategories = unstable_cache(
  async () => {
    const all = await fetchCategoriesWithImages()
    return all.slice(0, 8)
  },
  ['storefront-categories-top8'],
  { tags: [CACHE_TAG_CATEGORIES, CACHE_TAG_PRODUCTS] },
)

export const getAllCategories = unstable_cache(
  async () => {
    return fetchCategoriesWithImages()
  },
  ['storefront-categories-all'],
  { tags: [CACHE_TAG_CATEGORIES, CACHE_TAG_PRODUCTS] },
)

export const getShopProducts = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      overrideAccess: false,
      depth: 1,
      limit: 15,
      sort: '-createdAt',
      where: {
        and: [{ _status: { equals: 'published' } }, { productType: { equals: 'simple' } }],
      },
    })
    return result.docs.map(toProductCard)
  },
  ['storefront-shop-products'],
  { tags: [CACHE_TAG_PRODUCTS] },
)

export const getDealDropdownProducts = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const dealCategory = await payload.find({
      collection: 'product-categories',
      where: { slug: { equals: 'deal-of-the-day' } },
      limit: 1,
      depth: 0,
    })
    const categoryId = dealCategory.docs[0]?.id
    if (!categoryId) return []

    const result = await payload.find({
      collection: 'products',
      overrideAccess: false,
      depth: 1,
      limit: 15,
      sort: '-createdAt',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { productType: { equals: 'simple' } },
          { categories: { contains: categoryId } },
        ],
      },
    })
    return result.docs.map(toProductCard)
  },
  ['storefront-deal-dropdown'],
  { tags: [CACHE_TAG_PRODUCTS, CACHE_TAG_CATEGORIES] },
)

export const getNewInDropdownProducts = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      overrideAccess: false,
      depth: 1,
      limit: 15,
      sort: '-createdAt',
      where: {
        _status: { equals: 'published' },
      },
    })
    return result.docs.map(toProductCard)
  },
  ['storefront-new-in-dropdown'],
  { tags: [CACHE_TAG_PRODUCTS] },
)

export { formatKES } from './utils'

export const getStorefrontHomeData = cache(async (): Promise<StorefrontHomeData> => {
  const [categories, featuredProducts, dealProducts, newArrivals] = await Promise.all([
    getCategories(),
    getCachedFeaturedProducts(),
    getCachedDealProducts(),
    getCachedNewArrivals(),
  ])

  return {
    categories,
    featuredProducts,
    dealProducts,
    newArrivals,
  }
})

const getCachedFeaturedProducts = unstable_cache(getFeaturedProducts, ['storefront-featured'], {
  tags: [CACHE_TAG_PRODUCTS],
})

const getCachedDealProducts = unstable_cache(getDealProducts, ['storefront-deals'], {
  tags: [CACHE_TAG_PRODUCTS],
})

const getCachedNewArrivals = unstable_cache(getNewArrivals, ['storefront-arrivals'], {
  tags: [CACHE_TAG_PRODUCTS],
})

// --- Single product detail for quick-view panel ---

export type ProductDetail = {
  shortDescriptionHtml: string | null
  descriptionHtml: string | null
  sku: string | null
  productType: 'simple' | 'variable' | 'external'
  stockStatus: 'instock' | 'outofstock' | 'onbackorder'
  manageStock: boolean
  stockQuantity: number | null
  attributes: { name: string; values: string }[]
  galleryUrls: string[]
  categoryNames: string[]
  tagNames: string[]
  externalUrl: string | null
  buttonText: string | null
}

const lexicalToHtml = (data: unknown): string | null => {
  if (!data) return null
  try {
    return convertLexicalToHTML({ data: data as SerializedEditorState }) || null
  } catch {
    return null
  }
}

const extractGalleryUrls = (gallery: Product['gallery']): string[] => {
  if (!Array.isArray(gallery)) return []
  return gallery
    .map((item) => asMedia(item.image)?.url)
    .filter((url): url is string => Boolean(url))
}

const extractCategoryNames = (categories: Product['categories']): string[] => {
  if (!Array.isArray(categories)) return []
  return categories.map(asCategoryName).filter((n): n is string => Boolean(n))
}

const extractCategorySlugs = (categories: Product['categories']): string[] => {
  if (!Array.isArray(categories)) return []
  return categories
    .filter((c): c is ProductCategory => c !== null && typeof c === 'object' && 'slug' in c)
    .map((c) => c.slug)
}

const extractCategoryIds = (categories: Product['categories']): string[] => {
  if (!Array.isArray(categories)) return []
  return categories
    .map((c) => {
      if (typeof c === 'string') return c
      if (c && typeof c === 'object' && 'id' in c) return c.id
      return null
    })
    .filter((id): id is string => Boolean(id))
}

const extractTagNames = (tags: Product['tags']): string[] => {
  if (!Array.isArray(tags)) return []
  return tags
    .filter((tag): tag is ProductTag => tag !== null && typeof tag === 'object' && 'name' in tag)
    .map((tag) => tag.name)
}

export const getProductDetails = unstable_cache(
  async (productId: string): Promise<ProductDetail | null> => {
    try {
      const payload = await getPayloadClient()
      const product = await payload.findByID({
        collection: 'products',
        id: productId,
        depth: 1,
      })

      if (!product) return null

      return {
        shortDescriptionHtml: lexicalToHtml(product.shortDescription),
        descriptionHtml: lexicalToHtml(product.description),
        sku: product.sku ?? null,
        productType: product.productType ?? 'simple',
        stockStatus: product.stockStatus ?? 'instock',
        manageStock: product.manageStock ?? false,
        stockQuantity: product.stockQuantity ?? null,
        attributes: product.attributes?.map((a) => ({ name: a.name, values: a.values })) ?? [],
        galleryUrls: extractGalleryUrls(product.gallery),
        categoryNames: extractCategoryNames(product.categories),
        tagNames: extractTagNames(product.tags),
        externalUrl: product.externalUrl ?? null,
        buttonText: product.buttonText ?? null,
      }
    } catch {
      return null
    }
  },
  ['storefront-product-detail'],
  { tags: [CACHE_TAG_PRODUCTS, CACHE_TAG_CATEGORIES, CACHE_TAG_TAGS] },
)

// --- Paginated all-products listing ---

export type PaginatedProducts = {
  docs: StorefrontProductCard[]
  totalDocs: number
  totalPages: number
  page: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export const getAllProducts = unstable_cache(
  async (page = 1, limit = 20): Promise<PaginatedProducts> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'products',
      overrideAccess: false,
      depth: 1,
      limit,
      page,
      sort: '-createdAt',
      where: {
        and: [{ _status: { equals: 'published' } }, { productType: { equals: 'simple' } }],
      },
    })

    return {
      docs: result.docs.map(toProductCard),
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page ?? page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    }
  },
  ['storefront-all-products'],
  { tags: [CACHE_TAG_PRODUCTS] },
)

// --- Filtered / searchable product listing ---

export type ProductFilterParams = {
  q?: string
  categories?: string[]
  stockStatus?: string
  productType?: string
  minPrice?: number
  maxPrice?: number
  sort?: string
  page?: number
  limit?: number
}

export async function searchProducts(filters: ProductFilterParams): Promise<PaginatedProducts> {
  const payload = await getPayloadClient()
  const page = filters.page ?? 1
  const limit = filters.limit ?? 20

  const conditions: Where[] = [{ _status: { equals: 'published' } }]

  if (filters.q) {
    conditions.push({
      or: [{ title: { contains: filters.q } }, { sku: { contains: filters.q } }],
    })
  }

  if (filters.categories && filters.categories.length > 0) {
    conditions.push({
      or: filters.categories.map((catId) => ({
        categories: { contains: catId },
      })),
    })
  }

  if (filters.stockStatus) {
    conditions.push({ stockStatus: { equals: filters.stockStatus } })
  }

  if (filters.productType) {
    conditions.push({ productType: { equals: filters.productType } })
  }

  if (filters.minPrice !== undefined) {
    conditions.push({ regularPrice: { greater_than_equal: filters.minPrice } })
  }

  if (filters.maxPrice !== undefined) {
    conditions.push({ regularPrice: { less_than_equal: filters.maxPrice } })
  }

  let sort = '-createdAt'
  if (filters.sort === 'price-asc') sort = 'regularPrice'
  else if (filters.sort === 'price-desc') sort = '-regularPrice'
  else if (filters.sort === 'title-asc') sort = 'title'
  else if (filters.sort === 'title-desc') sort = '-title'

  const result = await payload.find({
    collection: 'products',
    overrideAccess: false,
    depth: 1,
    limit,
    page,
    sort,
    where: { and: conditions },
  })

  return {
    docs: result.docs.map(toProductCard),
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? page,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  }
}

// --- Products for a specific category ---

export const getCategoryBySlug = unstable_cache(
  async (slug: string): Promise<StorefrontCategoryCard | null> => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'product-categories',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })

    const category = result.docs[0]
    if (!category) return null
    return toCategoryCard(category)
  },
  ['storefront-category-by-slug'],
  { tags: [CACHE_TAG_CATEGORIES] },
)

export const getProductsByCategory = unstable_cache(
  async (
    categorySlug: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedProducts & { categoryName: string | null }> => {
    const payload = await getPayloadClient()

    const categoryResult = await payload.find({
      collection: 'product-categories',
      where: { slug: { equals: categorySlug } },
      limit: 1,
      depth: 0,
    })

    const category = categoryResult.docs[0]
    if (!category) {
      return {
        docs: [],
        totalDocs: 0,
        totalPages: 0,
        page: 1,
        hasNextPage: false,
        hasPrevPage: false,
        categoryName: null,
      }
    }

    const result = await payload.find({
      collection: 'products',
      overrideAccess: false,
      depth: 1,
      limit,
      page,
      sort: '-createdAt',
      where: {
        and: [
          { _status: { equals: 'published' } },
          { productType: { equals: 'simple' } },
          { categories: { contains: category.id } },
        ],
      },
    })

    return {
      docs: result.docs.map(toProductCard),
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page ?? page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      categoryName: category.name,
    }
  },
  ['storefront-products-by-category'],
  { tags: [CACHE_TAG_PRODUCTS, CACHE_TAG_CATEGORIES] },
)

// --- Full product page by slug ---

export type FullProduct = StorefrontProductCard &
  ProductDetail & {
    categorySlugs: string[]
    categoryIds: string[]
  }

export const getProductBySlug = unstable_cache(
  async (slug: string): Promise<FullProduct | null> => {
    try {
      const payload = await getPayloadClient()
      const result = await payload.find({
        collection: 'products',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 1,
      })

      const product = result.docs[0]
      if (!product) return null

      const card = toProductCard(product)
      const detail: ProductDetail = {
        shortDescriptionHtml: lexicalToHtml(product.shortDescription),
        descriptionHtml: lexicalToHtml(product.description),
        sku: product.sku ?? null,
        productType: product.productType ?? 'simple',
        stockStatus: product.stockStatus ?? 'instock',
        manageStock: product.manageStock ?? false,
        stockQuantity: product.stockQuantity ?? null,
        attributes: product.attributes?.map((a) => ({ name: a.name, values: a.values })) ?? [],
        galleryUrls: extractGalleryUrls(product.gallery),
        categoryNames: extractCategoryNames(product.categories),
        tagNames: extractTagNames(product.tags),
        externalUrl: product.externalUrl ?? null,
        buttonText: product.buttonText ?? null,
      }

      return {
        ...card,
        ...detail,
        categorySlugs: extractCategorySlugs(product.categories),
        categoryIds: extractCategoryIds(product.categories),
      }
    } catch {
      return null
    }
  },
  ['storefront-product-by-slug'],
  { tags: [CACHE_TAG_PRODUCTS, CACHE_TAG_CATEGORIES, CACHE_TAG_TAGS] },
)

// --- Related products (from same categories, excluding current product) ---

export const getRelatedProducts = unstable_cache(
  async (
    productId: string,
    categoryIds: string[],
    limit = 10,
  ): Promise<StorefrontProductCard[]> => {
    if (categoryIds.length === 0) return []

    try {
      const payload = await getPayloadClient()

      const result = await payload.find({
        collection: 'products',
        overrideAccess: false,
        depth: 1,
        limit,
        sort: '-createdAt',
        where: {
          and: [
            { _status: { equals: 'published' } },
            { id: { not_equals: productId } },
            {
              or: categoryIds.map((catId) => ({
                categories: { contains: catId },
              })),
            },
          ],
        },
      })

      return result.docs.map(toProductCard)
    } catch {
      return []
    }
  },
  ['storefront-related-products'],
  { tags: [CACHE_TAG_PRODUCTS, CACHE_TAG_CATEGORIES] },
)
