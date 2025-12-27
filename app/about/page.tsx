import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import AboutContent from "@/components/about-content"

export const metadata: Metadata = {
  title: "About Tory | A Startup Biz - Your Business Consulting Partner",
  description: "Meet Tory, founder of A Startup Biz. With years of experience helping entrepreneurs transform ideas into thriving businesses, learn how personalized consulting can accelerate your success.",
  keywords: [
    "business consultant",
    "startup mentor",
    "entrepreneur coach",
    "Tory A Startup Biz",
    "business advisor",
    "startup consulting",
    "small business help"
  ],
  openGraph: {
    title: "About Tory | A Startup Biz",
    description: "Meet Tory, founder of A Startup Biz. Expert business consulting for entrepreneurs ready to take action.",
    type: "website",
  },
}

export default function AboutPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white scroll-smooth">
      <Header />
      <AboutContent />
      <Footer />
    </main>
  )
}
