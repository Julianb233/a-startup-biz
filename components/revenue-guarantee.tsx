"use client"

import { motion } from "framer-motion"

export function RevenueGuarantee() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="relative overflow-hidden">
        {/* Main guarantee card */}
        <div className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-2xl p-8 md:p-10 border-2 border-teal-400 shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-800/30 rounded-full blur-2xl" />

          {/* Content container */}
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Shield icon */}
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex-shrink-0"
              >
                <div className="relative w-20 h-20 md:w-24 md:h-24">
                  {/* Outer glow */}
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />

                  {/* Shield background */}
                  <div className="relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-xl">
                    {/* Shield icon */}
                    <svg
                      className="w-12 h-12 md:w-14 md:h-14 text-teal-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>

                    {/* Badge pulse effect */}
                    <motion.div
                      className="absolute inset-0 bg-teal-500/20 rounded-full"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut"
                      }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Text content */}
              <div className="flex-1 text-center md:text-left">
                {/* Badge label */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="inline-block mb-3"
                >
                  <div className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/30">
                    <span className="text-white text-xs md:text-sm font-bold uppercase tracking-wider">
                      Zero Risk Guarantee
                    </span>
                  </div>
                </motion.div>

                {/* Main headline */}
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="font-[family-name:var(--font-oswald)] text-2xl md:text-4xl font-bold text-white mb-3 uppercase tracking-tight"
                >
                  The $500 First Month Guarantee
                </motion.h3>

                {/* Description */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="text-white/95 text-base md:text-lg leading-relaxed max-w-3xl"
                >
                  If you don't earn at least{" "}
                  <span className="font-bold text-white">$500 in commissions</span> in your first{" "}
                  <span className="font-bold text-white">90 days</span>, we'll pay you{" "}
                  <span className="font-bold text-white">$250 for your time</span>.{" "}
                  <span className="font-extrabold text-white underline decoration-2 decoration-white/50">
                    You literally cannot lose.
                  </span>
                </motion.p>

                {/* Trust indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4"
                >
                  <div className="flex items-center gap-2 text-white/90">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">No Fine Print</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">Fully Guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">Zero Setup Cost</span>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Bottom accent bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-6 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full origin-left"
            />
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-white/20 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-white/20 rounded-bl-2xl" />
        </div>

        {/* Floating particles effect (optional) */}
        <motion.div
          className="absolute top-1/2 left-1/4 w-2 h-2 bg-white rounded-full"
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
          className="absolute top-1/3 right-1/4 w-2 h-2 bg-white rounded-full"
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: 1,
          }}
        />
      </div>
    </motion.div>
  )
}
