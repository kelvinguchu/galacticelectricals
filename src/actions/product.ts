'use server'

import { getProductDetails } from '@/lib/get-storefront-home-data'
import type { ProductDetail } from '@/lib/get-storefront-home-data'

export async function fetchProductDetails(productId: string): Promise<ProductDetail | null> {
  return getProductDetails(productId)
}
