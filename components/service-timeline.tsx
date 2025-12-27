"use client"

import { motion } from "framer-motion"
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
  Phone,
  ClipboardCheck,
  Cog,
  CheckCircle,
  ArrowRight,
} from "lucide-react"
import { TimelineStep } from "@/lib/service-data"

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
  Phone,
  ClipboardCheck,
  Cog,
  CheckCircle,
}

interface ServiceTimelineProps {
  timeline: TimelineStep[]
  serviceTitle: string
}

export default function ServiceTimeline({ timeline, serviceTitle }: ServiceTimelineProps) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-[#ff6a1a]/10 border border-[#ff6a1a]/20">
            <Clock className="w-4 h-4 text-[#ff6a1a]" />
            <span className="text-sm font-semibold text-[#ff6a1a] uppercase tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Your Journey
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            How We Work Together
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            A clear, structured approach to delivering results for your business
          </p>
        </motion.div>

        {/* Desktop Timeline - Horizontal */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-gray-200">
              <motion.div
                className="h-full bg-gradient-to-r from-[#ff6a1a] to-[#e55f17]"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>

            {/* Timeline steps */}
            <div className="relative grid" style={{ gridTemplateColumns: `repeat(${timeline.length}, 1fr)` }}>
              {timeline.map((step, index) => {
                const Icon = iconMap[step.icon] || CheckCircle
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="flex flex-col items-center text-center px-4"
                  >
                    {/* Step indicator */}
                    <motion.div
                      className="relative z-10 w-32 h-32 rounded-full bg-white border-4 border-[#ff6a1a] flex items-center justify-center shadow-lg mb-6"
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#ff6a1a] text-white flex items-center justify-center text-sm font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {index + 1}
                      </div>
                      <Icon className="w-12 h-12 text-[#ff6a1a]" />
                    </motion.div>

                    {/* Step label */}
                    <div className="text-xs font-semibold text-[#ff6a1a] uppercase tracking-wider mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {step.step}
                    </div>

                    {/* Step title */}
                    <h3 className="text-lg font-bold text-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {step.title}
                    </h3>

                    {/* Step description */}
                    <p className="text-sm text-gray-600 leading-relaxed max-w-[200px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {step.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet Timeline - Vertical */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200">
              <motion.div
                className="w-full bg-gradient-to-b from-[#ff6a1a] to-[#e55f17]"
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>

            {/* Timeline steps */}
            <div className="space-y-8">
              {timeline.map((step, index) => {
                const Icon = iconMap[step.icon] || CheckCircle
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative flex items-start gap-6 pl-4"
                  >
                    {/* Step indicator */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-white border-4 border-[#ff6a1a] flex items-center justify-center shadow-lg">
                        <Icon className="w-7 h-7 text-[#ff6a1a]" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#ff6a1a] text-white flex items-center justify-center text-xs font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-2">
                      <div className="text-xs font-semibold text-[#ff6a1a] uppercase tracking-wider mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {step.step}
                      </div>
                      <h3 className="text-xl font-bold text-black mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {step.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom arrow indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center gap-2 text-[#ff6a1a] font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span>Ready to get started?</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
