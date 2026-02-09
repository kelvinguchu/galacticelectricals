import type { Metadata } from 'next'

import { VerifyClient } from '@/components/account/VerifyClient'

export const metadata: Metadata = {
  title: 'Verify Email – Galactic Solar & Electricals',
  description: 'Confirm your email address to activate your account.',
}

type Props = {
  readonly searchParams: Promise<{ token?: string }>
}

export default async function VerifyPage({ searchParams }: Props) {
  const { token } = await searchParams

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-3 py-6 md:px-4 md:py-10">
      <div className="w-full max-w-md border-2 border-gray-300 bg-white p-5 text-center sm:p-8">
        <h1 className="mb-3 text-base font-bold uppercase tracking-widest sm:mb-4 sm:text-xl">
          Email Verification
        </h1>
        {token ? (
          <VerifyClient token={token} />
        ) : (
          <p className="text-sm text-muted-foreground">
            No verification token provided. Please check your email for the correct link.
          </p>
        )}
      </div>
    </section>
  )
}
