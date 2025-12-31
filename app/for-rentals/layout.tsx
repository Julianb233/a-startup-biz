import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Equipment Rental Insurance | Daily Event Insurance',
  description: 'Protect your rental inventory. Reduce damage disputes. Earn commission on every rental. Bikes, water sports, adventure gear covered.',
  keywords: ['rental insurance', 'equipment rental protection', 'bike rental insurance', 'damage protection insurance', 'rental business insurance'],
  openGraph: {
    title: 'Equipment Rental Insurance Solutions',
    description: 'Protect your rental inventory and earn commission on every policy sold. No damage disputes.',
    url: 'https://dailyeventinsurance.com/for-rentals',
    type: 'website',
    images: [{
      url: '/logo.webp',
      width: 1200,
      height: 630,
      alt: 'A Startup Biz Logo',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Equipment Rental Insurance | DEI',
    description: 'Reduce damage disputes. Earn commission. Protect your inventory.',
    images: ['/logo.webp'],
  },
}

export default function ForRentalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
