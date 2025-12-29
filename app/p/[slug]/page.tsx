'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface MicrositeData {
  id: string
  slug: string
  companyName: string
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  heroHeadline: string | null
  heroSubheadline: string | null
  description: string | null
  images: Array<{ url: string; alt: string; position: number }>
  formTitle: string
  formSubtitle: string
  formFields: string[]
  formButtonText: string
  successMessage: string
}

interface FormData {
  name: string
  email: string
  phone: string
  companyName: string
  message: string
}

export default function MicrositePage() {
  const params = useParams()
  const slug = params.slug as string

  const [microsite, setMicrosite] = useState<MicrositeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMicrosite() {
      try {
        const response = await fetch(`/api/microsites/${slug}`)
        if (!response.ok) {
          throw new Error('Microsite not found')
        }
        const data = await response.json()
        setMicrosite(data.microsite)
      } catch {
        setError('This page is not available')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchMicrosite()
    }
  }, [slug])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setSubmitError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch(`/api/microsites/${slug}/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sourceUrl: window.location.href,
          referrer: document.referrer,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit')
      }

      setSubmitted(true)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !microsite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-500">{error || 'This page is not available'}</p>
        </div>
      </div>
    )
  }

  const primaryColor = microsite.primaryColor || '#ff6a1a'

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className="py-6 px-4"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-center gap-4">
          {microsite.logoUrl && (
            <div className="relative w-16 h-16 bg-white rounded-lg p-2 flex-shrink-0">
              <Image
                src={microsite.logoUrl}
                alt={microsite.companyName}
                fill
                className="object-contain"
              />
            </div>
          )}
          <h1 className="text-xl md:text-2xl font-bold text-white text-center">
            {microsite.companyName}
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {microsite.heroHeadline || `Welcome to ${microsite.companyName}`}
          </h2>
          {microsite.heroSubheadline && (
            <p className="text-gray-600 text-lg">
              {microsite.heroSubheadline}
            </p>
          )}
        </div>
      </section>

      {/* Images Gallery */}
      {microsite.images.length > 0 && (
        <section className="py-4 px-4">
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-3 gap-2">
              {microsite.images.slice(0, 3).map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Form Section */}
      <section className="py-8 px-4">
        <div className="max-w-lg mx-auto">
          {submitted ? (
            <div className="text-center py-12">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: primaryColor }}
              >
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600">
                {microsite.successMessage || "We'll be in touch soon."}
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {microsite.formTitle || 'Get Started Today'}
                </h3>
                {microsite.formSubtitle && (
                  <p className="text-gray-600 mt-1">{microsite.formSubtitle}</p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {microsite.formFields.includes('name') && (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your Name *"
                      required
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      style={{ fontSize: '16px' }} // Prevents iOS zoom
                    />
                  </div>
                )}

                {microsite.formFields.includes('email') && (
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email Address *"
                      required
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                )}

                {microsite.formFields.includes('phone') && (
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                )}

                {microsite.formFields.includes('companyName') && (
                  <div>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="Company Name"
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                )}

                {microsite.formFields.includes('message') && (
                  <div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="How can we help?"
                      rows={3}
                      className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                      style={{ fontSize: '16px' }}
                    />
                  </div>
                )}

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 text-lg font-semibold text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  style={{ backgroundColor: primaryColor }}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    microsite.formButtonText || 'Submit'
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 border-t border-gray-100">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm text-gray-400">
            Powered by A Startup Biz
          </p>
        </div>
      </footer>
    </div>
  )
}
