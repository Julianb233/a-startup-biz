import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, User, Tag } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import BlogPost from "@/components/blog/BlogPost"
import BlogCard from "@/components/blog/BlogCard"
import { getBlogPost, getAllBlogSlugs, getRecentPosts } from "@/lib/blog-data"
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
      images: ["/logo.webp"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: ["/logo.webp"],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Get related posts (same category, excluding current post)
  const relatedPosts = getRecentPosts(6)
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3)

  return (
    <main className="relative overflow-x-hidden max-w-full bg-white dark:bg-dark-bg">
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
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Back to Blog</span>
          </Link>

          {/* Category Badge */}
          <div className="mb-6">
            <span
              className="inline-block px-4 py-2 bg-[#ff6a1a] text-white text-sm font-semibold rounded-full"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 max-w-4xl leading-tight"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-white/80" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
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
            <BlogPost post={post} />
          </div>
        </div>
      </article>

      {/* Related Posts Section */}
      {relatedPosts.length > 0 && (
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-dark-card">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <h2
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-dark-text mb-12 text-center"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost, index) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} index={index} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link href="/blog">
                <Button size="lg" variant="outline" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  View All Articles
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#ff6a1a] rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#ff6a1a] rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Ready to Turn Your Business Idea Into Reality?
            </h2>
            <p
              className="text-xl text-white/80 mb-8 leading-relaxed"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Get an honest assessment from someone who&apos;s built over 100 businesses.
              Book a $1,000 clarity call and find out if your idea has what it takes—or
              what you need to change to make it work.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/book-call">
                <Button size="lg" className="text-lg px-8 py-6 h-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Book Your Clarity Call
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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
