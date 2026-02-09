'use client'

import { useCallback, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { HiOutlineArrowDownTray, HiOutlineDocumentText } from 'react-icons/hi2'
import { getReceiptData } from '@/actions/receipt'
import { OrderReceipt } from './pdf/OrderReceipt'
import type { ReceiptData } from './pdf/receipt-types'

export function ReceiptDownloadButton({
  orderNumber,
  receiptData: initialReceiptData,
}: Readonly<{
  orderNumber: string
  receiptData?: ReceiptData | null
}>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = useCallback(async () => {
    setError(null)
    setLoading(true)

    try {
      let data = initialReceiptData
      data ??= await getReceiptData(orderNumber)

      if (!data) {
        setError('Could not load receipt data. Please try again.')
        setLoading(false)
        return
      }

      const logoUrl = `${globalThis.location.origin}/logo.png`
      const blob = await pdf(<OrderReceipt data={data} logoUrl={logoUrl} />).toBlob()

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Receipt-${orderNumber}.pdf`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Receipt generation failed:', err)
      setError('Failed to generate receipt. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [orderNumber, initialReceiptData])

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="flex h-10 w-full cursor-pointer items-center justify-center gap-2 border-2 border-primary bg-accent text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:text-sm"
        disabled={loading}
        onClick={handleDownload}
        type="button"
      >
        {loading ? (
          <>
            <div className="size-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            Generating...
          </>
        ) : (
          <>
            <HiOutlineArrowDownTray className="size-4" />
            Download Receipt
          </>
        )}
      </button>

      {error ? (
        <p className="text-xs text-rose-500">{error}</p>
      ) : (
        <p className="flex items-center gap-1.5 text-xs text-black/40">
          <HiOutlineDocumentText className="size-3.5" />
          Save this receipt for your records
        </p>
      )}
    </div>
  )
}
