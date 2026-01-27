'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, HelpCircle, Phone, Mail } from 'lucide-react'
import { OnboardingProgress } from './OnboardingProgress'

interface OnboardingLayoutProps {
  children: ReactNode
  currentStep: number
  showBackLink?: boolean
  backLinkHref?: string
  backLinkText?: string
}

export function OnboardingLayout({
  children,
  currentStep,
  showBackLink = false,
  backLinkHref = '/partner-portal/dashboard',
  backLinkText = 'Back to Dashboard',
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Premium Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackLink && (
                <Link
                  href={backLinkHref}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {backLinkText}
                </Link>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="font-semibold text-gray-900">Partner Onboarding</span>
              </div>
            </div>

            {/* Help Button */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Need Help?</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Section */}
      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <OnboardingProgress currentStep={currentStep} />
        </div>
      </div>

      {/* Main Content */}
      <main className="py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          {children}
        </motion.div>
      </main>

      {/* Support Footer */}
      <footer className="bg-gray-50 border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Our partner success team is here to help you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <a
                href="mailto:partners@astartupbiz.com"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
              >
                <Mail className="h-4 w-4" />
                partners@astartupbiz.com
              </a>
              <a
                href="tel:+19498064468"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors"
              >
                <Phone className="h-4 w-4" />
                949-806-4468
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
