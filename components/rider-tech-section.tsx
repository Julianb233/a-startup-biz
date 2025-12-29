"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft } from "lucide-react"

const SPINNING_BG = "/images/hero-blank-bg.jpg"

const SOLUTION_IMAGES = {
  "lead-gen": "/ai-lead-generation-sales-futuristic.jpg",
  "support-bot": "/ai-customer-service-chatbot-futuristic.jpg",
  appointment: "/ai-workflow-automation-n8n-futuristic.jpg",
  accountant: "/ai-data-analytics-dashboard-futuristic.jpg",
  "project-manager": "/ai-workflow-automation-n8n-futuristic.jpg",
}

interface Solution {
  id: string
  title: string
  description: string
  benefits: string[]
  stats: { label: string; value: string }[]
}

const solutions: Solution[] = [
  {
    id: "lead-gen",
    title: "Lead Gen Machine",
    description:
      "Turn cold traffic into qualified leads on autopilot. Our AI identifies, engages, and nurtures prospects 24/7 so you wake up to a full pipeline.",
    benefits: ["3x more qualified leads", "80% reduction in cost per lead", "Automated follow-up sequences"],
    stats: [
      { label: "Avg. ROI", value: "340%" },
      { label: "Setup Time", value: "48hrs" },
    ],
  },
  {
    id: "support-bot",
    title: "Live Support Bot",
    description:
      "Never miss a customer inquiry again. Instant responses, smart escalation, and happy customers around the clock—without hiring a single support rep.",
    benefits: ["95% instant resolution rate", "Zero wait times", "Multi-language support"],
    stats: [
      { label: "Response", value: "<2sec" },
      { label: "Satisfaction", value: "98%" },
    ],
  },
  {
    id: "appointment",
    title: "Appointment Setter",
    description:
      "Your AI assistant books meetings while you sleep. Intelligent scheduling that syncs with your calendar and pre-qualifies every prospect.",
    benefits: ["Auto-qualification", "Calendar integration", "Reminder sequences"],
    stats: [
      { label: "Show Rate", value: "89%" },
      { label: "Time Saved", value: "20hrs/wk" },
    ],
  },
  {
    id: "accountant",
    title: "AI Accountant",
    description:
      "Automated bookkeeping, expense tracking, and financial insights. Focus on growth, not spreadsheets. Your books are always up to date.",
    benefits: ["Real-time tracking", "Tax optimization", "Cash flow forecasting"],
    stats: [
      { label: "Accuracy", value: "99.9%" },
      { label: "Hours Saved", value: "40+/mo" },
    ],
  },
  {
    id: "project-manager",
    title: "AI Project Manager",
    description:
      "Your intelligent project orchestrator that tracks deadlines, manages resources, and keeps your entire team aligned. Never miss a milestone or let a task slip through the cracks.",
    benefits: ["Automated task tracking", "Resource optimization", "Real-time progress insights"],
    stats: [
      { label: "On-Time Rate", value: "94%" },
      { label: "Efficiency", value: "+60%" },
    ],
  },
]

export default function RiderTechSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextSlide = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % solutions.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + solutions.length) % solutions.length)
  }

  const activeSolution = solutions[activeIndex]

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <section id="solutions" className="relative min-h-screen bg-[#0A4D3C] px-6 md:px-12 overflow-hidden py-20">
      {/* Spinning background effect */}
      <motion.div
        className="absolute inset-[-50%] z-0 origin-center opacity-20"
        animate={{ rotate: 360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <img
          src={SPINNING_BG}
          alt="Rotating emerald cosmic swirl background"
          className="w-full h-full object-cover"
          style={{ filter: "blur(2px)" }}
        />
      </motion.div>

      {/* Golden flares */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-[#D4A84B] rounded-full"
            style={{
              left: `${5 + i * 8}%`,
              top: `${10 + (i % 4) * 22}%`,
              boxShadow: "0 0 20px rgba(212, 168, 75, 0.8)",
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.7, 1.2, 0.7],
            }}
            transition={{
              duration: 4,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 md:mb-16">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-tight">
            <span className="block leading-[0.85] text-[#FDF8E8]">SOLUTIONS</span>
            <span className="block text-[#D4A84B] text-6xl md:text-8xl">Catalog</span>
          </h2>
          <p className="text-lg mt-6 max-w-2xl text-[#F0D98C] md:text-xl font-medium">
            Ready-to-deploy AI systems that start working for your business from day one. No technical expertise
            required.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Image Side */}
            <div className="relative aspect-[3/4] max-w-md mx-auto w-full">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-[#D4A84B]/30 shadow-2xl">
                    <img
                      src={SOLUTION_IMAGES[activeSolution.id as keyof typeof SOLUTION_IMAGES] || "/placeholder.svg"}
                      alt={activeSolution.title}
                      className="w-full h-full object-cover"
                      style={{ filter: "sepia(60%) saturate(150%) hue-rotate(80deg) brightness(0.9)" }}
                    />
                    {/* Strong brand color overlay for green/gold tint - removes blue completely */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0A4D3C]/60 via-[#0D6B4F]/40 to-[#D4A84B]/30 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-[#0A4D3C]/30" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A4D3C]/80 via-transparent to-[#0A4D3C]/40" />
                    {/* Shimmer */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4A84B]/20 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                    />
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0A4D3C]/80 backdrop-blur-sm border border-[#D4A84B]/50 text-[#D4A84B] hover:bg-[#D4A84B] hover:text-[#0A4D3C] transition-all z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#0A4D3C]/80 backdrop-blur-sm border border-[#D4A84B]/50 text-[#D4A84B] hover:bg-[#D4A84B] hover:text-[#0A4D3C] transition-all z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Content Side */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h3 className="text-3xl md:text-4xl font-bold text-[#D4A84B]">{activeSolution.title}</h3>

                <p className="text-xl text-[#FDF8E8]/80 leading-relaxed">{activeSolution.description}</p>

                <div className="space-y-3">
                  {activeSolution.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#D4A84B]" />
                      <span className="text-[#F0D98C] font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-6 pt-4">
                  {activeSolution.stats.map((stat, idx) => (
                    <div key={idx} className="bg-[#0D6B4F]/50 rounded-xl px-6 py-4 border border-[#D4A84B]/20">
                      <div className="text-xs uppercase tracking-wider text-[#FDF8E8]/50 mb-1">{stat.label}</div>
                      <div className="text-2xl font-bold text-[#D4A84B]">{stat.value}</div>
                    </div>
                  ))}
                </div>

                <a
                  href={`/agents/${activeSolution.id}`}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4A84B] text-[#0A4D3C] font-bold rounded-xl hover:bg-[#E8C55A] transition-all duration-300 shadow-lg hover:shadow-[#D4A84B]/30 mt-6"
                >
                  Learn More About {activeSolution.title}
                  <ChevronRight className="w-5 h-5" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-3 mt-12">
            {solutions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > activeIndex ? 1 : -1)
                  setActiveIndex(idx)
                }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? "bg-[#D4A84B] w-8" : "bg-[#FDF8E8]/30 w-3 hover:bg-[#FDF8E8]/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
