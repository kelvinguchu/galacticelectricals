'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'motion/react'
import {
  HiOutlineArrowRight,
  HiOutlineSun,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineChatBubbleLeftRight,
  HiOutlineRocketLaunch,
  HiOutlineWrenchScrewdriver,
  HiOutlineHomeModern,
  HiOutlineCpuChip,
} from 'react-icons/hi2'

import { Button } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'

const coreProducts = [
  {
    icon: HiOutlineSun,
    title: 'Solar Solutions',
    description: 'High-efficiency solar panels, DC solar MCBs, and solar irrigation systems.',
  },
  {
    icon: HiOutlineCpuChip,
    title: 'Power Management',
    description:
      '63A 2P Automatic Transfer Switches (ATS), surge protectors, and prepaid energy meters.',
  },
  {
    icon: HiOutlineWrenchScrewdriver,
    title: 'Specialized Hardware',
    description: 'Concrete and wooden climbers for professional installations.',
  },
  {
    icon: HiOutlineHomeModern,
    title: 'Home Comfort',
    description: 'Premium instant showers and comprehensive electrical installation.',
  },
]

const advantages = [
  {
    icon: HiOutlineShieldCheck,
    title: 'Reliability',
    description: '10 years of proven expertise in the Nairobi hub.',
  },
  {
    icon: HiOutlineTruck,
    title: 'Logistics',
    description: 'Efficient delivery services for both local and global clients.',
  },
  {
    icon: HiOutlineChatBubbleLeftRight,
    title: 'Trust',
    description: 'A friendly, relatable customer service team and an acceptable refund policy.',
  },
  {
    icon: HiOutlineRocketLaunch,
    title: 'Speed',
    description: 'Timely responses to ensure your project never stalls.',
  },
]

const testimonials = [
  {
    name: 'James Mwangi',
    text: 'Galactic Solar installed a full system at my home in Kitengela. Very professional team and the panels are working perfectly months later.',
  },
  {
    name: 'Faith Wanjiku',
    text: 'I compared prices across Nairobi and Galactic had the best deal on inverters. Delivery was next day. Will definitely buy again.',
  },
  {
    name: 'Brian Ochieng',
    text: 'As a solar technician, I source all my equipment here. Consistent quality and they always have stock when I need it urgently.',
  },
  {
    name: 'Mary Akinyi',
    text: 'The instant shower I bought has been a game changer. Affordable and easy to install. Their customer service was very helpful.',
  },
  {
    name: 'David Kimani',
    text: 'We fitted 20 units in our rental apartments with Galactic equipment. Reliable products and they even helped with bulk pricing.',
  },
]

export function AboutUs() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero banner */}
      <section className="border-b-2 border-gray-300 bg-gray-950 py-8 md:py-12">
        <div className="mx-auto w-full px-3 md:px-6">
          <div className="flex flex-col items-center gap-4 text-center">
            <Image
              alt="Galactic Solar and Electricals"
              className="h-10 w-auto brightness-0 invert md:h-12"
              height={80}
              src="/logo.png"
              width={300}
            />
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Powering Kenya&rsquo;s <span className="text-secondary">Future</span>
            </h1>
            <p className="border-l-4 border-gray-300 bg-white/5 px-3 py-1.5 text-sm text-white/70 md:text-base">
              A leading force in renewable energy and electrical supply &mdash; 10&nbsp;years strong
              and growing.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="border-b-2 border-gray-300 bg-background py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <SectionHeading className="mb-4">Who We Are</SectionHeading>
          <p className="max-w-3xl text-sm leading-relaxed text-black/70 md:text-base">
            Based in the heart of Nairobi at Tearoom, Duruma Road, we have spent the last 10 years
            bridging the gap between expensive, unreliable power and affordable energy independence.
            We serve a diverse network of solar technicians, real estate developers, retailers, and
            end-users both locally and globally.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="border-b-2 border-gray-300 bg-gray-950 py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <div className="border-l-2 border-secondary bg-white/5 px-4 py-4 md:px-5 md:py-5">
            <p className="text-xs font-bold uppercase tracking-widest text-secondary">
              Our Mission
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
              To eliminate the burden of high electricity bills and frequent blackouts by providing
              high-quality, sustainable energy solutions. We are driven by a bold vision to build a
              &ldquo;Galactic Business Empire&rdquo; and{' '}
              <span className="font-semibold text-secondary">
                empower 1&nbsp;million customers by 2030.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Core Products & Services */}
      <section className="border-b-2 border-gray-300 bg-background py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <SectionHeading className="mb-4">Core Products &amp; Services</SectionHeading>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-3 lg:grid-cols-4">
            {coreProducts.map((item) => (
              <article key={item.title} className="border-2 border-gray-300 bg-white p-3 md:p-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 md:size-9">
                    <item.icon className="size-4 text-secondary md:size-5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-black md:text-sm">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-1.5 pl-10 text-[11px] leading-relaxed text-black/60 md:mt-2 md:pl-12 md:text-xs">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The Galactic Advantage */}
      <section className="border-b-2 border-gray-300 bg-gray-950 py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold uppercase tracking-tight text-white sm:text-3xl">
            <span
              className="inline-block h-[0.75em] w-1.5 shrink-0 bg-secondary"
              aria-hidden="true"
            />
            <span>The Galactic Advantage</span>
          </h2>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:gap-3 lg:grid-cols-4">
            {advantages.map((item) => (
              <article
                key={item.title}
                className="group border-l-2 border-secondary bg-white/5 px-3 py-3 transition-colors hover:bg-white/10 md:px-4 md:py-4"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 md:size-9">
                    <item.icon className="size-4 text-secondary md:size-5" />
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-white md:text-sm">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-1.5 pl-10 text-[11px] leading-relaxed text-white/60 md:mt-2 md:pl-12 md:text-xs">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b-2 border-gray-300 bg-white py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-3 md:px-6">
          <SectionHeading className="mb-4">What Our Customers Say</SectionHeading>
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA */}
      <section className="border-b-2 border-gray-300 bg-accent py-6 md:py-8">
        <div className="mx-auto max-w-7xl px-3 text-center md:px-6">
          <p className="text-lg font-semibold text-black md:text-xl">
            Ready to power your home or business?
          </p>
          <p className="mt-1 text-sm text-black/65">Get in touch with our team today.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Button asChild className="rounded-none border border-gray-300 px-5" size="default">
              <Link href="/contact">
                Contact Us
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

function TestimonialCarousel() {
  const [current, setCurrent] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval>>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div className="border-2 border-gray-300 bg-white p-4 md:p-6">
      <div className="relative min-h-24 md:min-h-20">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={current}
            animate={{ opacity: 1, x: 0 }}
            className="absolute inset-0"
            exit={{ opacity: 0, x: 40 }}
            initial={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <p className="border-l-4 border-gray-300 pl-3 text-sm leading-relaxed text-black/70 italic md:text-base">
              &ldquo;{testimonials[current].text}&rdquo;
            </p>
            <footer className="mt-3 pl-3 text-xs font-bold uppercase tracking-widest text-black/80 md:text-sm">
              &mdash; {testimonials[current].name}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={testimonials[i].name}
            aria-label={`Testimonial ${i + 1}`}
            className={`h-1.5 transition-all ${
              i === current ? 'w-6 bg-primary' : 'w-3 bg-gray-300'
            }`}
            onClick={() => setCurrent(i)}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}
