import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Business Insights & Wisdom | A Startup Biz - Expert Entrepreneurial Advice",
  description: "Real lessons from 46 years and over 100 businesses. Battle-tested strategies, hard truths about entrepreneurship, and expert insights from serial entrepreneur Tory R. Zweigle.",
  keywords: [
    "entrepreneurship insights",
    "business wisdom",
    "startup advice",
    "business strategy",
    "entrepreneurial lessons",
    "business consulting blog",
    "startup blog",
    "entrepreneur mindset",
    "business operations",
    "scaling business",
    "business development",
    "startup guidance"
  ],
  openGraph: {
    title: "Business Insights & Wisdom | A Startup Biz",
    description: "Real lessons from starting over 100 businesses. Expert entrepreneurial advice and hard truths about business success.",
    type: "website",
  },
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
