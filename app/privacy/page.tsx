import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Daily Event Insurance',
  description: 'Privacy Policy for Daily Event Insurance. Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-slate-900">Privacy Policy</h1>
          <p className="mt-2 text-slate-600">Last updated: December 2024</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="prose prose-slate max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
            <p className="text-slate-600 leading-relaxed">
              Daily Event Insurance (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), a HiQOR company, is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
              website or use our services.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Personal Information</h3>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may collect personal information that you voluntarily provide when you:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
              <li>Register as a partner on our platform</li>
              <li>Fill out a contact form or application</li>
              <li>Subscribe to our newsletter</li>
              <li>Communicate with us via email or phone</li>
            </ul>
            <p className="text-slate-600 leading-relaxed">
              This information may include your name, email address, phone number, business name, and payment information.
            </p>

            <h3 className="text-xl font-semibold text-slate-800 mb-3 mt-8">Automatically Collected Information</h3>
            <p className="text-slate-600 leading-relaxed">
              When you visit our website, we automatically collect certain information including your IP address,
              browser type, operating system, referring URLs, and information about how you interact with our website.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
            <p className="text-slate-600 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>Provide, operate, and maintain our services</li>
              <li>Process partner applications and manage accounts</li>
              <li>Send administrative information and updates</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Information Sharing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We may share your information in the following situations:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li><strong>Service Providers:</strong> With third-party vendors who assist in providing our services</li>
              <li><strong>Insurance Partners:</strong> With our underwriting partners to facilitate insurance coverage</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
            <p className="text-slate-600 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information.
              However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Depending on your location, you may have certain rights regarding your personal information, including:
            </p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to delete your information</li>
              <li>The right to opt-out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
            <p className="text-slate-600 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience on our website.
              You can control cookies through your browser settings.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <p className="text-slate-600 leading-relaxed">
              If you have questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <p className="text-slate-700 font-medium">Daily Event Insurance</p>
              <p className="text-slate-600">A HiQOR Company</p>
              <p className="text-slate-600 mt-2">
                Email: <a href="mailto:privacy@dailyeventinsurance.com" className="text-teal-600 hover:text-teal-700">privacy@dailyeventinsurance.com</a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
