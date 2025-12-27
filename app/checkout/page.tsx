"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShoppingCart, Check, AlertCircle, X, Loader2, Trash2 } from 'lucide-react'
import Link from 'next/link'

// Validation schema
const checkoutSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number'),
  company: z.string().optional(),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { items, total, clearCart, removeItem, updateQuantity } = useCart()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to services if cart is empty (only after mounted)
  useEffect(() => {
    if (mounted && items.length === 0 && !showSuccess) {
      router.push('/services')
    }
  }, [items.length, showSuccess, router, mounted])

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)

    try {
      // Simulate API call to process order
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Log order data (in production, this would be sent to your backend)
      console.log('Order submitted:', {
        customer: data,
        items,
        total,
        timestamp: new Date().toISOString(),
      })

      // Clear cart and show success
      clearCart()
      setShowSuccess(true)
    } catch (error) {
      console.error('Order submission failed:', error)
      alert('Failed to submit order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't render until mounted (prevents hydration mismatch)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  // Show loading while redirecting
  if (items.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-black font-montserrat mb-2">
                Checkout
              </h1>
              <p className="text-gray-600 font-lato">
                Complete your order for professional business services
              </p>
            </div>
            <Link
              href="/services"
              className="text-orange-500 hover:text-orange-600 font-semibold text-sm sm:text-base font-montserrat transition-colors"
            >
              ← Back to Services
            </Link>
          </div>
        </header>

        {/* Two Column Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Form (2/3 width on desktop) */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Contact Information Card */}
              <div className="bg-white rounded-xl shadow-premium p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-black font-montserrat mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name')}
                      placeholder="John Doe"
                      className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-lato text-gray-900 placeholder:text-gray-400 ${
                        errors.name
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-lato text-gray-900 placeholder:text-gray-400 ${
                        errors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                      Phone Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder="+1 (555) 123-4567"
                      className={`w-full px-4 py-3 border-2 rounded-lg outline-none transition-all font-lato text-gray-900 placeholder:text-gray-400 ${
                        errors.phone
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                          : 'border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  {/* Company Field (Optional) */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2 font-montserrat">
                      Company Name <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      {...register('company')}
                      placeholder="Your Company LLC"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg outline-none transition-all font-lato text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Billing Information Card (Placeholder) */}
              <div className="bg-white rounded-xl shadow-premium p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-black font-montserrat mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  Payment Information
                </h2>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800 font-lato text-sm">
                    <strong className="font-montserrat">Note:</strong> After submitting your order, our team will contact you via email to arrange payment and begin work on your services.
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-4 px-6 rounded-lg hover:shadow-premium-orange hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-montserrat text-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Complete Order
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500 font-lato">
                By completing your order, you agree to our{' '}
                <Link href="/terms" className="text-orange-500 hover:text-orange-600 underline">
                  Terms of Service
                </Link>
              </p>
            </form>
          </div>

          {/* Right Column: Order Summary (1/3 width on desktop, sticky) */}
          <div className="lg:col-span-1">
            <aside className="lg:sticky lg:top-8">
              <div className="bg-white rounded-xl shadow-premium p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-black font-montserrat mb-6 flex items-center gap-2">
                  <ShoppingCart className="w-6 h-6 text-orange-500" />
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.slug} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 font-montserrat truncate">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-sm text-gray-500 font-lato">
                              {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="font-bold text-gray-900 font-montserrat whitespace-nowrap">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeItem(item.slug)}
                            className="text-red-500 hover:text-red-600 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-sm text-gray-600 font-lato">Quantity:</span>
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                            className="px-3 py-1 text-gray-600 hover:text-orange-500 transition-colors font-bold"
                            type="button"
                          >
                            −
                          </button>
                          <span className="px-2 font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                            className="px-3 py-1 text-gray-600 hover:text-orange-500 transition-colors font-bold"
                            type="button"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-3 pt-4 border-t-2 border-gray-100">
                  <div className="flex justify-between text-gray-600 font-lato">
                    <span>Subtotal</span>
                    <span className="font-semibold">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400 text-sm font-lato">
                    <span>Tax</span>
                    <span>Calculated at payment</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-black pt-3 border-t-2 border-orange-500">
                    <span className="font-montserrat">Total</span>
                    <span className="text-orange-500 font-montserrat">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-lato">
                    <Check className="w-4 h-4 text-green-500" />
                    Secure checkout
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-premium-orange transform scale-100 animate-fadeIn">
            <div className="text-center">
              {/* Success Icon */}
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-premium-orange">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3 font-montserrat">
                Order Submitted!
              </h2>

              {/* Message */}
              <p className="text-gray-600 mb-8 font-lato leading-relaxed">
                Thank you for your order! We've received your request and will contact you shortly via email to complete payment and begin work on your services.
              </p>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/services')}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-all hover:scale-[1.02] font-montserrat"
                >
                  Back to Services
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-50 transition-all font-montserrat"
                >
                  Go to Homepage
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
