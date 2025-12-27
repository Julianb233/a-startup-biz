import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  industryCategories,
  getCategoryBySlug
} from "@/lib/category-data"
import { industrySectors } from "@/lib/industry-data"
import { activeGuardProduct } from "@/lib/activeguard-data"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { CategoryPageContent } from "@/components/category-page-content"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return industryCategories.map((category) => ({
    category: category.slug,
  }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.title} Insurance | HIQOR Daily Event Insurance`,
    description: category.longDescription,
    openGraph: {
      title: `${category.title} Insurance | HIQOR`,
      description: category.description,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params
  const category = getCategoryBySlug(categorySlug)

  if (!category) {
    notFound()
  }

  // Get all sectors for this category
  const categorySectors = category.sectors
    .map((sectorSlug) => industrySectors[sectorSlug])
    .filter(Boolean)

  // Check if ActiveGuard is available for this category
  const hasActiveGuard = activeGuardProduct.eligibleCategories.includes(category.id)

  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />
      <CategoryPageContent
        category={category}
        sectors={categorySectors}
        hasActiveGuard={hasActiveGuard}
      />
      <Footer />
    </main>
  )
}
