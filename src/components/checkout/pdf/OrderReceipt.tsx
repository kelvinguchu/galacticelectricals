'use client'

import { Document, Page, View, Text, Image } from '@react-pdf/renderer'
import { styles } from './receipt-styles'
import {
  type ReceiptData,
  COMPANY_INFO,
  formatReceiptKES,
  formatReceiptDate,
} from './receipt-types'

export function OrderReceipt({ data, logoUrl }: Readonly<{ data: ReceiptData; logoUrl?: string }>) {
  const { orderNumber, orderDate, items, pricing, payment, shippingAddress, customerEmail } = data

  return (
    <Document
      author={COMPANY_INFO.name}
      creator={COMPANY_INFO.name}
      title={`Receipt – ${orderNumber}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.brandBlock}>
            {logoUrl ? <Image src={logoUrl} style={styles.brandLogo} /> : null}
            <Text style={styles.brandTagline}>Solar · Inverters · Batteries · Electrical</Text>
          </View>
          <Text style={styles.receiptLabel}>RECEIPT</Text>
        </View>

        {/* Accent bar */}
        <View style={styles.accentBar}>
          <View style={styles.accentPrimary} />
          <View style={styles.accentSecondary} />
          <View style={styles.accentPrimary} />
          <View style={styles.accentSecondary} />
        </View>

        {/* Order meta */}
        <View style={styles.orderMetaRow}>
          <View style={styles.orderMetaItem}>
            <Text style={styles.orderMetaLabel}>Order Number</Text>
            <Text style={styles.orderMetaValue}>{orderNumber}</Text>
          </View>
          <View style={styles.orderMetaItem}>
            <Text style={styles.orderMetaLabel}>Date</Text>
            <Text style={styles.orderMetaValue}>{formatReceiptDate(orderDate)}</Text>
          </View>
          <View style={styles.orderMetaItem}>
            <Text style={styles.orderMetaLabel}>Payment</Text>
            <Text style={styles.orderMetaValue}>
              {payment.method === 'mpesa' ? 'M-Pesa' : payment.method}
            </Text>
          </View>
        </View>

        {/* From / To */}
        <View style={styles.infoRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>From</Text>
            <Text style={styles.infoValueBold}>{COMPANY_INFO.name}</Text>
            <Text style={styles.infoValue}>{COMPANY_INFO.phone}</Text>
            <Text style={styles.infoValue}>{COMPANY_INFO.email}</Text>
            <Text style={styles.infoValue}>{COMPANY_INFO.location}</Text>
          </View>
          <View style={styles.infoBlockRight}>
            <Text style={styles.infoLabel}>Bill To</Text>
            <Text style={styles.infoValueBold}>
              {shippingAddress.firstName} {shippingAddress.lastName}
            </Text>
            <Text style={styles.infoValue}>{shippingAddress.addressLine1}</Text>
            {shippingAddress.addressLine2 ? (
              <Text style={styles.infoValue}>{shippingAddress.addressLine2}</Text>
            ) : null}
            <Text style={styles.infoValue}>
              {shippingAddress.city}
              {shippingAddress.county ? `, ${shippingAddress.county}` : ''}
            </Text>
            {shippingAddress.postalCode ? (
              <Text style={styles.infoValue}>{shippingAddress.postalCode}</Text>
            ) : null}
            <Text style={styles.infoValue}>{shippingAddress.country || 'Kenya'}</Text>
            <Text style={styles.infoValue}>{customerEmail}</Text>
            {shippingAddress.phone ? (
              <Text style={styles.infoValue}>{shippingAddress.phone}</Text>
            ) : null}
          </View>
        </View>

        {/* Items table header */}
        <View style={styles.tableHeader}>
          <View style={styles.colItem}>
            <Text style={styles.tableHeaderText}>Item</Text>
          </View>
          <View style={styles.colQty}>
            <Text style={styles.tableHeaderText}>Qty</Text>
          </View>
          <View style={styles.colPrice}>
            <Text style={styles.tableHeaderText}>Price</Text>
          </View>
          <View style={styles.colTotal}>
            <Text style={styles.tableHeaderText}>Total</Text>
          </View>
        </View>

        {/* Items */}
        {items.map((item, idx) => (
          <View
            key={`${item.title}-${item.sku ?? ''}-${item.quantity}`}
            style={idx % 2 === 1 ? styles.tableRowAlt : styles.tableRow}
          >
            <View style={styles.colItem}>
              <Text style={styles.cellTextBold}>{item.title}</Text>
              {item.sku ? <Text style={styles.cellTextMuted}>SKU: {item.sku}</Text> : null}
            </View>
            <View style={styles.colQty}>
              <Text style={styles.cellText}>{item.quantity}</Text>
            </View>
            <View style={styles.colPrice}>
              <Text style={styles.cellText}>{formatReceiptKES(item.unitPrice)}</Text>
            </View>
            <View style={styles.colTotal}>
              <Text style={styles.cellTextBold}>{formatReceiptKES(item.lineTotal)}</Text>
            </View>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totalsBlock}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatReceiptKES(pricing.subtotal)}</Text>
          </View>

          {pricing.shipping > 0 ? (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalValue}>{formatReceiptKES(pricing.shipping)}</Text>
            </View>
          ) : null}

          {pricing.tax > 0 ? (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>{formatReceiptKES(pricing.tax)}</Text>
            </View>
          ) : null}

          {pricing.discount > 0 ? (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>-{formatReceiptKES(pricing.discount)}</Text>
            </View>
          ) : null}

          <View style={styles.totalDivider} />

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>TOTAL</Text>
            <Text style={styles.grandTotalValue}>{formatReceiptKES(pricing.total)}</Text>
          </View>
        </View>

        {/* Payment details */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Details</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Method</Text>
            <Text style={styles.paymentValue}>
              {payment.method === 'mpesa' ? 'M-Pesa' : payment.method}
            </Text>
          </View>
          {payment.phone ? (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Phone</Text>
              <Text style={styles.paymentValue}>{payment.phone}</Text>
            </View>
          ) : null}
          {payment.mpesaReceiptNumber ? (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>M-Pesa Receipt</Text>
              <Text style={styles.paymentValue}>{payment.mpesaReceiptNumber}</Text>
            </View>
          ) : null}
          {payment.paidAt ? (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Paid On</Text>
              <Text style={styles.paymentValue}>{formatReceiptDate(payment.paidAt)}</Text>
            </View>
          ) : null}
          <View style={styles.paymentBadge}>
            <Text style={styles.paymentBadgeText}>Paid</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <View style={styles.footerDivider}>
            <View style={styles.accentPrimary} />
            <View style={styles.accentSecondary} />
          </View>
          <Text style={styles.footerBold}>Thank you for your purchase!</Text>
          <Text style={styles.footerText}>
            {COMPANY_INFO.name} · {COMPANY_INFO.phone} · {COMPANY_INFO.email} ·{' '}
            {COMPANY_INFO.location}
          </Text>
          <Text style={styles.footerText}>
            Please keep this receipt for your records. For any queries, contact us at{' '}
            {COMPANY_INFO.email}
          </Text>
        </View>
      </Page>
    </Document>
  )
}
