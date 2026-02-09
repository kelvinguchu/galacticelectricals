import Link from 'next/link'
import { HiOutlineTruck } from 'react-icons/hi2'

import type { CheckoutShippingAddress } from '@/actions/checkout'

import { StepHeader, ErrorBox, FieldInput } from './checkout-utils'

export function ShippingStep({
  address,
  email,
  error,
  isGuest,
  notes,
  onAddressChange,
  onEmailChange,
  onNotesChange,
  onPhoneChange,
  onSubmit,
  phone,
  submitting,
}: Readonly<{
  address: CheckoutShippingAddress
  email: string
  error: string | null
  isGuest: boolean
  notes: string
  onAddressChange: (fn: (a: CheckoutShippingAddress) => CheckoutShippingAddress) => void
  onEmailChange: (v: string) => void
  onNotesChange: (v: string) => void
  onPhoneChange: (v: string) => void
  onSubmit: () => void
  phone: string
  submitting: boolean
}>) {
  let buttonLabel = 'Review Order'
  if (submitting) {
    buttonLabel = 'Sending Code...'
  } else if (isGuest) {
    buttonLabel = 'Verify Email & Continue'
  }

  return (
    <div className="mx-auto max-w-md">
      <StepHeader icon={HiOutlineTruck} title="Shipping & Contact" />
      {error ? <ErrorBox message={error} /> : null}

      <div className="flex flex-col gap-2.5 sm:gap-3">
        {isGuest ? (
          <>
            <FieldInput
              label="Email Address"
              onChange={onEmailChange}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
            <p className="-mt-1.5 text-[11px] text-black/40">
              We&apos;ll send a verification code to confirm this email before placing your order.
              Already have an account?{' '}
              <Link className="text-primary underline" href="/account">
                Sign in
              </Link>
            </p>
          </>
        ) : null}

        <div className="grid grid-cols-2 gap-3">
          <FieldInput
            label="First Name"
            onChange={(v) => onAddressChange((a) => ({ ...a, firstName: v }))}
            placeholder="John"
            required
            value={address.firstName}
          />
          <FieldInput
            label="Last Name"
            onChange={(v) => onAddressChange((a) => ({ ...a, lastName: v }))}
            placeholder="Doe"
            required
            value={address.lastName}
          />
        </div>

        <FieldInput
          label="M-Pesa Phone Number"
          onChange={onPhoneChange}
          placeholder="07XX XXX XXX"
          required
          type="tel"
          value={phone}
        />

        <FieldInput
          label="Address Line 1"
          onChange={(v) => onAddressChange((a) => ({ ...a, addressLine1: v }))}
          placeholder="123 Moi Avenue"
          required
          value={address.addressLine1}
        />

        <FieldInput
          label="Address Line 2 (Optional)"
          onChange={(v) => onAddressChange((a) => ({ ...a, addressLine2: v }))}
          placeholder="Apt, Suite, Floor"
          value={address.addressLine2 ?? ''}
        />

        <div className="grid grid-cols-2 gap-3">
          <FieldInput
            label="City"
            onChange={(v) => onAddressChange((a) => ({ ...a, city: v }))}
            placeholder="Nairobi"
            required
            value={address.city}
          />
          <FieldInput
            label="County"
            onChange={(v) => onAddressChange((a) => ({ ...a, county: v }))}
            placeholder="Nairobi"
            required
            value={address.county}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <FieldInput
            label="Postal Code"
            onChange={(v) => onAddressChange((a) => ({ ...a, postalCode: v }))}
            placeholder="00100"
            value={address.postalCode ?? ''}
          />
          <FieldInput
            label="Country"
            onChange={(v) => onAddressChange((a) => ({ ...a, country: v }))}
            value={address.country ?? 'Kenya'}
          />
        </div>

        <div>
          <label
            className="mb-1 block text-xs font-semibold uppercase tracking-widest text-black/60"
            htmlFor="checkout-notes"
          >
            Order Notes (Optional)
          </label>
          <textarea
            className="h-20 w-full resize-none border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none"
            id="checkout-notes"
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Special delivery instructions..."
            value={notes}
          />
        </div>
      </div>

      <button
        className="mt-4 h-11 w-full cursor-pointer bg-primary text-sm font-semibold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
        disabled={submitting}
        onClick={onSubmit}
        type="button"
      >
        {buttonLabel}
      </button>
    </div>
  )
}
