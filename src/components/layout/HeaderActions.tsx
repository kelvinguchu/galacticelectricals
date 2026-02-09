'use client'

import Link from 'next/link'
import { HiOutlineUserCircle } from 'react-icons/hi2'

import { useStore } from '@/stores/store'
import { CartSheet } from '@/components/layout/CartSheet'
import { WishlistSheet } from '@/components/layout/WishlistSheet'

function getInitials(user: { email: string; firstName?: string } | null): string | null {
  if (!user) return null
  if (user.firstName) return user.firstName.charAt(0).toUpperCase()
  return user.email.slice(0, 2).toUpperCase()
}

export function HeaderActions() {
  const { user } = useStore()
  const initials = getInitials(user)

  return (
    <>
      <Link
        aria-label="Account"
        className="inline-flex h-10 w-10 cursor-pointer items-center justify-center border-2 border-gray-300 bg-white text-black transition-colors hover:bg-accent"
        href="/account"
      >
        {initials ? (
          <span className="text-xs font-bold uppercase leading-none text-primary">{initials}</span>
        ) : (
          <HiOutlineUserCircle className="size-6" />
        )}
      </Link>
      <WishlistSheet />
      <CartSheet />
    </>
  )
}
