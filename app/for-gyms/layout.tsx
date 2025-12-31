import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gym Insurance & Member Coverage | Daily Event Insurance',
  description: 'Turn gym day passes into revenue. Instant liability coverage for members. Earn 25-30% commission on every policy. Free setup, no contracts.',
  keywords: ['gym insurance', 'fitness facility insurance', 'gym liability coverage', 'member protection', 'fitness center insurance'],
  openGraph: {
    title: 'Gym Insurance for Fitness Centers',
    description: 'Protect your gym members and earn commission on every insurance policy sold.',
    url: 'https://dailyeventinsurance.com/for-gyms',
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
    title: 'Gym Insurance & Member Coverage | DEI',
    description: 'Instant liability coverage for gym members. Earn 25-30% commission per policy.',
    images: ['/logo.webp'],
  },
}

export default function ForGymsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
