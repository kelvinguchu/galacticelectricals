import type { Metadata } from 'next'
import { AboutUs } from '@/components/about/AboutUs'

export const metadata: Metadata = {
  title: 'About Us – Galactic Solar & Electricals',
  description:
    'Learn about Galactic Solar and Electricals Ltd — 10 years of trusted solar and electrical solutions in Nairobi, Kenya.',
}

export default function AboutPage() {
  return <AboutUs />
}
