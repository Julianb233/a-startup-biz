import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Montserrat, Lato } from "next/font/google"
import SmoothScroll from "@/components/smooth-scroll"
import "./globals.css"

const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
})

const lato = Lato({
  weight: ["300", "400", "700", "900"],
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://astartupbiz.com"),
  title: "A Startup Biz - Are You an Entrepreneur or Wantrepreneur?",
  description:
    "Transform your business idea into reality. Expert consulting for startups and entrepreneurs who are ready to take action, not just dream. Strategy, execution, and results.",
  keywords: [
    "startup consulting",
    "business consulting",
    "entrepreneur",
    "wantrepreneur",
    "business strategy",
    "startup advice",
    "business coach",
    "startup mentor",
    "business development",
    "entrepreneurship",
    "small business consulting",
    "startup success"
  ],
  authors: [{ name: "A Startup Biz" }],
  creator: "A Startup Biz",
  publisher: "A Startup Biz",
  openGraph: {
    title: "A Startup Biz - Are You an Entrepreneur or Wantrepreneur?",
    description: "Transform your business idea into reality. Expert consulting for startups and entrepreneurs who are ready to take action, not just dream.",
    url: "https://astartupbiz.com",
    siteName: "A Startup Biz",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "A Startup Biz - Business Consulting for Entrepreneurs",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "A Startup Biz - Entrepreneur or Wantrepreneur?",
    description: "Transform your business idea into reality. Expert consulting for startups ready to take action.",
    images: ["/images/og-image.png"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "A Startup Biz",
    "description": "Expert business consulting for startups and entrepreneurs. Transform your business idea into reality with strategic guidance, actionable advice, and proven execution frameworks.",
    "url": "https://astartupbiz.com",
    "logo": "https://astartupbiz.com/images/logo-color.png",
    "image": "https://astartupbiz.com/images/og-image.png",
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "serviceType": [
      "Business Consulting",
      "Startup Consulting",
      "Business Strategy",
      "Business Coaching",
      "Entrepreneurship Mentoring",
      "Business Development",
      "Startup Advisory"
    ],
    "offers": {
      "@type": "Offer",
      "description": "Comprehensive business consulting services for entrepreneurs and startups. From idea validation to execution strategy, we help turn wantrepreneurs into successful entrepreneurs.",
      "areaServed": "United States",
      "availability": "https://schema.org/InStock",
      "businessFunction": "https://schema.org/ProvideService"
    },
    "audience": {
      "@type": "BusinessAudience",
      "audienceType": "Entrepreneurs, Startups, Small Business Owners"
    }
  }

  return (
    <html lang="en" className="bg-white overflow-x-hidden">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`font-sans antialiased overflow-x-hidden bg-white ${montserrat.variable} ${lato.variable}`}
      >
        <SmoothScroll>{children}</SmoothScroll>
        <Analytics />
      </body>
    </html>
  )
}
