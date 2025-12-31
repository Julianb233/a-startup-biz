import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner Onboarding | Daily Event Insurance',
  description: '4 simple steps to go live. Business info, integration, customize, launch. Start earning instantly. Free setup, no contracts.',
  keywords: ['onboarding', 'partner integration', 'business setup', 'insurance integration', 'API integration'],
  openGraph: {
    title: 'Partner Onboarding Process',
    description: 'Quick 4-step onboarding to start offering insurance and earning commission.',
    url: 'https://dailyeventinsurance.com/onboarding',
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
    title: 'Partner Onboarding | DEI',
    description: '4 steps to launch. Free setup. Start earning today.',
    images: ['/logo.webp'],
  },
}

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
