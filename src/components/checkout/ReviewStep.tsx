import { HiOutlineShoppingBag, HiOutlineDevicePhoneMobile } from 'react-icons/hi2'

import type { CartItem } from '@/stores/store'
import type { CheckoutShippingAddress } from '@/actions/checkout'
import { formatKES } from '@/lib/utils'

import { StepHeader, ErrorBox } from './checkout-utils'

export function ReviewStep({
  address,
  cart,
  cartTotal,
  effectiveEmail,
  error,
  onBack,
  onSubmit,
  phone,
  submitting,
}: Readonly<{
  address: CheckoutShippingAddress
  cart: CartItem[]
  cartTotal: number
  effectiveEmail: string
  error: string | null
  onBack: () => void
  onSubmit: () => void
  phone: string
  submitting: boolean
}>) {
  return (
    <div className="mx-auto max-w-md">
      <StepHeader icon={HiOutlineShoppingBag} title="Review Your Order" />
      {error ? <ErrorBox message={error} /> : null}

      <div className="mb-4 border-2 border-gray-300 bg-white">
        <div className="border-b border-gray-200 p-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-black/50">
            Deliver to
          </p>
          <p className="mt-1 text-sm font-semibold">
            {address.firstName} {address.lastName}
          </p>
          <p className="text-xs text-black/60">
            {address.addressLine1}, {address.city}
          </p>
          <p className="text-xs text-black/60">
            {effectiveEmail} · {phone}
          </p>
        </div>

        <ul className="divide-y divide-gray-200">
          {cart.map((item) => {
            const price = item.salePrice ?? item.price
            return (
              <li key={item.productId} className="flex items-center gap-2 p-2.5 sm:gap-3 sm:p-3">
                <div className="flex size-10 shrink-0 items-center justify-center border border-gray-200 bg-accent sm:size-12">
                  {item.imageUrl ? (
                    <img
                      alt={item.title}
                      className="h-full w-full object-contain"
                      src={item.imageUrl}
                    />
                  ) : (
                    <HiOutlineShoppingBag className="size-5 text-black/20" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="line-clamp-1 text-xs font-semibold">{item.title}</p>
                  <p className="text-xs text-black/50">
                    {item.quantity} × {formatKES(price)}
                  </p>
                </div>
                <p className="text-xs font-semibold">{formatKES(price * item.quantity)}</p>
              </li>
            )
          })}
        </ul>

        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold uppercase tracking-widest">Total</span>
            <span className="text-base font-bold">{formatKES(cartTotal)}</span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-start gap-2 border-2 border-amber-200 bg-amber-50 p-3">
        <HiOutlineDevicePhoneMobile className="mt-0.5 size-5 shrink-0 text-amber-600" />
        <p className="text-xs leading-relaxed text-amber-800">
          After placing your order, an M-Pesa payment prompt will be sent to{' '}
          <strong>{phone}</strong>. Enter your PIN to pay.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          className="h-11 flex-1 cursor-pointer border-2 border-gray-300 bg-white text-sm font-semibold uppercase tracking-widest text-black hover:bg-accent"
          onClick={onBack}
          type="button"
        >
          Back
        </button>
        <button
          className="h-11 flex-1 cursor-pointer bg-primary text-sm font-semibold uppercase tracking-widest text-white hover:opacity-90 disabled:opacity-50"
          disabled={submitting}
          onClick={onSubmit}
          type="button"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
