import type { Metadata } from 'next'
import { AboutUs } from '@/components/about/AboutUs'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Galactic Solar and Electricals Ltd — 10 years of trusted solar and electrical solutions in Nairobi, Kenya.',
  alternates: { canonical: '/about' },
}

export default function AboutPage() {
  return <AboutUs />
}
