"use client"

import { motion } from "framer-motion"

const stats = [
  { value: "340%", label: "Avg. ROI", description: "Return on investment" },
  { value: "8hrs", label: "Setup Time", description: "From start to launch" },
  { value: "100+", label: "Happy Clients", description: "Businesses transformed" },
  { value: "24/7", label: "Support", description: "For Golden Ticket Members", isGoldenTicket: true },
]

const partnerLogos = [
  { name: "n8n", icon: "N" },
  { name: "Make", icon: "M" },
  { name: "OpenAI", icon: "AI" },
  { name: "Zapier", icon: "Z" },
]

export function TrustBadges() {
  return (
    <section data-section="trust-badges" className="relative bg-[#0D5A45] py-12 md:py-16 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #D4A84B 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl lg:text-5xl font-black text-[#D4A84B] mb-1">
                {stat.value}
              </div>
              <div className="text-sm md:text-base font-bold text-white uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="text-xs text-white/60 mt-1 hidden md:block">
                {stat.isGoldenTicket ? (
                  <>
                    For{" "}
                    <span className="text-[#D4A84B] font-semibold">
                      Golden Ticket Members
                    </span>
                  </>
                ) : (
                  stat.description
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4A84B]/30 to-transparent mb-10" />

        {/* Partner Section */}
        <div className="text-center">
          <p className="text-[#D4A84B]/70 text-xs uppercase tracking-[0.3em] mb-6">
            Powered By Industry Leaders
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {partnerLogos.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg">
                  {partner.icon}
                </div>
                <span className="font-semibold text-sm md:text-base hidden md:inline">
                  {partner.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Response Time Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#D4A84B]/10 border border-[#D4A84B]/30">
            <svg className="w-5 h-5 text-[#D4A84B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white font-medium text-sm">
              <span className="text-[#D4A84B] font-bold">24-Hour Response Guarantee</span> — We reply to every inquiry within 24 hours
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
