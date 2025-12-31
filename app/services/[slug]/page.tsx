import { Metadata } from "next"
import { notFound } from "next/navigation"
import Header from "@/components/header"
import Footer from "@/components/footer"
import ServiceDetail from "@/components/service-detail"
import { getServiceBySlug, services } from "@/lib/service-data"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    return {
      title: "Service Not Found | A Startup Biz",
    }
  }

  return {
    title: `${service.title} | A Startup Biz`,
    description: service.description,
    keywords: [
      service.title,
      service.shortTitle,
      ...service.features.slice(0, 5),
      "business services",
      "startup services"
    ],
    openGraph: {
      title: `${service.title} | A Startup Biz`,
      description: service.description,
      type: "website",
      images: ["/logo.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | A Startup Biz`,
      description: service.description,
      images: ["/logo.webp"],
    },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />
      <ServiceDetail service={service} />
      <Footer />
    </main>
  )
}
