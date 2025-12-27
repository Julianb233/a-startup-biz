import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Adventure Sports Insurance | Daily Event Insurance',
  description: 'Instant insurance for adventure activities. Zip lines, obstacle courses, trampoline parks. Earn commission per participant.',
  keywords: ['adventure sports insurance', 'zip line insurance', 'obstacle course insurance', 'adventure park insurance', 'liability coverage'],
  openGraph: {
    title: 'Adventure Sports Insurance Solutions',
    description: 'Instant coverage for adventure activities. Earn commission on every participant protected.',
    url: 'https://dailyeventinsurance.com/for-adventure',
    type: 'website',
    images: [{
      url: '/images/og-adventure-insurance.png',
      width: 1200,
      height: 630,
      alt: 'Daily Event Insurance - Adventure Sports Insurance',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adventure Sports Insurance | DEI',
    description: 'Instant coverage. Earn commission per participant. Protect your guests.',
  },
}

export default function ForAdventureLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
