import React from 'react'
import {
  Body,
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

type OtpEmailProps = {
  readonly serverUrl: string
  readonly otp: string
  readonly userEmail: string
}

export function OtpEmail({ serverUrl, otp, userEmail }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code – Galactic Solar &amp; Electricals</Preview>
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
            <Heading style={heading}>Your Verification Code</Heading>

            <Text style={paragraph}>
              Use the code below to verify your email (<strong>{userEmail}</strong>) and proceed
              with checkout.
            </Text>

            <Section style={codeSection}>
              <Text style={codeText}>{otp}</Text>
            </Section>

            <Text style={paragraph}>This code expires in 10 minutes.</Text>

            <Text style={smallText}>
              If you did not request this code, you can safely ignore this email.
            </Text>
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
  backgroundColor: '#ffffff',
  padding: '20px 16px',
  textAlign: 'center' as const,
  borderBottom: '3px solid #048afb',
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

const paragraph: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#1a1a1a',
  margin: '0 0 12px',
}

const codeSection: React.CSSProperties = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const codeText: React.CSSProperties = {
  display: 'inline-block',
  fontSize: '28px',
  fontWeight: 700,
  letterSpacing: '0.3em',
  color: '#048afb',
  backgroundColor: '#f0f9ff',
  border: '2px solid #e4e4e7',
  padding: '14px 24px',
}

const smallText: React.CSSProperties = {
  fontSize: '12px',
  color: '#71717a',
  margin: '0 0 4px',
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
