"use client"

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Check, Loader2, Package, Mail, ArrowRight, Home, AlertCircle } from 'lucide-react'
import Link from 'next/link'

// Loading fallback for Suspense
function CheckoutSuccessLoading() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-lato">Loading...</p>
      </div>
    </main>
  )
}

// Main checkout success page wrapper with Suspense
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<CheckoutSuccessLoading />}>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const [isLoading, setIsLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<{
    email?: string
    total?: number
    items?: string[]
  } | null>(null)

  useEffect(() => {
    // Simulate fetching order details (in production, verify with Stripe)
    const timer = setTimeout(() => {
      setIsLoading(false)
      setOrderDetails({
        email: 'customer@example.com',
        total: 0,
        items: []
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [sessionId])

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 font-montserrat">
            No Order Found
          </h1>
          <p className="text-gray-600 mb-8 font-lato">
            It looks like you arrived here without completing a purchase.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all font-montserrat"
          >
            Browse Services
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-lato">Confirming your order...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center border border-gray-100">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
            <Check className="w-14 h-14 text-white" strokeWidth={3} />
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-montserrat">
            Payment Successful!
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-8 font-lato max-w-md mx-auto">
            Thank you for your purchase. We're excited to help you grow your business!
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-4 font-montserrat flex items-center gap-2">
              <Package className="w-5 h-5 text-orange-500" />
              What happens next?
            </h2>
            <ul className="space-y-3 text-gray-600 font-lato">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 font-bold text-sm">1</span>
                </div>
                <span>You'll receive a confirmation email with your order details</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 font-bold text-sm">2</span>
                </div>
                <span>Our team will review your order and begin working on your services</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-orange-600 font-bold text-sm">3</span>
                </div>
                <span>We'll reach out within 24 hours to schedule your kickoff call</span>
              </li>
            </ul>
          </div>

          {/* Email Note */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-8 font-lato">
            <Mail className="w-4 h-4" />
            <span>Check your email for order confirmation</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all font-montserrat"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-lg hover:bg-gray-50 transition-all font-montserrat"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>

        {/* Support Note */}
        <p className="text-center text-sm text-gray-500 mt-8 font-lato">
          Questions about your order? Contact us at{' '}
          <a href="mailto:support@astartupbiz.com" className="text-orange-500 hover:text-orange-600 underline">
            support@astartupbiz.com
          </a>
        </p>
      </div>
    </main>
  )
}
