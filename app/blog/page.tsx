'use client'

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogCard from "@/components/blog/BlogCard"
import { blogPosts } from "@/lib/blog-data"
import { Search, Filter } from "lucide-react"
import Link from "next/link"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(blogPosts.map(post => post.category))
    return ["All", ...Array.from(cats)]
  }, [])

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || post.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  return (
    <main className="relative overflow-x-hidden max-w-full bg-white dark:bg-dark-bg">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-gray-50 dark:from-dark-bg to-white dark:to-dark-card">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-[#ff6a1a]/20 bg-[#ff6a1a]/5"
            >
              <span className="w-2 h-2 rounded-full bg-[#ff6a1a] animate-pulse" />
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Expert Insights & Wisdom
              </span>
            </motion.div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-dark-text mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Insights & Wisdom from{' '}
              <span className="text-[#ff6a1a]">46 Years</span>{' '}
              in Business
            </h1>

            <p
              className="text-lg md:text-xl text-gray-600 dark:text-dark-text-muted mb-8 leading-relaxed"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Real lessons from starting over 100 businesses. No theory. No fluff.
              Just battle-tested strategies and hard truths about entrepreneurship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white dark:bg-dark-card border-y border-gray-100 dark:border-dark-secondary">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-dark-secondary rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none bg-white dark:bg-dark-bg text-gray-900 dark:text-dark-text"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="text-gray-400 w-5 h-5" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-[#ff6a1a] text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-dark-muted text-gray-700 dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-dark-secondary'
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4">
            <p
              className="text-sm text-gray-600 dark:text-dark-text-muted"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24 bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          {filteredPosts.length > 0 ? (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.slug} post={post} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-dark-muted flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3
                className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                No Articles Found
              </h3>
              <p
                className="text-gray-600 dark:text-dark-text-muted mb-6"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Try adjusting your search or filter to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("All")
                }}
                className="px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Ready to Transform Your Business Idea?
            </h2>
            <p
              className="text-lg text-gray-300 mb-8"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Get an honest assessment from someone who&apos;s started over 100 businesses in 46 years.
            </p>
            <Link
              href="/book-call"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#ff6a1a] text-white font-bold rounded-lg hover:bg-orange-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Book Your $1,000 Clarity Call
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
