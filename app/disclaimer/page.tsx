import type { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Disclaimer | A Startup Biz",
  description: "Important disclaimers and legal notices regarding the services and information provided by A Startup Biz.",
}

export default function DisclaimerPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white scroll-smooth">
      <Header />

      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Disclaimer
            </h1>
            <p className="text-gray-500 mb-12">Last updated: December 2024</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  General Disclaimer
                </h2>
                <p className="text-gray-600 mb-4">
                  The information provided by A Startup Biz ("we," "us," or "our") on our website and through our services is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site or through our services.
                </p>
                <p className="text-gray-600">
                  Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Professional Advice Disclaimer
                </h2>
                <p className="text-gray-600 mb-4">
                  The site and our services are not intended to provide professional advice, including but not limited to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                  <li>Legal advice</li>
                  <li>Financial or investment advice</li>
                  <li>Tax advice</li>
                  <li>Accounting advice</li>
                  <li>Medical or health advice</li>
                </ul>
                <p className="text-gray-600">
                  While we connect you with service providers who may offer professional services, you should always seek the advice of qualified professionals for your specific situation. Do not disregard professional advice or delay seeking it because of something you have read on this site.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Third-Party Services Disclaimer
                </h2>
                <p className="text-gray-600 mb-4">
                  A Startup Biz connects users with third-party service providers. We do not:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                  <li>Guarantee the quality, accuracy, or reliability of services provided by third parties</li>
                  <li>Endorse or recommend any specific service provider</li>
                  <li>Assume responsibility for the actions or omissions of service providers</li>
                  <li>Act as an agent or representative of any service provider</li>
                </ul>
                <p className="text-gray-600">
                  Any agreement you enter into with a service provider is strictly between you and that provider. We encourage you to perform your own due diligence before engaging any service provider.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Earnings and Results Disclaimer
                </h2>
                <p className="text-gray-600 mb-4">
                  Any earnings or income statements, or examples of earnings or income, are only estimates of what you might earn. There is no assurance you will do as well as stated in any examples. If you rely upon any figures provided, you must accept the entire risk of not doing as well as the information provided.
                </p>
                <p className="text-gray-600">
                  This applies to any testimonials or case studies on this site. Past performance is not indicative of future results.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Partner Program Disclaimer
                </h2>
                <p className="text-gray-600 mb-4">
                  Information about our partner program, including commission rates and potential earnings, is subject to change without notice. We reserve the right to modify the terms of our partner program at any time.
                </p>
                <p className="text-gray-600">
                  Participation in the partner program does not create an employment, agency, or franchise relationship between you and A Startup Biz.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  External Links Disclaimer
                </h2>
                <p className="text-gray-600 mb-4">
                  The site may contain links to external websites that are not provided or maintained by us. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
                </p>
                <p className="text-gray-600">
                  The inclusion of any links does not imply a recommendation or endorsement of the views expressed within them.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Testimonials Disclaimer
                </h2>
                <p className="text-gray-600 mb-4">
                  The site may contain testimonials from users of our services or products. These testimonials reflect the real-life experiences and opinions of such users. However, the experiences are personal to those particular users and may not be representative of all users.
                </p>
                <p className="text-gray-600">
                  We do not claim that testimonials represent typical results. Individual results will vary.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No Guarantees
                </h2>
                <p className="text-gray-600">
                  We make no guarantees regarding the specific results you will achieve from using our services or working with service providers we connect you with. Success depends on many factors, including but not limited to your industry, market conditions, business model, and individual effort.
                </p>
              </section>

              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Changes to This Disclaimer
                </h2>
                <p className="text-gray-600">
                  We may update this disclaimer from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this disclaimer periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Contact Us
                </h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this disclaimer, please contact us:
                </p>
                <ul className="list-none space-y-2 text-gray-600">
                  <li>Email: legal@astartupbiz.com</li>
                  <li>Website: www.astartupbiz.com/contact</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
