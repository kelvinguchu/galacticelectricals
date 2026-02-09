'use client'

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

import { getMe, loginAction, registerAction, logoutAction } from '@/actions/auth'
import {
  mergeOnLogin,
  saveUserCart,
  saveUserWishlist,
  loadUserCartWishlist,
} from '@/actions/cart-wishlist'

type ShippingAddress = {
  addressLine1?: string
  addressLine2?: string
  city?: string
  county?: string
  postalCode?: string
  country?: string
}

type AuthUser = {
  id: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  roles: string[]
  shippingAddress?: ShippingAddress
} | null

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

export type ProductInfo = {
  id: string
  title: string
  imageUrl: string | null
  price: number
  salePrice: number | null
}

type StoreState = {
  user: AuthUser
  cart: CartItem[]
  wishlist: WishlistItem[]
  loading: boolean
  _hydrated: boolean
}

type StoreActions = {
  hydrate: () => void
  login: (email: string, password: string) => Promise<string | null>
  register: (data: {
    email: string
    password: string
    confirmPassword: string
    firstName: string
    lastName: string
    phone: string
  }) => Promise<string | null>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  addToCart: (product: ProductInfo, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleWishlist: (product: ProductInfo) => void
  clearWishlist: () => void
  isInWishlist: (productId: string) => boolean
  isInCart: (productId: string) => boolean
}

type Store = StoreState & StoreActions

const CART_KEY = 'ge_cart'
const WISHLIST_KEY = 'ge_wishlist'

function loadLS<T>(key: string): T | null {
  if (globalThis.window === undefined) return null
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function saveLS(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota exceeded */
  }
}

function clearLS(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    /* noop */
  }
}

export const useStore = create<Store>()(
  subscribeWithSelector((set, get) => ({
    user: null,
    cart: [],
    wishlist: [],
    loading: true,
    _hydrated: false,

    hydrate: () => {
      if (get()._hydrated) return
      set({ _hydrated: true })

      const cart = loadLS<CartItem[]>(CART_KEY) ?? []
      const wishlist = loadLS<WishlistItem[]>(WISHLIST_KEY) ?? []
      set({ cart, wishlist })

      getMe()
        .then(async (u) => {
          if (u) {
            // Logged-in: DB is the source of truth
            const data = await loadUserCartWishlist()
            set({ user: u, cart: data.cart, wishlist: data.wishlist, loading: false })
          } else {
            set({ user: null, loading: false })
          }
        })
        .catch(() => {
          set({ user: null, loading: false })
        })
    },

    login: async (email, password) => {
      const result = await loginAction(email, password)
      if (!result.success) {
        if (result.verifyEmail) return '__verify__'
        return result.error ?? 'Login failed'
      }

      const user = result.user ?? null
      set({ user })
      if (user) {
        // Merge localStorage items into user's DB profile
        const localCart = loadLS<CartItem[]>(CART_KEY) ?? []
        const localWishlist = loadLS<WishlistItem[]>(WISHLIST_KEY) ?? []
        const merged = await mergeOnLogin(localCart, localWishlist)

        // Clear localStorage — DB is now the source of truth
        clearLS(CART_KEY)
        clearLS(WISHLIST_KEY)

        set({ cart: merged.cart, wishlist: merged.wishlist })
      }
      return null
    },

    register: async (data) => {
      const result = await registerAction(data)
      if (!result.success) {
        if (result.fieldErrors) {
          const first = Object.values(result.fieldErrors)[0]
          return first ?? 'Registration failed'
        }
        return result.error ?? 'Registration failed'
      }
      if (result.verifyEmail) return '__verify__'
      return null
    },

    logout: async () => {
      // Persist current cart/wishlist to DB before logging out
      const { cart, wishlist } = get()
      await Promise.all([saveUserCart(cart), saveUserWishlist(wishlist)]).catch(() => {})
      await logoutAction()
      set({ user: null, cart: [], wishlist: [] })
      clearLS(CART_KEY)
      clearLS(WISHLIST_KEY)
    },

    refreshUser: async () => {
      const u = await getMe()
      if (u) set({ user: u })
    },

    addToCart: (product, quantity = 1) => {
      set((state) => {
        const existing = state.cart.find((i) => i.productId === product.id)
        if (existing) {
          return {
            cart: state.cart.map((i) =>
              i.productId === product.id ? { ...i, quantity: i.quantity + quantity } : i,
            ),
          }
        }
        return {
          cart: [
            ...state.cart,
            {
              productId: product.id,
              title: product.title,
              imageUrl: product.imageUrl,
              price: product.price,
              salePrice: product.salePrice,
              quantity,
            },
          ],
        }
      })
    },

    removeFromCart: (productId) => {
      set((state) => ({ cart: state.cart.filter((i) => i.productId !== productId) }))
    },

    updateCartQuantity: (productId, quantity) => {
      if (quantity <= 0) {
        set((state) => ({ cart: state.cart.filter((i) => i.productId !== productId) }))
        return
      }
      set((state) => ({
        cart: state.cart.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
      }))
    },

    clearCart: () => {
      set({ cart: [] })
      if (get().user) saveUserCart([]).catch(() => {})
    },

    toggleWishlist: (product) => {
      set((state) => {
        const exists = state.wishlist.find((i) => i.productId === product.id)
        if (exists) {
          return { wishlist: state.wishlist.filter((i) => i.productId !== product.id) }
        }
        return {
          wishlist: [
            ...state.wishlist,
            {
              productId: product.id,
              title: product.title,
              imageUrl: product.imageUrl,
              price: product.price,
              salePrice: product.salePrice,
            },
          ],
        }
      })
    },

    clearWishlist: () => {
      set({ wishlist: [] })
      if (get().user) saveUserWishlist([]).catch(() => {})
    },

    isInWishlist: (productId) => get().wishlist.some((i) => i.productId === productId),

    isInCart: (productId) => get().cart.some((i) => i.productId === productId),
  })),
)

// Persist cart and wishlist to localStorage on every change
let _cartSyncTimer: ReturnType<typeof setTimeout> | null = null
let _wishlistSyncTimer: ReturnType<typeof setTimeout> | null = null

if (globalThis.window !== undefined) {
  useStore.subscribe(
    (state) => state.cart,
    (cart) => {
      if (useStore.getState().user) {
        // Logged-in: debounced DB save
        if (_cartSyncTimer) clearTimeout(_cartSyncTimer)
        _cartSyncTimer = setTimeout(() => {
          saveUserCart(cart).catch(() => {})
        }, 1500)
      } else {
        // Guest: localStorage
        saveLS(CART_KEY, cart)
      }
    },
  )
  useStore.subscribe(
    (state) => state.wishlist,
    (wishlist) => {
      if (useStore.getState().user) {
        if (_wishlistSyncTimer) clearTimeout(_wishlistSyncTimer)
        _wishlistSyncTimer = setTimeout(() => {
          saveUserWishlist(wishlist).catch(() => {})
        }, 1500)
      } else {
        saveLS(WISHLIST_KEY, wishlist)
      }
    },
  )
}

// Derived selectors
export const useCartCount = () => useStore((s) => s.cart.reduce((sum, i) => sum + i.quantity, 0))
export const useWishlistCount = () => useStore((s) => s.wishlist.length)
