import Link from 'next/link'
import { HiOutlineCheckCircle } from 'react-icons/hi2'

import { formatKES } from '@/lib/utils'

import { ReceiptDownloadButton } from './ReceiptDownloadButton'

export function SuccessStep({
  effectiveEmail,
  orderNumber,
  orderTotal,
}: Readonly<{
  effectiveEmail: string
  orderNumber: string
  orderTotal: number
}>) {
  return (
    <div className="mx-auto max-w-md">
      <div className="border-2 border-gray-300 bg-white">
        <div className="flex h-1">
          <div className="flex-1 bg-primary" />
          <div className="flex-1 bg-secondary" />
        </div>
        <div className="flex flex-col items-center gap-2.5 p-5 text-center sm:gap-3 sm:p-8">
          <HiOutlineCheckCircle className="size-12 text-emerald-500 sm:size-16" />
          <h2 className="text-base font-bold uppercase tracking-widest sm:text-lg">
            Payment Confirmed!
          </h2>

          {orderNumber ? (
            <div className="w-full border-2 border-gray-200 bg-accent p-3">
              <p className="text-xs uppercase tracking-widest text-black/50">Order Number</p>
              <p className="mt-1 text-lg font-bold text-primary">{orderNumber}</p>
            </div>
          ) : null}

          <p className="text-xs text-black/60 sm:text-sm">
            Your payment was successful and your order has been placed. A confirmation email has
            been sent to <strong className="text-black">{effectiveEmail}</strong>.
          </p>

          {orderTotal > 0 ? (
            <p className="text-xs text-black/40">
              Total: <strong>{formatKES(orderTotal)}</strong>
            </p>
          ) : null}

          {orderNumber ? (
            <div className="mt-2 w-full">
              <ReceiptDownloadButton orderNumber={orderNumber} />
            </div>
          ) : null}

          <Link
            className="mt-2 inline-flex h-11 w-full items-center justify-center bg-primary text-sm font-semibold uppercase tracking-widest text-white hover:opacity-90"
            href="/"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
