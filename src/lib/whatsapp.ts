import { formatKES } from '@/lib/utils'

const FALLBACK_ORIGIN = process.env.NEXT_PUBLIC_SERVER_URL || 'https://galacticelectricals.com'

export const WHATSAPP_NUMBER = (
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254743312254'
).replace(/\D/g, '')

export const DEFAULT_WHATSAPP_MESSAGE = 'Hi Galactic, I am interested in your products'

export type CartMessageItem = {
  title: string
  quantity: number
  price: number
  salePrice: number | null
  slug?: string | null
}

const normalizeTitle = (value: string) => value.replace(/\s+/g, ' ').trim()

export const getStorefrontOrigin = () => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return FALLBACK_ORIGIN
}

const buildProductURL = (item: CartMessageItem, origin: string) => {
  if (item.slug) {
    return `${origin}/products/${encodeURIComponent(item.slug)}`
  }

  return `${origin}/products?q=${encodeURIComponent(normalizeTitle(item.title))}`
}

export const buildWhatsAppHref = (message: string, number = WHATSAPP_NUMBER) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`

export function buildCartWhatsAppMessage(
  items: CartMessageItem[],
  total: number,
  origin = getStorefrontOrigin(),
) {
  if (!items.length) return DEFAULT_WHATSAPP_MESSAGE

  const lines = ['Hi Galactic, I would like to order these items:', '']

  items.forEach((item, index) => {
    const unitPrice = item.salePrice ?? item.price
    const link = buildProductURL(item, origin)

    lines.push(`${index + 1}. ${item.title}`)
    lines.push(`Qty: ${item.quantity}`)
    lines.push(`Unit Price: ${formatKES(unitPrice)}`)
    lines.push(`Link: ${link}`)
    lines.push('')
  })

  lines.push(`Cart Total: ${formatKES(total)}`)
  lines.push('Please confirm availability and delivery details.')

  return lines.join('\n')
}
