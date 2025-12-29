'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock, User, ArrowRight } from "lucide-react"
import type { BlogPost } from "@/lib/blog-data"

interface BlogCardProps {
  post: BlogPost
  index?: number
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group h-full flex flex-col bg-white dark:bg-dark-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-dark-secondary hover:border-[#ff6a1a]/20"
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative w-full h-56 overflow-hidden bg-gray-100 dark:bg-dark-muted">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            className="text-xl md:text-2xl font-bold text-gray-900 dark:text-dark-text mb-3 group-hover:text-[#ff6a1a] transition-colors duration-300 line-clamp-2"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {post.title}
          </h2>

          {/* Excerpt */}
          <p
            className="text-gray-600 dark:text-dark-text-muted mb-4 line-clamp-3 flex-1"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100 dark:border-dark-secondary">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6a1a] to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                {post.author.charAt(0)}
              </div>
              <span
                className="text-sm font-medium text-gray-700 dark:text-dark-text-muted"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {post.author}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-dark-text-muted ml-auto">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {formattedDate}
                </span>
              </div>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-dark-text-muted" />
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-muted text-gray-600 dark:text-dark-text-muted"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Read More Link */}
          <div className="mt-4 flex items-center gap-2 text-[#ff6a1a] font-semibold group-hover:gap-3 transition-all duration-300">
            <span style={{ fontFamily: 'Montserrat, sans-serif' }}>Read Article</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
