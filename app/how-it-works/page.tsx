"use client"

import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  Search,
  MessageSquare,
  ClipboardCheck,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Users,
  Shield,
  Clock,
  Star,
  Sparkles,
  PhoneCall,
  FileText,
  Handshake,
  Settings,
  BarChart3,
  HeadphonesIcon,
} from "lucide-react"
import Link from "next/link"

const steps = [
  {
    number: "01",
    title: "Tell Us About Your Business",
    description: "Start by sharing your business details and goals. Our simple onboarding process captures everything we need to understand your unique situation.",
    icon: MessageSquare,
    features: [
      "Quick online intake form",
      "Business assessment questionnaire",
      "Goal setting session",
      "Document upload portal",
    ],
    color: "orange",
  },
  {
    number: "02",
    title: "Get Your Personalized Plan",
    description: "Our team analyzes your needs and creates a customized service package. We match you with the right providers for your specific requirements.",
    icon: ClipboardCheck,
    features: [
      "Expert analysis of your needs",
      "Custom service recommendations",
      "Transparent pricing breakdown",
      "Timeline and milestone planning",
    ],
    color: "blue",
  },
  {
    number: "03",
    title: "Connect With Experts",
    description: "We introduce you to vetted professionals who specialize in your industry. Schedule consultations and choose the right fit for your business.",
    icon: Users,
    features: [
      "Pre-vetted service providers",
      "Industry-specific matching",
      "Free initial consultations",
      "Flexible scheduling",
    ],
    color: "green",
  },
  {
    number: "04",
    title: "Launch & Grow",
    description: "Work with your chosen providers to execute your plan. We stay involved to ensure everything runs smoothly and your business thrives.",
    icon: Rocket,
    features: [
      "Ongoing project management",
      "Progress tracking dashboard",
      "Regular check-ins",
      "Continuous optimization",
    ],
    color: "purple",
  },
]

const services = [
  {
    title: "Legal Services",
    description: "Business formation, contracts, compliance, and legal protection.",
    icon: FileText,
    time: "1-2 weeks",
  },
  {
    title: "Accounting & Tax",
    description: "Bookkeeping, tax planning, financial reporting, and CFO services.",
    icon: BarChart3,
    time: "2-3 days setup",
  },
  {
    title: "Website & Marketing",
    description: "Professional websites, SEO, social media, and digital marketing.",
    icon: Sparkles,
    time: "2-4 weeks",
  },
  {
    title: "Business Insurance",
    description: "General liability, professional liability, and specialized coverage.",
    icon: Shield,
    time: "Same day quotes",
  },
  {
    title: "Consulting",
    description: "Strategy, operations, growth planning, and business coaching.",
    icon: Handshake,
    time: "Ongoing",
  },
  {
    title: "Tech Solutions",
    description: "Software setup, integrations, automation, and IT support.",
    icon: Settings,
    time: "1-2 weeks",
  },
]

const benefits = [
  {
    icon: Clock,
    title: "Save Time",
    description: "Skip the research. We've already vetted and compared providers so you don't have to.",
  },
  {
    icon: Shield,
    title: "Reduce Risk",
    description: "Work with pre-qualified professionals who meet our strict quality standards.",
  },
  {
    icon: Star,
    title: "Get Results",
    description: "Our curated network delivers proven results. We only work with the best.",
  },
  {
    icon: HeadphonesIcon,
    title: "Ongoing Support",
    description: "We're with you every step of the way. Questions? We've got answers.",
  },
]

const testimonials = [
  {
    name: "Alex Thompson",
    business: "Tech Startup Founder",
    quote: "A Startup Biz connected me with an amazing accountant and lawyer within days. What would have taken me weeks of research happened in one afternoon.",
    rating: 5,
  },
  {
    name: "Maria Santos",
    business: "Restaurant Owner",
    quote: "The personalized approach made all the difference. They understood my industry and matched me with providers who specialized in hospitality.",
    rating: 5,
  },
  {
    name: "David Park",
    business: "E-commerce Entrepreneur",
    quote: "From incorporation to marketing, they helped me set up everything I needed. One platform, all my business needs handled.",
    rating: 5,
  },
]

const faqs = [
  {
    question: "How much does it cost to get started?",
    answer: "Getting started is completely free. You only pay for the services you choose to use. We provide transparent pricing upfront with no hidden fees or surprises.",
  },
  {
    question: "How long does the onboarding process take?",
    answer: "Most clients complete our intake process in about 15 minutes. From there, you'll receive personalized recommendations within 24-48 hours.",
  },
  {
    question: "Can I choose my own service providers?",
    answer: "Absolutely! We present you with vetted options and recommendations, but you always have the final say. You can also request specific providers or specialties.",
  },
  {
    question: "What if I'm not satisfied with a provider?",
    answer: "Your satisfaction is our priority. If a match isn't working, let us know and we'll help you transition to a different provider at no additional cost.",
  },
  {
    question: "Do you work with businesses of all sizes?",
    answer: "Yes! Whether you're a solopreneur just starting out or an established business looking to scale, we have solutions tailored to your stage and budget.",
  },
]

export default function HowItWorksPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white scroll-smooth">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Simple & Effective
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              How It{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Works
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Getting the business support you need shouldn't be complicated. Here's
              how we make it simple.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/25"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/book-call"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                <PhoneCall className="w-5 h-5" />
                Book a Call
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Four Simple Steps to Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our streamlined process gets you connected with the right resources fast.
            </p>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 1
              const colorClasses = {
                orange: "from-orange-500 to-orange-600",
                blue: "from-blue-500 to-blue-600",
                green: "from-green-500 to-green-600",
                purple: "from-purple-500 to-purple-600",
              }

              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col ${
                    isEven ? "lg:flex-row-reverse" : "lg:flex-row"
                  } gap-8 lg:gap-16 items-center`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <span
                        className={`text-6xl font-bold bg-gradient-to-r ${
                          colorClasses[step.color as keyof typeof colorClasses]
                        } bg-clip-text text-transparent`}
                      >
                        {step.number}
                      </span>
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                          colorClasses[step.color as keyof typeof colorClasses]
                        } flex items-center justify-center`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                    <ul className="space-y-3">
                      {step.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1 w-full">
                    <div
                      className={`aspect-video rounded-2xl bg-gradient-to-br ${
                        colorClasses[step.color as keyof typeof colorClasses]
                      } p-1`}
                    >
                      <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center">
                        <Icon className="w-24 h-24 text-gray-300" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Services We Connect You With
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything your business needs to launch, operate, and grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {service.time}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition-colors"
            >
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose A Startup Biz?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We're not just a directory. We're your business support partner.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of business owners who trust us.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-orange-500 fill-orange-500"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <span className="text-white font-bold">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.business}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Questions? We've Got Answers
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join thousands of business owners who've streamlined their operations
              with A Startup Biz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/book-call"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-all"
              >
                <PhoneCall className="w-5 h-5" />
                Talk to an Expert
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
