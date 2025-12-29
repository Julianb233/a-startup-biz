import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Daily Event Insurance',
  description: 'Terms of Service for Daily Event Insurance. Read our terms and conditions for using our partner platform.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-600 dark:text-[#ff6a1a] hover:text-teal-700 dark:hover:text-[#ff8a4a] font-medium mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
          <p className="mt-2 text-slate-600 dark:text-gray-400">Last updated: December 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Agreement to Terms</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
              By accessing or using Daily Event Insurance&apos;s website and services, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Partner Eligibility</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-4">
              To become a partner with Daily Event Insurance, you must:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-gray-400 space-y-2">
              <li>Be at least 18 years of age</li>
              <li>Operate a legitimate business in the fitness, adventure, or rental industry</li>
              <li>Provide accurate and complete information during registration</li>
              <li>Maintain all required business licenses and permits</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Partner Responsibilities</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-4">As a partner, you agree to:</p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-gray-400 space-y-2">
              <li>Accurately represent insurance products to your customers</li>
              <li>Not make false or misleading claims about coverage</li>
              <li>Maintain the confidentiality of customer information</li>
              <li>Promptly report any issues or concerns to Daily Event Insurance</li>
              <li>Comply with all applicable insurance regulations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Commission and Payments</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed mb-4">
              Partners earn commission on each insurance policy sold through their platform. Commission rates and
              payment terms are as follows:
            </p>
            <ul className="list-disc pl-6 text-slate-600 dark:text-gray-400 space-y-2">
              <li>Commission rates are established in your partner agreement</li>
              <li>Payments are processed monthly for the previous month&apos;s sales</li>
              <li>Partners must provide valid payment information to receive commissions</li>
              <li>Minimum payout thresholds may apply</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Intellectual Property</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
              All content, trademarks, and intellectual property on our website and platform are owned by
              Daily Event Insurance or its licensors. Partners are granted a limited license to use our
              marketing materials solely for promoting insurance products to their customers.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Limitation of Liability</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
              To the maximum extent permitted by law, Daily Event Insurance shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your use of
              our services. Our total liability shall not exceed the commissions paid to you in the
              preceding twelve months.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Termination</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
              Either party may terminate the partner relationship at any time with written notice.
              Upon termination, you must cease using our marketing materials and remove any integrations.
              Earned commissions will be paid according to the standard payment schedule.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Modifications</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. We will notify partners
              of material changes via email. Continued use of our services after changes constitutes
              acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Governing Law</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of
              the State of Delaware, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-slate-600 dark:text-gray-400 leading-relaxed">
              If you have questions about these Terms of Service, please contact us at:
            </p>
            <div className="mt-4 p-6 bg-slate-50 dark:bg-gray-800 rounded-xl border border-slate-200 dark:border-gray-700">
              <p className="text-slate-700 dark:text-gray-200 font-medium">Daily Event Insurance</p>
              <p className="text-slate-600 dark:text-gray-400">A HiQOR Company</p>
              <p className="text-slate-600 dark:text-gray-400 mt-2">
                Email: <a href="mailto:legal@dailyeventinsurance.com" className="text-teal-600 dark:text-[#ff6a1a] hover:text-teal-700 dark:hover:text-[#ff8a4a]">legal@dailyeventinsurance.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
