export const siteConfig = {
  name: 'Galactic Solar & Electricals',
  shortName: 'Galactic Electricals',
  url: process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.galacticelectricals.com',
  description:
    'Shop solar panels, inverters, batteries & electrical equipment. Fast delivery across Kenya. Order on WhatsApp.',
  locale: 'en_KE',
  currency: 'KES',
  phone: '+254743312254',
  email: 'info@galacticelectricals.com',
  address: {
    street: 'Duruma Road',
    city: 'Nairobi',
    region: 'Nairobi County',
    postalCode: '00100',
    country: 'KE',
  },
  social: {
    facebook: 'https://www.facebook.com/galacticelectricals',
    instagram: 'https://www.instagram.com/galacticelectricals',
    tiktok: 'https://www.tiktok.com/@galacticelectricals',
  },
  ogImage: '/og-default.png',
} as const
