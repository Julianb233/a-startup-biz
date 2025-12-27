"use client"

import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Users, BookOpen, Youtube } from "lucide-react"

export function AILaunchCountdown() {
  const ctaOptions = [
    {
      title: "Business Consultation",
      description: "Get personalized AI strategy for your business to save time, cut costs, and scale faster.",
      icon: Sparkles,
      href: "#consultation",
      color: "from-wizard-cyan to-wizard-light-purple",
    },
    {
      title: "Learn to Build AI",
      description: "Master AI automation and build your own intelligent systems from scratch.",
      icon: BookOpen,
      href: "#learn",
      color: "from-wizard-purple to-wizard-bright-pink",
    },
    {
      title: "Join the Community",
      description: "Connect with like-minded entrepreneurs and AI enthusiasts transforming their lives.",
      icon: Users,
      href: "#community",
      color: "from-wizard-bright-pink to-wizard-cyan",
    },
    {
      title: "YouTube Resources",
      description: "Free tutorials, tips, and insights to get you started on your AI journey.",
      icon: Youtube,
      href: "#youtube",
      color: "from-wizard-light-purple to-wizard-cyan",
    },
  ]

  return (
    <div className="w-full overflow-hidden relative py-20 md:py-32 bg-wizard-dark-bg">
      <div className="absolute inset-0 z-0" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-brier text-5xl md:text-7xl lg:text-8xl text-wizard-cyan drop-shadow-2xl text-glow-cyan mb-4">
            READY TO TRANSFORM?
          </h2>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto">
            Whether you want to optimize your business, learn AI, or join a community of innovators — let's connect.
          </p>
        </motion.div>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {ctaOptions.map((option, index) => (
            <motion.a
              key={option.title}
              href={option.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${option.color} p-[2px]`}
            >
              <div className="relative h-full bg-wizard-dark-bg rounded-2xl p-8 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${option.color}`}>
                    <option.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{option.title}</h3>
                </div>
                <p className="text-white/70 text-lg">{option.description}</p>
                <div className="flex items-center gap-2 text-wizard-cyan font-semibold mt-auto group-hover:gap-4 transition-all">
                  Get Started <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Main CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-wizard-cyan via-wizard-purple to-wizard-bright-pink text-white font-bold text-xl px-10 py-5 rounded-full hover:scale-105 transition-transform shadow-2xl"
          >
            <Sparkles className="w-6 h-6" />
            Schedule a Free Consultation
            <ArrowRight className="w-6 h-6" />
          </a>
        </motion.div>
      </div>
    </div>
  )
}
