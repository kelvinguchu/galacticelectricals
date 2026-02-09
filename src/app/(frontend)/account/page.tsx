'use client'

import { AuthForm } from '@/components/account/AuthForm'
import { AccountDashboard } from '@/components/account/AccountDashboard'
import { useStore } from '@/stores/store'

export default function AccountPage() {
  const { user, loading } = useStore()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin border-4 border-gray-300 border-t-primary" />
      </div>
    )
  }

  if (!user) return <AuthForm />

  return <AccountDashboard />
}
