import React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

type OrderItem = {
  title: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

type OrderConfirmationEmailProps = {
  readonly serverUrl: string
  readonly orderNumber: string
  readonly customerName: string
  readonly items: OrderItem[]
  readonly subtotal: number
  readonly shipping: number
  readonly total: number
  readonly shippingAddress: {
    addressLine1: string
    city: string
    county?: string
    country?: string
  }
}

const fmtKES = (v: number) => `KES ${Math.round(v).toLocaleString()}`

export function OrderConfirmationEmail({
  serverUrl,
  orderNumber,
  customerName,
  items,
  subtotal,
  shipping,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Order {orderNumber} confirmed – Galactic Solar &amp; Electricals</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Img
              alt="Galactic Solar & Electricals"
              height={44}
              src={`${serverUrl}/logo.png`}
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Heading style={heading}>Order Confirmed!</Heading>

            <Text style={paragraph}>
              Hi {customerName}, thank you for your order. We&apos;re processing it now.
            </Text>

            <Section style={infoBox}>
              <Text style={infoLabel}>Order Number</Text>
              <Text style={infoValue}>{orderNumber}</Text>
            </Section>

            <Heading as="h3" style={subHeading}>
              Items
            </Heading>

            {items.map((item) => (
              <Section key={item.title} style={itemRow}>
                <Text style={itemTitle}>
                  {item.title} &times; {item.quantity}
                </Text>
                <Text style={itemPrice}>{fmtKES(item.lineTotal)}</Text>
              </Section>
            ))}

            <Hr style={thinDivider} />

            <Section style={totalsRow}>
              <Text style={totalsLabel}>Subtotal</Text>
              <Text style={totalsValue}>{fmtKES(subtotal)}</Text>
            </Section>
            {shipping > 0 ? (
              <Section style={totalsRow}>
                <Text style={totalsLabel}>Shipping</Text>
                <Text style={totalsValue}>{fmtKES(shipping)}</Text>
              </Section>
            ) : null}
            <Section style={totalsRow}>
              <Text style={totalsBoldLabel}>Total</Text>
              <Text style={totalsBoldValue}>{fmtKES(total)}</Text>
            </Section>

            <Hr style={thinDivider} />

            <Heading as="h3" style={subHeading}>
              Delivery Address
            </Heading>
            <Text style={paragraph}>
              {shippingAddress.addressLine1}
              <br />
              {shippingAddress.city}
              {shippingAddress.county ? `, ${shippingAddress.county}` : ''}
              <br />
              {shippingAddress.country || 'Kenya'}
            </Text>

            <Section style={buttonSection}>
              <Button href={`${serverUrl}/account`} style={button}>
                View Your Orders
              </Button>
            </Section>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Galactic Solar &amp; Electricals. All rights
              reserved.
            </Text>
            <Text style={footerText}>Solar electrical solutions for everyday life.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main: React.CSSProperties = {
  backgroundColor: '#f4f4f5',
  fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif",
}

const container: React.CSSProperties = {
  maxWidth: '520px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  border: '2px solid #e4e4e7',
}

const headerSection: React.CSSProperties = {
  backgroundColor: '#048afb',
  padding: '20px 16px',
  textAlign: 'center' as const,
}

const logo: React.CSSProperties = {
  margin: '0 auto',
}

const content: React.CSSProperties = {
  padding: '24px 20px',
}

const heading: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 700,
  color: '#0a2742',
  letterSpacing: '-0.02em',
  margin: '0 0 16px',
}

const subHeading: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#0a2742',
  letterSpacing: '0.04em',
  textTransform: 'uppercase' as const,
  margin: '20px 0 8px',
}

const paragraph: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#1a1a1a',
  margin: '0 0 12px',
}

const infoBox: React.CSSProperties = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #e4e4e7',
  padding: '12px 16px',
  margin: '16px 0',
  textAlign: 'center' as const,
}

const infoLabel: React.CSSProperties = {
  fontSize: '11px',
  color: '#71717a',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  margin: '0 0 4px',
}

const infoValue: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: 700,
  color: '#048afb',
  margin: '0',
}

const itemRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0 0 6px',
}

const itemTitle: React.CSSProperties = {
  fontSize: '13px',
  color: '#1a1a1a',
  margin: '0',
}

const itemPrice: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#1a1a1a',
  margin: '0',
  textAlign: 'right' as const,
}

const thinDivider: React.CSSProperties = {
  borderColor: '#e4e4e7',
  margin: '12px 0',
}

const totalsRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  margin: '0 0 4px',
}

const totalsLabel: React.CSSProperties = {
  fontSize: '13px',
  color: '#71717a',
  margin: '0',
}

const totalsValue: React.CSSProperties = {
  fontSize: '13px',
  color: '#1a1a1a',
  margin: '0',
  textAlign: 'right' as const,
}

const totalsBoldLabel: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#0a2742',
  margin: '0',
}

const totalsBoldValue: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 700,
  color: '#0a2742',
  margin: '0',
  textAlign: 'right' as const,
}

const buttonSection: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const button: React.CSSProperties = {
  display: 'inline-block',
  backgroundColor: '#048afb',
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: 700,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.08em',
  padding: '12px 28px',
  textDecoration: 'none',
}

const divider: React.CSSProperties = {
  borderColor: '#e4e4e7',
  margin: '0',
}

const footer: React.CSSProperties = {
  padding: '16px 20px',
}

const footerText: React.CSSProperties = {
  fontSize: '11px',
  color: '#a1a1aa',
  textAlign: 'center' as const,
  margin: '0 0 4px',
}
