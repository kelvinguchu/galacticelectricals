'use server'

import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export type CartItem = {
  productId: string
  title: string
  imageUrl: string | null
  price: number
  salePrice: number | null
  quantity: number
}

export type WishlistItem = {
  productId: string
  title: string
  imageUrl: string | null
  price: number
  salePrice: number | null
}

async function getAuthUser() {
  const payload = await getPayload({ config })
  const headers = await getHeaders()
  const { user } = await payload.auth({ headers })
  return user ? { payload, userId: user.id } : null
}

function mergeCartItems(local: CartItem[], db: CartItem[]): CartItem[] {
  const merged = [...db]
  for (const item of local) {
    const existing = merged.find((i) => i.productId === item.productId)
    if (existing) {
      existing.quantity = Math.max(existing.quantity, item.quantity)
    } else {
      merged.push(item)
    }
  }
  return merged
}

function mergeWishlistItems(local: WishlistItem[], db: WishlistItem[]): WishlistItem[] {
  const merged = [...db]
  for (const item of local) {
    if (!merged.some((i) => i.productId === item.productId)) {
      merged.push(item)
    }
  }
  return merged
}

/**
 * Merge localStorage cart & wishlist into the user's DB profile on login.
 * Returns the merged result (single findByID + single update).
 */
export async function mergeOnLogin(
  localCart: CartItem[],
  localWishlist: WishlistItem[],
): Promise<{ cart: CartItem[]; wishlist: WishlistItem[] }> {
  const auth = await getAuthUser()
  if (!auth) return { cart: localCart, wishlist: localWishlist }

  const user = await auth.payload.findByID({
    collection: 'users',
    id: auth.userId,
    depth: 0,
  })

  const dbCart = Array.isArray(user.cart) ? (user.cart as CartItem[]) : []
  const dbWishlist = Array.isArray(user.wishlist) ? (user.wishlist as WishlistItem[]) : []

  const mergedCart = mergeCartItems(localCart, dbCart)
  const mergedWishlist = mergeWishlistItems(localWishlist, dbWishlist)

  await auth.payload.update({
    collection: 'users',
    id: auth.userId,
    data: { cart: mergedCart, wishlist: mergedWishlist },
  })

  return { cart: mergedCart, wishlist: mergedWishlist }
}

/** Save cart to the authenticated user's DB profile. */
export async function saveUserCart(cart: CartItem[]): Promise<void> {
  const auth = await getAuthUser()
  if (!auth) return

  await auth.payload.update({
    collection: 'users',
    id: auth.userId,
    data: { cart },
  })
}

/** Save wishlist to the authenticated user's DB profile. */
export async function saveUserWishlist(wishlist: WishlistItem[]): Promise<void> {
  const auth = await getAuthUser()
  if (!auth) return

  await auth.payload.update({
    collection: 'users',
    id: auth.userId,
    data: { wishlist },
  })
}

/** Load cart & wishlist from the authenticated user's DB profile. */
export async function loadUserCartWishlist(): Promise<{
  cart: CartItem[]
  wishlist: WishlistItem[]
}> {
  const auth = await getAuthUser()
  if (!auth) return { cart: [], wishlist: [] }

  const user = await auth.payload.findByID({
    collection: 'users',
    id: auth.userId,
    depth: 0,
  })

  return {
    cart: Array.isArray(user.cart) ? (user.cart as CartItem[]) : [],
    wishlist: Array.isArray(user.wishlist) ? (user.wishlist as WishlistItem[]) : [],
  }
}
