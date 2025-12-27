import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { getBlogPost, getAllBlogSlugs } from "@/lib/blog-data"
import { Button } from "@/components/ui/button"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    return {
      title: "Post Not Found | A Startup Biz",
    }
  }

  return {
    title: `${post.title} | A Startup Biz`,
    description: post.excerpt,
    keywords: [
      ...post.tags,
      post.category,
      "business blog",
      "entrepreneur",
      "Tory Zweigle"
    ],
    authors: [{ name: post.author }],
    openGraph: {
      title: `${post.title} | A Startup Biz`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

// Helper function to convert markdown to HTML
function markdownToHtml(markdown: string): string {
  let html = markdown

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-12 mb-4 text-gray-900">$1</h3>')
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl md:text-4xl font-bold mt-16 mb-6 text-gray-900">$1</h2>')
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl md:text-5xl font-bold mt-8 mb-6 text-gray-900">$1</h1>')

  // Bold text
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')

  // Italic text
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.*)$/gim, '<li class="ml-6 mb-2">$1</li>')

  // Unordered lists
  html = html.replace(/^[-*]\s+(.*)$/gim, '<li class="ml-6 mb-2">$1</li>')

  // Wrap consecutive list items
  html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>\n?)+/g, '<ul class="list-disc space-y-2 mb-6">$&</ul>')

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[#ff6a1a] hover:text-[#e55f17] font-semibold underline">$1</a>')

  // Paragraphs (lines that aren't already HTML tags)
  html = html.split('\n').map(line => {
    if (line.trim() === '' || line.trim().startsWith('<')) {
      return line
    }
    return `<p class="mb-6 text-lg leading-relaxed text-gray-700">${line}</p>`
  }).join('\n')

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="my-12 border-t-2 border-gray-200" />')

  return html
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const htmlContent = markdownToHtml(post.content)
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />

      {/* Hero Section with Featured Image */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Featured Image Background */}
        {post.featuredImage && (
          <div className="absolute inset-0 opacity-20">
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Back to Blog Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Blog</span>
          </Link>

          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-[#ff6a1a] text-white text-sm font-semibold rounded-full">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 max-w-4xl leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-8">
              <Tag className="w-5 h-5 text-white/60" />
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            <div className="mb-12 p-6 bg-orange-50 border-l-4 border-[#ff6a1a] rounded-r-lg">
              <p className="text-xl text-gray-700 leading-relaxed italic">
                {post.excerpt}
              </p>
            </div>

            {/* Main Content */}
            <div
              className="prose prose-lg max-w-none
                [&_h1]:font-montserrat [&_h1]:font-bold [&_h1]:text-gray-900
                [&_h2]:font-montserrat [&_h2]:font-bold [&_h2]:text-gray-900
                [&_h3]:font-montserrat [&_h3]:font-bold [&_h3]:text-gray-900
                [&_p]:font-lato [&_p]:text-gray-700 [&_p]:leading-relaxed
                [&_strong]:text-gray-900 [&_strong]:font-bold
                [&_a]:text-[#ff6a1a] [&_a]:font-semibold [&_a]:no-underline hover:[&_a]:underline
                [&_ul]:space-y-2 [&_ul]:mb-6
                [&_ol]:space-y-2 [&_ol]:mb-6
                [&_li]:text-gray-700 [&_li]:leading-relaxed
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#ff6a1a] [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-gray-600
                [&_hr]:my-12 [&_hr]:border-gray-200"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Author Bio */}
            <div className="mt-16 p-8 bg-gray-50 rounded-2xl border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-full flex items-center justify-center text-white text-3xl font-bold">
                    {post.author.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    About {post.author}
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Tory R. Zweigle has started over 100 businesses in 46 years, beginning at age 11.
                    He's a serial entrepreneur, business consultant, and expert in helping entrepreneurs
                    avoid costly mistakes through honest, experience-based guidance.
                  </p>
                  <Link href="/about">
                    <Button variant="outline" size="sm">
                      Learn More About Tory
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff6a1a] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff6a1a] rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Turn Your Business Idea Into Reality?
            </h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Get an honest assessment from someone who's built over 100 businesses.
              Book a $1,000 clarity call and find out if your idea has what it takes—or
              what you need to change to make it work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book-call">
                <Button size="lg" className="text-lg px-8 py-6 h-auto">
                  Book Your Clarity Call
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900">
                  Read More Articles
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
