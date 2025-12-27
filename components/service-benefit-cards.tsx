"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import {
  FileText,
  Scale,
  Calculator,
  BookOpen,
  Bot,
  Users,
  Globe,
  TrendingUp,
  Target,
  Briefcase,
  Server,
  Share2,
  Search,
  UserCheck,
  MessageCircle,
  PenTool,
  BarChart3,
  Check,
  Clock,
  Shield,
  Zap,
  Lightbulb,
  HeartHandshake,
  Award,
  Rocket,
  DollarSign,
  LineChart,
  Settings,
  Headphones,
  GraduationCap,
} from "lucide-react"
import { ServiceCard } from "@/lib/service-data"

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Scale,
  Calculator,
  BookOpen,
  Bot,
  Users,
  Globe,
  TrendingUp,
  Target,
  Briefcase,
  Server,
  Share2,
  Search,
  UserCheck,
  MessageCircle,
  PenTool,
  BarChart3,
  Check,
  Clock,
  Shield,
  Zap,
  Lightbulb,
  HeartHandshake,
  Award,
  Rocket,
  DollarSign,
  LineChart,
  Settings,
  Headphones,
  GraduationCap,
}

interface ServiceBenefitCardsProps {
  cards: ServiceCard[]
  serviceTitle: string
}

export default function ServiceBenefitCards({ cards, serviceTitle }: ServiceBenefitCardsProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-[#ff6a1a]/10 border border-[#ff6a1a]/20">
            <div className="w-2 h-2 rounded-full bg-[#ff6a1a] animate-pulse" />
            <span className="text-sm font-semibold text-[#ff6a1a] uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              What You'll Get
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            {serviceTitle} Benefits
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Click any card to discover more details
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BenefitCard card={card} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BenefitCard({ card, index }: { card: ServiceCard; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isFlipped) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const x = (e.clientX - centerX) / (rect.width / 2)
    const y = (e.clientY - centerY) / (rect.height / 2)

    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const Icon = iconMap[card.icon] || Zap

  return (
    <div
      ref={cardRef}
      className="perspective-1000 w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-[400px] cursor-pointer"
        style={{
          rotateX: isFlipped ? 0 : rotateX,
          rotateY: isFlipped ? 180 : rotateY,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of card */}
        <motion.div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative w-full h-full bg-white border-2 border-gray-200 rounded-2xl overflow-hidden group hover:border-[#ff6a1a]/50 transition-colors duration-300">
            {/* Gradient overlay on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-[#ff6a1a]/0 to-[#ff6a1a]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            {/* Corner accent */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#ff6a1a]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative z-10 w-full h-full p-8 flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] flex items-center justify-center shadow-lg"
                  animate={{
                    boxShadow: isHovered
                      ? [
                          "0 4px 20px rgba(255, 106, 26, 0.3)",
                          "0 4px 30px rgba(255, 106, 26, 0.5)",
                          "0 4px 20px rgba(255, 106, 26, 0.3)",
                        ]
                      : "0 4px 20px rgba(255, 106, 26, 0.3)",
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Flip hint */}
                <motion.div
                  className="flex items-center gap-1 text-gray-400 text-xs"
                  animate={{
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Flip</span>
                </motion.div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-black mb-2 group-hover:text-[#ff6a1a] transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {card.title}
                </h3>
                <p className="text-[#ff6a1a] font-semibold text-sm mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {card.tagline}
                </p>
                <p className="text-gray-600 leading-relaxed line-clamp-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {card.description}
                </p>
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff6a1a] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="relative w-full h-full bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-2xl overflow-hidden p-8">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "24px 24px"
              }} />
            </div>

            <div className="relative z-10 h-full flex flex-col">
              {/* Back header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-white/80 text-xs uppercase tracking-wider font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Key Highlights
                  </span>
                </div>
                <motion.div
                  className="text-white/60 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </motion.div>
              </div>

              {/* Title */}
              <h4 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {card.title}
              </h4>

              {/* Highlights list */}
              <div className="flex-1 space-y-3">
                {card.highlights.map((highlight, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90 text-sm leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {highlight}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Decorative element */}
              <div className="absolute bottom-4 right-4 w-20 h-20 rounded-full bg-white/10" />
              <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-white/5" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
