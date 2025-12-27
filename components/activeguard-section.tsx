"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import {
  Shield,
  Check,
  Star,
  Calendar,
  CreditCard,
  ArrowRight,
  Users,
  Zap,
  Building2,
  TrendingUp,
  DollarSign,
  Repeat
} from "lucide-react"

function ValueCard({
  icon: Icon,
  title,
  description,
  highlight = false
}: {
  icon: React.ElementType
  title: string
  description: string
  highlight?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`p-6 rounded-2xl ${
        highlight
          ? "bg-teal-500 text-white"
          : "bg-white border border-slate-200"
      }`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
        highlight ? "bg-white/20" : "bg-teal-50"
      }`}>
        <Icon className={`w-6 h-6 ${highlight ? "text-white" : "text-teal-600"}`} />
      </div>
      <h3 className={`text-lg font-bold mb-2 ${highlight ? "text-white" : "text-slate-900"}`}>
        {title}
      </h3>
      <p className={highlight ? "text-white/90" : "text-slate-600"}>
        {description}
      </p>
    </motion.div>
  )
}

export function ActiveGuardSection() {
  return (
    <section className="relative bg-slate-50 py-20 md:py-28 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-100 to-transparent opacity-30" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-t from-teal-50 to-transparent opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 border border-teal-500/30 rounded-full mb-4">
            <Star className="w-4 h-4 text-teal-600" />
            <span className="text-teal-600 font-semibold text-sm">ActiveGuard Monthly</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Turn Memberships Into Recurring Revenue
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Bake coverage into your membership dues for just a few dollars a month.
            Your members stay protected, and you earn recurring commissions — automatically.
          </p>
        </motion.div>

        {/* How It Works for Business Owners */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <ValueCard
              icon={CreditCard}
              title="Add to Membership Dues"
              description="Include ActiveGuard as part of your monthly membership package. Members pay a few extra dollars for automatic coverage."
            />
            <ValueCard
              icon={Repeat}
              title="Recurring Commissions"
              description="Unlike one-time sales, you earn commission every single month for as long as members stay enrolled."
              highlight={true}
            />
            <ValueCard
              icon={Shield}
              title="Members Stay Protected"
              description="Coverage activates automatically every time they visit. No paperwork, no hassle — just peace of mind."
            />
          </div>
        </motion.div>

        {/* Single-Use vs Monthly - Business Owner Perspective */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Two Ways to Earn
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Single-Use */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-slate-900">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Single-Use Coverage</h4>
              </div>
              <p className="text-slate-600 mb-4">
                Perfect for day passes, drop-ins, and one-time visitors.
                Earn commission on each purchase.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-slate-500" />
                  Commission per transaction
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-slate-500" />
                  Great for seasonal businesses
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-slate-500" />
                  No commitment from members
                </li>
              </ul>
              <div className="text-sm font-medium text-slate-500">
                Best for: Rentals, day passes, events
              </div>
            </div>

            {/* Monthly ActiveGuard */}
            <div className="p-6 rounded-2xl bg-teal-500/10 border-2 border-teal-500/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-500">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Monthly ActiveGuard</h4>
                  <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full">
                    Higher Earnings
                  </span>
                </div>
              </div>
              <p className="text-slate-600 mb-4">
                Bundle into membership dues and earn recurring commissions every month.
                Build predictable revenue that grows with your member base.
              </p>
              <ul className="space-y-2 mb-4">
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-teal-500" />
                  <strong>Recurring monthly commissions</strong>
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-teal-500" />
                  Just a few dollars added to dues
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-teal-500" />
                  Revenue grows with membership
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-teal-500" />
                  Unlimited visits covered
                </li>
              </ul>
              <div className="text-sm font-medium text-teal-600">
                Best for: Gyms, studios, wellness centers
              </div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Growth - Simplified */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-slate-900 rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/20 rounded-full mb-4">
                <TrendingUp className="w-4 h-4 text-teal-400" />
                <span className="text-teal-400 text-sm font-medium">Grow With Your Members</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                More Members = More Monthly Revenue
              </h3>
              <p className="text-slate-300 mb-6">
                ActiveGuard creates predictable income tied directly to your membership count.
                As your member base grows, your commission earnings grow with it — automatically, every month.
              </p>
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-slate-300">
                  <DollarSign className="w-5 h-5 text-teal-400" />
                  <span>Earn per member, per month</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Repeat className="w-5 h-5 text-teal-400" />
                  <span>Recurring passive income</span>
                </div>
              </div>
              <Link
                href="#calculator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-full font-medium hover:bg-teal-400 transition-colors"
              >
                Calculate Your Potential
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { members: 100, range: "$500 - $2,500" },
                { members: 250, range: "$1,250 - $6,250" },
                { members: 500, range: "$2,500 - $12,500" },
                { members: 1000, range: "$5,000 - $25,000" }
              ].map((row, index) => (
                <motion.div
                  key={row.members}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center justify-between bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span className="text-white font-medium">{row.members.toLocaleString()} members</span>
                  </div>
                  <div className="text-right">
                    <div className="text-teal-400 font-bold text-lg">{row.range}</div>
                    <div className="text-slate-500 text-xs">per month</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Eligible Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full border border-slate-200 shadow-sm">
            <Building2 className="w-5 h-5 text-slate-500" />
            <span className="text-slate-600">
              Available for <strong className="text-slate-900">Fitness/Gyms</strong> and{" "}
              <strong className="text-slate-900">Aesthetic Wellness</strong> facilities
            </span>
            <Zap className="w-5 h-5 text-teal-500" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
