import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Insurance Disclosure | Daily Event Insurance',
  description: 'Insurance disclosure and regulatory information for Daily Event Insurance products and services.',
  openGraph: {
    title: 'Insurance Disclosure | Daily Event Insurance',
    description: 'Insurance disclosure and regulatory information for Daily Event Insurance products and services.',
    type: 'website',
    images: ['/logo.webp'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insurance Disclosure | Daily Event Insurance',
    description: 'Insurance disclosure and regulatory information for Daily Event Insurance products and services.',
    images: ['/logo.webp'],
  },
}

export default function InsuranceDisclosurePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium mb-6"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-slate-900">Insurance Disclosure</h1>
          <p className="mt-2 text-slate-600">Last updated: December 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">About Daily Event Insurance</h2>
            <p className="text-slate-600 leading-relaxed">
              Daily Event Insurance is an insurance technology platform that enables fitness facilities,
              adventure sports operators, and equipment rental businesses to offer embedded insurance
              coverage to their customers. We are a subsidiary of HiQOR and operate as a licensed
              insurance producer in multiple states.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Insurance Products</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The insurance products offered through our platform are underwritten by licensed insurance
              carriers. Daily Event Insurance acts as an intermediary to facilitate the purchase of
              coverage and does not directly underwrite any insurance policies.
            </p>
            <div className="bg-teal-50 border border-teal-200 rounded-xl p-6 mt-4">
              <p className="text-teal-800 font-medium">
                Important: All insurance policies are subject to the terms, conditions, limitations,
                and exclusions set forth in the policy documents. Please review your policy carefully.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Coverage Information</h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">What May Be Covered</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Accidental injury during covered activities</li>
              <li>Medical expenses resulting from covered incidents</li>
              <li>Emergency medical transportation</li>
              <li>Accidental death and dismemberment (AD&D)</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-800 mb-3">Common Exclusions</h3>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Pre-existing medical conditions</li>
              <li>Injuries resulting from intentional acts</li>
              <li>Injuries occurring while under the influence of drugs or alcohol</li>
              <li>Professional athletic competition</li>
              <li>Injuries covered by other insurance or workers&apos; compensation</li>
            </ul>
            <p className="text-slate-600 mt-4 italic">
              This is not a complete list. Please refer to your policy documents for full details.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">State Availability</h2>
            <p className="text-slate-600 leading-relaxed">
              Coverage availability may vary by state. Some insurance products may not be available in
              all states or may be subject to state-specific terms and conditions. During the enrollment
              process, you will be informed if coverage is not available in your state.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Claims Process</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              In the event of a claim, policyholders should:
            </p>
            <ol className="list-decimal pl-6 text-slate-600 space-y-2">
              <li>Seek appropriate medical attention immediately</li>
              <li>Report the incident to the facility where the activity occurred</li>
              <li>Contact our claims department as soon as possible</li>
              <li>Provide all requested documentation and information</li>
              <li>Cooperate fully with the claims investigation process</li>
            </ol>
            <div className="mt-6 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-700 font-medium">Claims Contact</p>
              <p className="text-slate-600 mt-2">
                Email: <a href="mailto:claims@dailyeventinsurance.com" className="text-teal-600 hover:text-teal-700">claims@dailyeventinsurance.com</a>
              </p>
              <p className="text-slate-600">
                Phone: Available upon policy purchase
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Licensing Information</h2>
            <p className="text-slate-600 leading-relaxed">
              Daily Event Insurance is licensed as an insurance producer in the states where we operate.
              Our licensing information is available upon request. If you have questions about our
              licensing status in a particular state, please contact us.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Consumer Protection</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We are committed to fair and transparent practices. If you have concerns about our
              insurance products or practices, you have the right to:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Request copies of policy documents and disclosures</li>
              <li>File a complaint with our customer service department</li>
              <li>Contact your state&apos;s Department of Insurance</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Disclaimer</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <p className="text-amber-800 leading-relaxed">
                The information provided on this page is for general informational purposes only and
                does not constitute insurance advice. Insurance products, coverage options, and terms
                may change without notice. Always review your policy documents for the most current
                and complete information about your coverage. If you have questions about your specific
                coverage needs, please consult with a licensed insurance professional.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              For questions about insurance disclosures or regulatory compliance:
            </p>
            <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-700 font-medium">Daily Event Insurance</p>
              <p className="text-slate-600">A HiQOR Company</p>
              <p className="text-slate-600 mt-2">
                Email: <a href="mailto:compliance@dailyeventinsurance.com" className="text-teal-600 hover:text-teal-700">compliance@dailyeventinsurance.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
