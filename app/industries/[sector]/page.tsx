import Header from "@/components/header"
import Footer from "@/components/footer"
import { SectorPageContent } from "@/components/sector-page-content"
import { getSectorBySlug, getAllSectorSlugs } from "@/lib/industry-data"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

// Generate metadata for each sector page
export async function generateMetadata({ params }: { params: Promise<{ sector: string }> }): Promise<Metadata> {
  const { sector: sectorSlug } = await params
  const sector = getSectorBySlug(sectorSlug)

  if (!sector) {
    return {
      title: "Industry Not Found | Daily Event Insurance"
    }
  }

  return {
    title: sector.metaTitle,
    description: sector.metaDescription,
    openGraph: {
      title: sector.metaTitle,
      description: sector.metaDescription,
      url: `https://dailyeventinsurance.com/industries/${sector.slug}`,
      siteName: "Daily Event Insurance",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: sector.metaTitle,
      description: sector.metaDescription,
    }
  }
}

// Generate static params for all sectors
export async function generateStaticParams() {
  return getAllSectorSlugs().map((slug) => ({
    sector: slug,
  }))
}

// Main Sector Page Component (Server Component)
export default async function SectorPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector: sectorSlug } = await params
  const sector = getSectorBySlug(sectorSlug)

  if (!sector) {
    notFound()
  }

  // Generate JSON-LD structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": sector.title,
    "description": sector.metaDescription,
    "provider": {
      "@type": "Organization",
      "name": "Daily Event Insurance"
    },
    "areaServed": "United States",
    "audience": {
      "@type": "BusinessAudience",
      "audienceType": sector.shortTitle
    }
  }

  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Header />
      <SectorPageContent sector={sector} />
      <Footer />
    </main>
  )
}
