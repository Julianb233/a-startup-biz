"use client"

import { motion } from "framer-motion"

interface ValueItem {
  label: string
  value: string
  description?: string
}

const valueItems: ValueItem[] = [
  {
    label: "Dedicated Account Manager",
    value: "$2,364/yr",
    description: "Personal support & optimization",
  },
  {
    label: "Marketing Kit & Templates",
    value: "$297",
    description: "Ready-to-use promotional materials",
  },
  {
    label: "Revenue Optimization Consult",
    value: "$500",
    description: "Custom strategy session",
  },
  {
    label: "Priority 48-Hour Integration",
    value: "$400",
    description: "Fast-track setup & launch",
  },
  {
    label: "Forecasting Dashboard",
    value: "$150",
    description: "Real-time revenue tracking",
  },
  {
    label: "Staff Compliance Training",
    value: "$300",
    description: "Complete team onboarding",
  },
  {
    label: "Premium Commission Rate (25%)",
    value: "Priceless",
    description: "Industry-leading revenue share",
  },
]

export function ValueStack() {
  // Calculate total numeric value
  const totalValue = valueItems
    .filter(item => item.value !== "Priceless")
    .reduce((sum, item) => {
      const numericValue = parseInt(item.value.replace(/[^0-9]/g, ""))
      return sum + numericValue
    }, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="relative overflow-hidden">
        {/* Main value stack card */}
        <div className="relative bg-white rounded-2xl p-8 md:p-10 border-2 border-teal-400/30 shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-600/5 rounded-full blur-2xl" />

          {/* Content container */}
          <div className="relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <div className="inline-block mb-3">
                <div className="bg-teal-500/10 backdrop-blur-sm px-6 py-2.5 rounded-full border border-teal-500/30">
                  <span className="text-teal-600 text-xl md:text-3xl font-bold uppercase tracking-wider">
                    What You Get FREE
                  </span>
                </div>
              </div>
              <h3 className="font-[family-name:var(--font-oswald)] text-2xl md:text-4xl font-bold text-slate-900 mb-2 uppercase tracking-tight">
                The Complete Partner Package
              </h3>
              <p className="text-slate-600 text-sm md:text-base">
                Everything you need to start earning commissions—at zero cost
              </p>
            </motion.div>

            {/* Value Items - Receipt Style */}
            <div className="space-y-1 mb-6">
              {valueItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.08 }}
                  className="group"
                >
                  <div className="flex items-start gap-3 py-3 px-4 rounded-lg hover:bg-teal-50/50 transition-colors">
                    {/* Checkmark icon */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.08, type: "spring", stiffness: 200 }}
                      className="flex-shrink-0 mt-0.5"
                    >
                      <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </motion.div>

                    {/* Label and description */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-4">
                        <span className="text-slate-700 font-semibold text-sm md:text-base">
                          {item.label}
                        </span>

                        {/* Dotted line */}
                        <div className="flex-1 border-b-2 border-dotted border-slate-300 mb-1.5 hidden sm:block" />

                        {/* Value */}
                        <span className="text-teal-600 font-bold text-sm md:text-base whitespace-nowrap">
                          {item.value}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-slate-500 text-xs mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent mb-6 origin-left"
            />

            {/* Subtotal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 }}
              className="flex items-center justify-between px-4 mb-2"
            >
              <span className="text-slate-600 font-semibold text-base md:text-lg">
                TOTAL VALUE:
              </span>
              <span className="text-slate-700 font-bold text-lg md:text-xl">
                ${totalValue.toLocaleString()}+
              </span>
            </motion.div>

            {/* Double line divider */}
            <div className="space-y-1 mb-6">
              <div className="h-0.5 bg-slate-400" />
              <div className="h-0.5 bg-slate-400" />
            </div>

            {/* Your Investment - The Big Reveal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.1, type: "spring", stiffness: 150 }}
              className="relative"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-teal-400/20 to-teal-500/20 rounded-xl blur-xl" />

              <div className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-xl p-6 md:p-8 border-2 border-teal-400">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white/80 text-xs md:text-sm font-semibold uppercase tracking-wider mb-1">
                      Your Investment Today
                    </div>
                    <div className="flex items-baseline gap-3">
                      <div className="text-white/40 text-2xl md:text-3xl font-bold line-through decoration-2">
                        ${totalValue.toLocaleString()}
                      </div>
                      <div className="text-white text-4xl md:text-6xl font-black">
                        $0
                      </div>
                    </div>
                  </div>

                  {/* Badge */}
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut"
                    }}
                    className="hidden md:block"
                  >
                    <div className="bg-white rounded-full p-4 shadow-xl">
                      <svg className="w-12 h-12 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                      </svg>
                    </div>
                  </motion.div>
                </div>

                {/* Bottom text */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1.3 }}
                  className="mt-4 pt-4 border-t border-white/20"
                >
                  <div className="flex flex-wrap items-center gap-3 text-white/95">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm md:text-base font-semibold">
                      No setup fees. No monthly costs. No hidden charges. Ever.
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Bottom CTA hint */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4 }}
              className="text-center mt-6"
            >
              <p className="text-slate-600 text-sm">
                <span className="font-semibold text-teal-600">
                  You save ${totalValue.toLocaleString()}+
                </span>
                {" "}when you partner with us today
              </p>
            </motion.div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-teal-500/20 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-teal-500/20 rounded-bl-2xl" />
        </div>

        {/* Floating sparkles */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-2 h-2 bg-teal-500 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: 0,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-teal-400 rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: 1.5,
          }}
        />
      </div>
    </motion.div>
  )
}
