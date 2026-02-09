'use client'

import Link from 'next/link'
import Image from 'next/image'
import { HiOutlineBolt, HiOutlineEnvelope, HiOutlineMapPin, HiOutlinePhone } from 'react-icons/hi2'
import { FaFacebookF, FaTiktok } from 'react-icons/fa6'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useIsMobile } from '@/hooks/use-mobile'

const shopLinks = [
  { label: 'Solar Kits', href: '#shop' },
  { label: 'Inverters', href: '#shop' },
  { label: 'Batteries', href: '#shop' },
  { label: 'Wiring & Cables', href: '#shop' },
  { label: 'Lighting', href: '#shop' },
]

const companyLinks = [
  { label: 'About Us', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'Warranty Policy', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
]

const supportLinks = [
  { label: 'Shipping Info', href: '#' },
  { label: 'Returns & Refunds', href: '#' },
  { label: 'Order Tracking', href: '#' },
  { label: 'Help Center', href: '#' },
  { label: 'FAQs', href: '#' },
]

const socials = [
  {
    icon: FaFacebookF,
    label: 'Facebook',
    href: 'https://www.facebook.com/p/Galactic-Solar-and-Electricals-61559262567196/',
  },
  { icon: FaTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@galactic.solar' },
]

export function Footer() {
  const isMobile = useIsMobile()

  return (
    <footer className="bg-gray-950 text-white">
      {/* Top accent stripe */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-primary" />
        <div className="flex-1 bg-secondary" />
        <div className="flex-1 bg-primary" />
        <div className="flex-1 bg-secondary" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
        {/* Main grid */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand column — always visible */}
          <div className="space-y-4">
            <Link className="inline-block" href="/">
              <Image
                alt="Galactic Solar and Electricals"
                className="h-10 w-auto brightness-0 invert"
                height={80}
                src="/logo.png"
                width={300}
              />
            </Link>
            <p className="text-sm leading-relaxed text-white/70">
              Your trusted source for solar systems, inverters, batteries, and electrical equipment
              across Kenya.
            </p>
            <div className="space-y-2 text-sm">
              <a
                className="flex items-center gap-2.5 text-white/80 transition-colors hover:text-secondary"
                href="tel:+254743312254"
              >
                <HiOutlinePhone className="size-4 shrink-0 text-secondary" />
                0743 312 254
              </a>
              <a
                className="flex items-center gap-2.5 text-white/80 transition-colors hover:text-secondary"
                href="mailto:hello@galacticelectricals.com"
              >
                <HiOutlineEnvelope className="size-4 shrink-0 text-secondary" />
                hello@galacticelectricals.com
              </a>
              <p className="flex items-center gap-2.5 text-white/80">
                <HiOutlineMapPin className="size-4 shrink-0 text-secondary" />
                Nairobi, Kenya
              </p>
            </div>
          </div>

          {/* Link columns — accordion on mobile, regular on desktop */}
          {isMobile ? (
            <div className="md:hidden">
              <Accordion type="multiple">
                <AccordionItem className="border-white/10" value="shop">
                  <AccordionTrigger className="py-3 text-xs font-bold uppercase tracking-widest text-secondary hover:no-underline">
                    <span className="flex items-center gap-2">
                      <HiOutlineBolt className="size-3.5" />
                      Shop
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {shopLinks.map((item) => (
                        <li key={item.label}>
                          <Link
                            className="text-sm text-white/70 transition-colors hover:text-white"
                            href={item.href}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem className="border-white/10" value="company">
                  <AccordionTrigger className="py-3 text-xs font-bold uppercase tracking-widest text-secondary hover:no-underline">
                    Company
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {companyLinks.map((item) => (
                        <li key={item.label}>
                          <Link
                            className="text-sm text-white/70 transition-colors hover:text-white"
                            href={item.href}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem className="border-white/10" value="support">
                  <AccordionTrigger className="py-3 text-xs font-bold uppercase tracking-widest text-secondary hover:no-underline">
                    Support
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {supportLinks.map((item) => (
                        <li key={item.label}>
                          <Link
                            className="text-sm text-white/70 transition-colors hover:text-white"
                            href={item.href}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <>
              {/* Shop links */}
              <div className="hidden md:block">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
                  <HiOutlineBolt className="size-3.5" />
                  Shop
                </h3>
                <ul className="space-y-2">
                  {shopLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        className="text-sm text-white/70 transition-colors hover:text-white"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company links */}
              <div className="hidden md:block">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-secondary">
                  Company
                </h3>
                <ul className="space-y-2">
                  {companyLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        className="text-sm text-white/70 transition-colors hover:text-white"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support links */}
              <div className="hidden md:block">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-secondary">
                  Support
                </h3>
                <ul className="space-y-2">
                  {supportLinks.map((item) => (
                    <li key={item.label}>
                      <Link
                        className="text-sm text-white/70 transition-colors hover:text-white"
                        href={item.href}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-white/10" />

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} Galactic Solar &amp; Electricals. All rights reserved.
          </p>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                aria-label={s.label}
                className="inline-flex size-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-primary hover:text-white"
                href={s.href}
              >
                <s.icon className="size-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
