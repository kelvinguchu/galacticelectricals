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

type VerifyEmailProps = {
  readonly serverUrl: string
  readonly token: string
  readonly userEmail: string
}

export function VerifyEmail({ serverUrl, token, userEmail }: VerifyEmailProps) {
  const verifyUrl = `${serverUrl}/verify?token=${token}`

  return (
    <Html>
      <Head />
      <Preview>Verify your email – Galactic Solar &amp; Electricals</Preview>
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
            <Heading style={heading}>Verify Your Email</Heading>

            <Text style={paragraph}>
              Hello! Thanks for creating an account with Galactic Solar &amp; Electricals.
            </Text>
            <Text style={paragraph}>
              Please confirm your email address (<strong>{userEmail}</strong>) by clicking the
              button below:
            </Text>

            <Section style={buttonSection}>
              <Button href={verifyUrl} style={button}>
                Verify Email Address
              </Button>
            </Section>

            <Text style={smallText}>
              If the button doesn&apos;t work, copy and paste this link into your browser:
            </Text>
            <Text style={linkText}>{verifyUrl}</Text>
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

const smallText: React.CSSProperties = {
  fontSize: '12px',
  color: '#71717a',
  margin: '0 0 4px',
}

const linkText: React.CSSProperties = {
  fontSize: '12px',
  color: '#048afb',
  wordBreak: 'break-all' as const,
  margin: '0 0 12px',
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
