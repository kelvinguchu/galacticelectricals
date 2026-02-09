'use client'

import Link from 'next/link'
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineUserCircle,
  HiOutlineClipboardDocumentList,
} from 'react-icons/hi2'

import { useStore } from '@/stores/store'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

import { OrdersSection } from './OrdersSection'
import { CartSection } from './CartSection'
import { WishlistSection } from './WishlistSection'
import { ProfileSection } from './ProfileSection'

export function AccountDashboard() {
  const { user, logout, cart, wishlist } = useStore()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  if (!user) return null

  return (
    <div className="px-3 py-6 md:px-4 md:py-10">
      <div className="mb-4 flex flex-col gap-3 border-2 border-gray-300 bg-white p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 md:mb-6">
        <div className="flex items-center gap-3">
          <HiOutlineUserCircle className="size-9 text-primary md:size-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">
              {user.roles?.join(', ') || 'User'}
            </p>
          </div>
        </div>
        <button
          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 border-2 border-gray-300 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-foreground transition-colors hover:bg-accent sm:w-auto"
          onClick={logout}
          type="button"
        >
          <HiOutlineArrowRightOnRectangle className="size-4" />
          Sign Out
        </button>
      </div>

      <Tabs defaultValue="orders">
        <TabsList
          variant="line"
          className="w-full justify-start gap-0 overflow-x-auto border-b border-border"
        >
          <TabsTrigger
            value="orders"
            className="gap-1 px-2.5 text-[11px] uppercase tracking-widest sm:gap-1.5 sm:px-4 sm:text-xs"
          >
            <HiOutlineClipboardDocumentList className="size-3.5 sm:size-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="gap-1 px-2.5 text-[11px] uppercase tracking-widest sm:gap-1.5 sm:px-4 sm:text-xs"
          >
            <HiOutlineUserCircle className="size-3.5 sm:size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="cart"
            className="gap-1 px-2.5 text-[11px] uppercase tracking-widest sm:gap-1.5 sm:px-4 sm:text-xs"
          >
            <HiOutlineShoppingBag className="size-3.5 sm:size-4" />
            Cart{cartCount > 0 ? ` (${cartCount})` : ''}
          </TabsTrigger>
          <TabsTrigger
            value="wishlist"
            className="gap-1 px-2.5 text-[11px] uppercase tracking-widest sm:gap-1.5 sm:px-4 sm:text-xs"
          >
            <HiOutlineHeart className="size-3.5 sm:size-4" />
            Wishlist{wishlist.length > 0 ? ` (${wishlist.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="pt-4">
          <OrdersSection />
        </TabsContent>

        <TabsContent value="profile" className="pt-4">
          <ProfileSection />
        </TabsContent>

        <TabsContent value="cart" className="pt-4">
          <CartSection />
        </TabsContent>

        <TabsContent value="wishlist" className="pt-4">
          <WishlistSection />
        </TabsContent>
      </Tabs>

      <div className="mt-5 md:mt-6">
        <Link
          className="inline-flex h-10 items-center justify-center bg-primary px-5 text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-opacity hover:opacity-90 md:h-11 md:px-6 md:text-sm"
          href="/"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
