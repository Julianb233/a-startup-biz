"use client"

import { motion } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  DollarSign,
  TrendingUp,
  Users,
  Award,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Headphones,
  BarChart3,
  Gift,
  Globe,
  Clock,
  Shield,
  Zap,
  Target,
  Sparkles,
  FileText,
  Video,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"

const financialBenefits = [
  {
    icon: DollarSign,
    title: "Up to 20% Commission",
    description: "Earn industry-leading commission rates on every successful referral. Higher tiers unlock even better rates.",
    highlight: "20%",
  },
  {
    icon: TrendingUp,
    title: "Recurring Revenue",
    description: "Earn ongoing commissions for subscription-based services. Build passive income that compounds over time.",
    highlight: "Monthly",
  },
  {
    icon: Gift,
    title: "Performance Bonuses",
    description: "Hit quarterly targets and earn additional bonuses on top of your regular commissions.",
    highlight: "+25%",
  },
  {
    icon: Clock,
    title: "Fast Payouts",
    description: "Receive your earnings within 30 days of client conversion. No waiting, no hassle.",
    highlight: "30 Days",
  },
]

const supportBenefits = [
  {
    icon: Headphones,
    title: "Dedicated Partner Manager",
    description: "Get one-on-one support from a dedicated partner success manager who understands your business.",
  },
  {
    icon: MessageSquare,
    title: "Priority Support",
    description: "Skip the queue with priority access to our support team for you and your referred clients.",
  },
  {
    icon: GraduationCap,
    title: "Training Programs",
    description: "Access comprehensive training on our services, sales techniques, and industry best practices.",
  },
  {
    icon: Video,
    title: "Weekly Webinars",
    description: "Join exclusive partner webinars featuring tips, updates, and success strategies.",
  },
]

const marketingBenefits = [
  {
    icon: FileText,
    title: "Marketing Materials",
    description: "Access professionally designed brochures, presentations, and digital assets.",
  },
  {
    icon: Globe,
    title: "Co-Branded Content",
    description: "Create co-branded marketing materials to strengthen your professional image.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track referrals, conversions, and earnings in real-time through your partner portal.",
  },
  {
    icon: Sparkles,
    title: "Lead Generation",
    description: "Get access to warm leads and marketing campaigns to boost your referral pipeline.",
  },
]

const tierBenefits = [
  {
    tier: "Bronze",
    referrals: "1-5",
    commission: "10%",
    features: [
      "Basic marketing materials",
      "Monthly payouts",
      "Email support",
      "Partner portal access",
    ],
  },
  {
    tier: "Silver",
    referrals: "6-15",
    commission: "15%",
    features: [
      "All Bronze benefits",
      "Co-branded materials",
      "Priority support",
      "Quarterly bonuses",
      "Training webinars",
    ],
  },
  {
    tier: "Gold",
    referrals: "16-30",
    commission: "18%",
    features: [
      "All Silver benefits",
      "Dedicated partner manager",
      "Lead sharing program",
      "Custom marketing campaigns",
      "VIP event invitations",
    ],
  },
  {
    tier: "Platinum",
    referrals: "31+",
    commission: "20%",
    features: [
      "All Gold benefits",
      "Custom commission structures",
      "White-label solutions",
      "API access",
      "Revenue sharing options",
      "Executive relationship",
    ],
  },
]

const faqItems = [
  {
    question: "How much can I realistically earn?",
    answer: "Earnings vary based on your network and effort. Our top partners earn $5,000-$15,000 monthly, while average active partners earn $1,000-$3,000. The more quality referrals you make, the more you earn.",
  },
  {
    question: "When do I get paid?",
    answer: "Commissions are paid out monthly, typically within 30 days of a successful client conversion. You can track all pending and completed payouts in your partner dashboard.",
  },
  {
    question: "Are there any costs to join?",
    answer: "No! Our partner program is completely free to join. There are no setup fees, monthly costs, or hidden charges. You only earn - you never pay.",
  },
  {
    question: "How long do referral links last?",
    answer: "Your referral tracking lasts 90 days. If someone clicks your link and converts within 90 days, you receive the commission.",
  },
  {
    question: "Can I refer existing clients?",
    answer: "Yes! If you have existing clients who could benefit from our services, you can absolutely refer them and earn commissions. Just note that they must be new to our platform.",
  },
  {
    question: "What services can I refer for?",
    answer: "You can earn commissions on all our core services including legal, accounting, marketing, web design, insurance, and business consulting. Different services may have different commission rates.",
  },
]

export default function PartnerBenefitsPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white scroll-smooth">
      <Header />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur rounded-full text-white text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Partner Benefits
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Everything You Get as a Partner
            </h1>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              From generous commissions to comprehensive support, discover all the
              benefits of joining our partner program.
            </p>
            <Link
              href="/apply"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
            >
              Become a Partner
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Financial Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
              <DollarSign className="w-4 h-4" />
              Financial Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Maximize Your Earnings
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our competitive commission structure is designed to reward your efforts
              and help you build sustainable income.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {financialBenefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {benefit.highlight}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              Tier System
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Grow Your Tier, Grow Your Rewards
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              As you refer more clients, you unlock higher tiers with better commission
              rates and exclusive benefits.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tierBenefits.map((tier, index) => (
              <motion.div
                key={tier.tier}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-6 ${
                  index === 3
                    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white ring-4 ring-orange-500/20"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div
                  className={`text-sm font-medium mb-2 ${
                    index === 3 ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  {tier.referrals} Referrals
                </div>
                <h3
                  className={`text-2xl font-bold mb-1 ${
                    index === 3 ? "text-white" : "text-gray-900"
                  }`}
                >
                  {tier.tier}
                </h3>
                <div
                  className={`text-4xl font-bold mb-4 ${
                    index === 3 ? "text-orange-400" : "text-orange-600"
                  }`}
                >
                  {tier.commission}
                </div>
                <ul className="space-y-2">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          index === 3 ? "text-orange-400" : "text-green-500"
                        }`}
                      />
                      <span
                        className={
                          index === 3 ? "text-gray-300" : "text-gray-600"
                        }
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Benefits */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Headphones className="w-4 h-4" />
              Support & Training
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              We're Here to Help You Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the support and resources you need to maximize your partnership.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {supportBenefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-6 bg-blue-50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Marketing Benefits */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium mb-4">
              <BarChart3 className="w-4 h-4" />
              Marketing & Tools
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tools to Grow Your Referrals
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Access professional marketing materials and powerful tracking tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {marketingBenefits.map((benefit, index) => {
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
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We've got answers.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
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
              Ready to Unlock These Benefits?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join our partner program today and start enjoying all these benefits.
              It's free to join and takes just minutes to apply.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/apply"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                Apply Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/become-partner"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white/10 transition-all"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
