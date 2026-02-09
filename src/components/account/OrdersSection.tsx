'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  HiOutlineClipboardDocumentList,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineXCircle,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
} from 'react-icons/hi2'

import { formatKES } from '@/lib/utils'
import { getMyOrders, type OrderSummary } from '@/actions/auth'
import { ReceiptDownloadButton } from '@/components/checkout/ReceiptDownloadButton'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-KE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof HiOutlineClock }> =
  {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: HiOutlineClock },
    processing: {
      label: 'Processing',
      color: 'bg-blue-100 text-blue-700',
      icon: HiOutlineClock,
    },
    paid: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: HiOutlineCheckCircle },
    shipped: { label: 'Shipped', color: 'bg-primary/10 text-primary', icon: HiOutlineTruck },
    delivered: {
      label: 'Delivered',
      color: 'bg-green-100 text-green-700',
      icon: HiOutlineCheckCircle,
    },
    failed: { label: 'Failed', color: 'bg-rose-100 text-rose-700', icon: HiOutlineXCircle },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-gray-100 text-gray-500',
      icon: HiOutlineXCircle,
    },
    refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-500', icon: HiOutlineXCircle },
  }

function StatusBadge({ status }: { readonly status: string }) {
  const cfg = statusConfig[status] || statusConfig.pending
  const Icon = cfg.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cfg.color}`}
    >
      <Icon className="size-3" />
      {cfg.label}
    </span>
  )
}

function OrderCard({ order }: { readonly order: OrderSummary }) {
  const [expanded, setExpanded] = useState(false)
  const isPaid = order.paymentStatus === 'paid'

  return (
    <div className="border-2 border-gray-300 bg-white">
      <button
        className="flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left transition-colors hover:bg-accent/30 sm:gap-3 sm:px-4 sm:py-3"
        onClick={() => setExpanded(!expanded)}
        type="button"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-bold tracking-wide text-foreground sm:text-xs">
              {order.orderNumber}
            </span>
            <StatusBadge status={order.paymentStatus} />
            <StatusBadge status={order.fulfillmentStatus} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground sm:gap-3 sm:text-[11px]">
            <span>{formatDate(order.createdAt)}</span>
            <span className="hidden sm:inline">·</span>
            <span>
              {order.itemCount} item{order.itemCount === 1 ? '' : 's'}
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="font-semibold text-foreground">{formatKES(order.total)}</span>
          </div>
        </div>
        {expanded ? (
          <HiOutlineChevronUp className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <HiOutlineChevronDown className="size-4 shrink-0 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border-t-2 border-gray-300 px-3 py-2.5 sm:px-4 sm:py-3">
          <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
            <table className="w-full min-w-85 text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-left text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  <th className="pb-2">Item</th>
                  <th className="pb-2 text-right">Qty</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.title} className="border-b border-gray-100">
                    <td className="py-1.5 pr-2">{item.title}</td>
                    <td className="py-1.5 text-right">{item.quantity}</td>
                    <td className="py-1.5 text-right">{formatKES(item.unitPrice)}</td>
                    <td className="py-1.5 text-right font-medium">{formatKES(item.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-semibold">
                  <td className="pt-2" colSpan={3}>
                    Total
                  </td>
                  <td className="pt-2 text-right">{formatKES(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {isPaid && (
            <div className="mt-3 border-t border-gray-200 pt-3">
              <ReceiptDownloadButton orderNumber={order.orderNumber} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function OrdersSection() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const data = await getMyOrders()
    setOrders(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <HiOutlineClipboardDocumentList className="size-12 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No orders yet</p>
        <Link
          className="inline-flex h-9 items-center justify-center bg-primary px-5 text-xs font-semibold uppercase tracking-widest text-primary-foreground hover:opacity-90"
          href="/"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  )
}
