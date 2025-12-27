import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ServicesHero from "@/components/services-hero"
import ServicesGrid from "@/components/services-grid"
import ServicesCTA from "@/components/services-cta"

export const metadata: Metadata = {
  title: "Business Services | A Startup Biz - Expert Solutions for Entrepreneurs",
  description: "Comprehensive business services including EIN filing, legal support, accounting, web development, marketing, CRM setup, and AI solutions. Everything you need to launch and grow your startup.",
  keywords: [
    "business services",
    "EIN filing",
    "legal services",
    "accounting services",
    "website development",
    "marketing services",
    "CRM implementation",
    "AI solutions",
    "startup services",
    "business consulting"
  ],
  openGraph: {
    title: "Business Services | A Startup Biz",
    description: "Everything you need to launch and grow your startup. From EIN filing to AI solutions.",
    type: "website",
  },
}

export default function ServicesPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />
      <ServicesHero />
      <ServicesGrid />
      <ServicesCTA />
      <Footer />
    </main>
  )
}
