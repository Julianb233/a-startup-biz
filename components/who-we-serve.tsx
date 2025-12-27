"use client"

import { motion } from "framer-motion"
import { Dumbbell, Mountain, Bike, Sparkles } from "lucide-react"

const targetMarkets = [
  {
    title: "Fitness Centers & Gyms",
    icon: Dumbbell,
    description: "Day pass insurance, equipment liability coverage for your members.",
  },
  {
    title: "Rock Climbing Facilities",
    icon: Mountain,
    description: "Activity-specific coverage for bouldering, top rope, and lead climbing.",
  },
  {
    title: "Equipment Rentals",
    icon: Bike,
    description: "Bikes, kayaks, sporting goods - protect your inventory and renters.",
  },
  {
    title: "Adventure Sports",
    icon: Sparkles,
    description: "Zip lines, obstacle courses, trampoline parks - high-thrill coverage.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
}

export function WhoWeServe() {
  return (
    <section className="relative py-16 md:py-24 bg-white overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 via-transparent to-gray-50/50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4">
            Who We Serve
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Insurance solutions for active businesses
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {targetMarkets.map((market, index) => {
            const Icon = market.icon
            return (
              <motion.div
                key={market.title}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                {/* Teal hover accent border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-teal-500/0 to-teal-500/0 group-hover:from-teal-500/10 group-hover:to-teal-500/5 transition-all duration-300 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 inline-flex">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-teal-50 group-hover:bg-teal-500 transition-colors duration-300 flex items-center justify-center">
                      <Icon className="w-7 h-7 md:w-8 md:h-8 text-teal-500 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-teal-600 transition-colors duration-300">
                    {market.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {market.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="mt-6 flex items-center gap-2 text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-semibold">Learn More</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-12 md:mt-16"
        >
          <p className="text-gray-600 mb-6">
            Don't see your business type? We've got you covered.
          </p>
          <button className="inline-flex items-center gap-2 px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            <span>Contact Us</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
