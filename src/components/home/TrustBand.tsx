import {
  HiOutlineBolt,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
  HiOutlineTruck,
} from 'react-icons/hi2'

const items = [
  {
    icon: HiOutlineShieldCheck,
    title: 'Original Products',
    text: 'Verified electrical and solar brands only.',
  },
  {
    icon: HiOutlineTruck,
    title: 'Countrywide Delivery',
    text: 'Quick dispatch from Nairobi to all counties.',
  },
  {
    icon: HiOutlineCreditCard,
    title: 'M-Pesa Payments',
    text: 'Smooth checkout with secure transaction flow.',
  },
  {
    icon: HiOutlineBolt,
    title: 'Installer Ready',
    text: 'Products selected for home and project installs.',
  },
]

export function TrustBand() {
  return (
    <section className="bg-gray-950 py-6 md:py-8">
      <div className="mx-auto grid max-w-7xl gap-3 px-3 grid-cols-2 sm:grid-cols-2 md:gap-4 md:px-6 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.title}
            className="group relative overflow-hidden border-l-2 border-secondary bg-white/5 px-3 py-3 transition-colors hover:bg-white/10 md:px-4 md:py-4"
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
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
