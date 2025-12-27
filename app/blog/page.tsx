'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { blogPosts } from "@/lib/blog-data"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function BlogPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-gray-50 to-white">
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
              <span className="w-2 h-2 rounded-full bg-[#ff6a1a] animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Expert Insights & Wisdom
              </span>
            </motion.div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Insights & Wisdom from{' '}
              <span className="text-[#ff6a1a]">46 Years</span>{' '}
              in Business
            </h1>

            <p
              className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Real lessons from starting over 100 businesses. No theory. No fluff.
              Just battle-tested strategies and hard truths about entrepreneurship.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogPosts.map((post) => (
              <motion.div
                key={post.slug}
                variants={item}
                transition={{ duration: 0.5 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <article className="group h-full flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#ff6a1a]/20">
                    {/* Featured Image */}
                    {post.featuredImage && (
                      <div className="relative w-full h-56 overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 flex flex-col p-6">
                      {/* Category Badge */}
                      <div className="mb-4">
                        <span
                          className="inline-block px-3 py-1 text-xs font-semibold text-[#ff6a1a] bg-[#ff6a1a]/10 rounded-full"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                          {post.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#ff6a1a] transition-colors duration-300 line-clamp-2"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p
                        className="text-gray-600 mb-4 line-clamp-3 flex-1"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        {post.excerpt}
                      </p>

                      {/* Meta Information */}
                      <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6a1a] to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                            {post.author.charAt(0)}
                          </div>
                          <span
                            className="text-sm font-medium text-gray-700"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {post.author}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-500 ml-auto">
                          <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {new Date(post.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {post.readTime}
                          </span>
                        </div>
                      </div>

                      {/* Read More Link */}
                      <div className="mt-4 flex items-center gap-2 text-[#ff6a1a] font-semibold group-hover:gap-3 transition-all duration-300">
                        <span style={{ fontFamily: 'Montserrat, sans-serif' }}>Read Article</span>
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </article>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State (if no posts) */}
          {blogPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3
                className="text-2xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                No Articles Yet
              </h3>
              <p
                className="text-gray-600"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Check back soon for new insights and wisdom.
              </p>
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
              Get an honest assessment from someone who's started over 100 businesses in 46 years.
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
