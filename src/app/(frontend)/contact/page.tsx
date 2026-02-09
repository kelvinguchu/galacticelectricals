import type { Metadata } from 'next'
import { ContactPage } from '@/components/contact/ContactPage'

export const metadata: Metadata = {
  title: 'Contact Us – Galactic Solar & Electricals',
  description:
    'Get in touch with Galactic Solar and Electricals Ltd. Visit us on Duruma Road, Nairobi, or call +254 743 312 254.',
}

export default function Contact() {
  return <ContactPage />
}
