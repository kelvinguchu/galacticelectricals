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

type AdminOrderNotificationEmailProps = {
  readonly serverUrl: string
  readonly orderNumber: string
  readonly customerEmail: string
  readonly customerPhone: string
  readonly items: OrderItem[]
  readonly total: number
  readonly shippingCity: string
}

const fmtKES = (v: number) => `KES ${Math.round(v).toLocaleString()}`

export function AdminOrderNotificationEmail({
  serverUrl,
  orderNumber,
  customerEmail,
  customerPhone,
  items,
  total,
  shippingCity,
}: AdminOrderNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        New order {orderNumber} – {fmtKES(total)}
      </Preview>
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
            <Heading style={heading}>New Order Received</Heading>

            <Section style={infoBox}>
              <Text style={infoLabel}>Order Number</Text>
              <Text style={infoValue}>{orderNumber}</Text>
              <Text style={infoAmount}>{fmtKES(total)}</Text>
            </Section>

            <Text style={paragraph}>
              <strong>Customer:</strong> {customerEmail}
            </Text>
            <Text style={paragraph}>
              <strong>Phone:</strong> {customerPhone}
            </Text>
            <Text style={paragraph}>
              <strong>City:</strong> {shippingCity}
            </Text>

            <Hr style={thinDivider} />

            <Heading as="h3" style={subHeading}>
              Items ({items.length})
            </Heading>

            {items.map((item) => (
              <Text key={item.title} style={itemText}>
                {item.quantity} &times; {item.title} — {fmtKES(item.lineTotal)}
              </Text>
            ))}

            <Section style={buttonSection}>
              <Button href={`${serverUrl}/admin/collections/orders`} style={button}>
                View in Admin
              </Button>
            </Section>
          </Section>

          <Hr style={divider} />

          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} Galactic Solar &amp; Electricals
            </Text>
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
  backgroundColor: '#ffffff',
  padding: '20px 16px',
  textAlign: 'center' as const,
  borderBottom: '3px solid #0a2742',
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
  margin: '0 0 6px',
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
  margin: '0 0 4px',
}

const infoAmount: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 700,
  color: '#0a2742',
  margin: '0',
}

const itemText: React.CSSProperties = {
  fontSize: '13px',
  color: '#1a1a1a',
  margin: '0 0 4px',
}

const thinDivider: React.CSSProperties = {
  borderColor: '#e4e4e7',
  margin: '12px 0',
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
