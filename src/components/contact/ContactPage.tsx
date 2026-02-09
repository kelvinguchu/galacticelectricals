import Link from 'next/link'
import {
  HiOutlineArrowRight,
  HiOutlineBolt,
  HiOutlineClock,
  HiOutlineEnvelope,
  HiOutlineMapPin,
  HiOutlinePhone,
} from 'react-icons/hi2'

import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa6'

import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'

const contactDetails = [
  {
    icon: HiOutlineMapPin,
    title: 'Our Location',
    content: 'KAP Guests House / Tearoom Coast Bus, Along Duruma Road, Nairobi, Kenya',
  },
  {
    icon: HiOutlinePhone,
    title: 'Phone / WhatsApp',
    content: '+254 743 312 254',
    href: 'tel:+254743312254',
  },
  {
    icon: HiOutlineEnvelope,
    title: 'Email',
    content: 'galacticsolarelectricals@gmail.com',
    href: 'mailto:galacticsolarelectricals@gmail.com',
  },
  {
    icon: HiOutlineBolt,
    title: 'Postal Address',
    content: 'P.O. Box 9267-00200, Nairobi',
  },
  {
    icon: HiOutlineClock,
    title: 'Business Hours',
    content: 'Mon \u2013 Sat: 8:00 AM \u2013 6:00 PM',
  },
]

const socials = [
  {
    icon: FaFacebookF,
    label: 'Facebook',
    href: 'https://www.facebook.com/p/Galactic-Solar-and-Electricals-61559262567196/',
  },
  {
    icon: FaInstagram,
    label: 'Instagram',
    href: 'https://www.instagram.com/galactic_solar_electricals',
  },
  { icon: FaTiktok, label: 'TikTok', href: 'https://www.tiktok.com/@galactic.solar' },
  { icon: FaWhatsapp, label: 'WhatsApp', href: 'https://wa.me/254743312254' },
]

export function ContactPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Header */}
      <section className="border-b-2 border-gray-300 bg-gray-950 py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Get in <span className="text-secondary">Touch</span>
            </h1>
            <p className="max-w-lg border-l-4 border-gray-300 bg-white/5 px-3 py-1.5 text-sm text-white/70 md:text-base">
              Visit our shop, give us a call, or send us a message.
            </p>
          </div>
        </div>
      </section>

      {/* Contact details grid */}
      <section className="border-b-2 border-gray-300 bg-background py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <SectionHeading className="mb-4">Contact Details</SectionHeading>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-3 lg:grid-cols-5">
            {contactDetails.map((item) => (
              <article key={item.title} className="border-2 border-gray-300 bg-white p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 md:size-9">
                    <item.icon className="size-4 text-secondary md:size-5" />
                  </div>
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-black/65 md:text-xs">
                    {item.title}
                  </h3>
                </div>
                <div className="mt-1.5 pl-10 md:mt-2 md:pl-12">
                  {item.href ? (
                    <a
                      className="text-xs leading-relaxed text-black/70 transition-colors hover:text-primary md:text-sm"
                      href={item.href}
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-xs leading-relaxed text-black/70 md:text-sm">
                      {item.content}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Socials strip */}
      <section className="border-b-2 border-gray-300 bg-gray-950 py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">
              Follow us
            </span>
            {socials.map((s) => (
              <a
                key={s.label}
                aria-label={s.label}
                className="inline-flex size-9 items-center justify-center border-2 border-white/10 bg-white/5 text-white/70 transition-colors hover:border-secondary hover:bg-secondary/15 hover:text-secondary"
                href={s.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="border-b-2 border-gray-300 bg-white">
        <div className="mx-auto max-w-7xl md:px-6 md:py-8">
          <div className="border-0 md:border-2 md:border-gray-300">
            <iframe
              allowFullScreen
              className="h-80 w-full md:h-96"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3988.819289443417!2d36.8278735!3d-1.28221128!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f113f7624ec8b%3A0x9d6959cec21a9704!2sGALACTIC%20SOLAR%20AND%20ELECTRICALS%20LTD!5e0!3m2!1sen!2ske!4v1770669140996!5m2!1sen!2ske"
              title="Galactic Solar and Electricals location"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b-2 border-gray-300 bg-accent py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-3 text-center md:px-6">
          <p className="text-lg font-semibold text-black md:text-xl">
            Want to learn more about us?
          </p>
          <p className="mt-1 text-sm text-black/65">
            Discover our story and what drives our mission.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Button asChild className="rounded-none border border-gray-300 px-5" size="default">
              <Link href="/about">
                About Us
                <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              className="rounded-none border-gray-300 bg-white px-5 text-black hover:bg-accent"
              size="default"
              variant="outline"
            >
              <Link href="/products">
                Shop Products
                <HiOutlineArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
