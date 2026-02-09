export type ReceiptItem = {
  title: string
  sku?: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type ReceiptPricing = {
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  currency: string
}

export type ReceiptPayment = {
  method: string
  phone?: string
  mpesaReceiptNumber?: string
  paidAt?: string
}

export type ReceiptAddress = {
  firstName: string
  lastName: string
  phone?: string
  email?: string
  addressLine1: string
  addressLine2?: string
  city: string
  county?: string
  postalCode?: string
  country?: string
}

export type ReceiptData = {
  orderNumber: string
  orderDate: string
  items: ReceiptItem[]
  pricing: ReceiptPricing
  payment: ReceiptPayment
  shippingAddress: ReceiptAddress
  customerEmail: string
}

export const COMPANY_INFO = {
  name: 'Galactic Solar & Electricals',
  phone: '0743 312 254',
  email: 'hello@galacticelectricals.com',
  location: 'Nairobi, Kenya',
} as const

export function formatReceiptKES(value: number): string {
  const rounded = Math.round(Number.isFinite(value) ? value : 0)
  return `KES ${rounded.toLocaleString('en-KE')}`
}

export function formatReceiptDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}
