import type { Metadata } from 'next'

import { CheckoutForm } from '@/components/checkout/CheckoutForm'
import { SectionHeading } from '@/components/ui/section-heading'

export const metadata: Metadata = {
  title: 'Checkout – Galactic Solar & Electricals',
  description: 'Complete your order',
}

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-3xl px-3 py-6 md:px-4 md:py-10">
      <SectionHeading as="h1" className="mb-4 justify-center sm:mb-6" size="md">
        Checkout
      </SectionHeading>
      <CheckoutForm />
    </main>
  )
}
