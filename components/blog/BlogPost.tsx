'use client'

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import ShareButtons from "./ShareButtons"
import type { BlogPost as BlogPostType } from "@/lib/blog-data"

interface BlogPostProps {
  post: BlogPostType
}

// Helper function to convert markdown to HTML
function markdownToHtml(markdown: string): string {
  let html = markdown

  // Headers - with Montserrat font
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-12 mb-4 text-gray-900 dark:text-dark-text" style="font-family: Montserrat, sans-serif">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl md:text-4xl font-bold mt-16 mb-6 text-gray-900 dark:text-dark-text" style="font-family: Montserrat, sans-serif">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl md:text-5xl font-bold mt-8 mb-6 text-gray-900 dark:text-dark-text" style="font-family: Montserrat, sans-serif">$1</h1>')

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900 dark:text-dark-text">$1</strong>')

  // Italic text
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.*)$/gim, '<li class="ml-6 mb-3" style="font-family: Montserrat, sans-serif">$1</li>')

  // Unordered lists
  html = html.replace(/^[-*]\s+(.*)$/gim, '<li class="ml-6 mb-3" style="font-family: Montserrat, sans-serif">$1</li>')

  // Wrap consecutive list items
  html = html.replace(/(<li class="ml-6 mb-3".*?<\/li>\n?)+/g, '<ul class="list-disc space-y-2 mb-8 pl-4">$&</ul>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#ff6a1a] hover:text-[#e55f17] font-semibold underline transition-colors">$1</a>')

  // Paragraphs (lines that aren't already HTML tags)
  html = html.split('\n').map(line => {
    if (line.trim() === '' || line.trim().startsWith('<')) {
      return line
    }
    return `<p class="mb-6 text-lg leading-relaxed text-gray-700 dark:text-dark-text-muted" style="font-family: Montserrat, sans-serif">${line}</p>`
  }).join('\n')

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="my-12 border-t-2 border-gray-200 dark:border-dark-secondary" />')

  // Code blocks (basic support)
  html = html.replace(/`([^`]+)`/g, '<code class="px-2 py-1 bg-gray-100 dark:bg-dark-muted rounded text-sm font-mono text-[#ff6a1a]">$1</code>')

  return html
}

export default function BlogPost({ post }: BlogPostProps) {
  const htmlContent = markdownToHtml(post.content)
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <article className="w-full">
      {/* Excerpt */}
      <div className="mb-12 p-6 bg-orange-50 dark:bg-dark-muted border-l-4 border-[#ff6a1a] rounded-r-lg">
        <p
          className="text-xl text-gray-700 dark:text-dark-text-muted leading-relaxed italic"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {post.excerpt}
        </p>
      </div>

      {/* Main Content */}
      <div
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />

      {/* Share Buttons */}
      <div className="mt-12 pt-8 border-t-2 border-gray-200 dark:border-dark-secondary">
        <ShareButtons
          url={typeof window !== 'undefined' ? window.location.href : ''}
          title={post.title}
        />
      </div>

      {/* Author Bio */}
      <div className="mt-16 p-8 bg-gray-50 dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-secondary">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="flex-shrink-0">
            <div
              className="w-20 h-20 bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-full flex items-center justify-center text-white text-3xl font-bold"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {post.author.charAt(0)}
            </div>
          </div>
          <div>
            <h3
              className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-2"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              About {post.author}
            </h3>
            <p
              className="text-gray-700 dark:text-dark-text-muted leading-relaxed mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Tory R. Zweigle has started over 100 businesses in 46 years, beginning at age 11.
              He&apos;s a serial entrepreneur, business consultant, and expert in helping entrepreneurs
              avoid costly mistakes through honest, experience-based guidance.
            </p>
            <Link href="/about">
              <Button variant="outline" size="sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Learn More About Tory
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
