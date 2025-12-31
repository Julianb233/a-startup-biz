import type { Metadata } from "next"
import Header from "@/components/header"
import { HomepageAnimations } from "@/components/homepage-animations"
import StatisticsShowcase from "@/components/statistics-showcase"
import ServicesShowcase from "@/components/services-showcase"
import HowItWorks from "@/components/how-it-works"
import AboutSection from "@/components/about-section"
import ThousandDollarSolution from "@/components/thousand-dollar-solution"
import BlogPreview from "@/components/blog-preview"
import CTASection from "@/components/cta-section"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "A Startup Biz - Expert Business Consulting for Entrepreneurs",
  description: "Transform your business idea into reality with expert consulting services. From strategy to execution, we help startups and entrepreneurs succeed with proven frameworks and personalized guidance.",
  keywords: [
    "business consulting",
    "startup consulting",
    "entrepreneur",
    "business strategy",
    "startup services",
    "business planning",
    "growth consulting",
    "business development",
    "startup advisor",
    "business coach"
  ],
  openGraph: {
    title: "A Startup Biz - Expert Business Consulting for Entrepreneurs",
    description: "Transform your business idea into reality with expert consulting services. We help startups succeed.",
    type: "website",
  },
}

export default function Home() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white dark:bg-gray-900 scroll-smooth">
      {/* GSAP Scroll Animations */}
      <HomepageAnimations />

      {/* Navigation */}
      <Header />

      {/* Meet Tory */}
      <AboutSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Everything Your Business Needs */}
      <ServicesShowcase />

      {/* $1000 Solution */}
      <ThousandDollarSolution />

      {/* Statistics Showcase - The Numbers Don't Lie */}
      <StatisticsShowcase />

      {/* Blog Preview */}
      <BlogPreview />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </main>
  )
}
