import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Climbing Facility Insurance | Daily Event Insurance',
  description: 'Same-day climbing insurance for indoor and outdoor facilities. Protect climbers, earn commission, 5-minute integration. 50+ gyms trust us.',
  keywords: ['climbing gym insurance', 'indoor climbing insurance', 'climbing facility liability', 'climber protection', 'rock climbing insurance'],
  openGraph: {
    title: 'Climbing Facility Insurance Solutions',
    description: 'Instant coverage for climbing activities. Earn commission on every policy sold through your facility.',
    url: 'https://dailyeventinsurance.com/for-climbing',
    type: 'website',
    images: [{
      url: '/images/og-climbing-insurance.png',
      width: 1200,
      height: 630,
      alt: 'Daily Event Insurance - Climbing Facility Insurance',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Climbing Facility Insurance | DEI',
    description: 'Same-day coverage. Earn commission. 5-minute integration.',
  },
}

export default function ForClimbingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
