import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FAQContent from "@/components/faq-content"

export const metadata: Metadata = {
  title: "FAQs - A Startup Biz | Got Questions? We've Got Answers",
  description: "Find answers to common questions about A Startup Biz services, pricing, process, guarantees, and more. Learn how we help entrepreneurs launch and grow their businesses.",
  keywords: [
    "business consulting FAQ",
    "startup services questions",
    "entrepreneur help",
    "business formation FAQ",
    "EIN filing questions",
    "startup pricing",
    "business consulting process",
    "service guarantee",
    "small business FAQ"
  ],
  openGraph: {
    title: "FAQs - A Startup Biz | Got Questions? We've Got Answers",
    description: "Find answers to common questions about our business consulting services, pricing, process, and guarantees.",
    type: "website",
  },
}

export default function FAQPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white scroll-smooth">
      <Header />
      <FAQContent />
      <Footer />
    </main>
  )
}
