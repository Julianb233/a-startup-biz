"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

const sparkles = [
  { left: "7%", top: "12%", delay: 0, size: "lg" },
  { left: "91%", top: "18%", delay: 0.4, size: "lg" },
  { left: "12%", top: "82%", delay: 0.7, size: "lg" },
  { left: "87%", top: "78%", delay: 1.0, size: "lg" },
  { left: "50%", top: "8%", delay: 0.2, size: "md" },
  { left: "94%", top: "48%", delay: 0.6, size: "lg" },
  { left: "5%", top: "52%", delay: 0.3, size: "lg" },
  { left: "68%", top: "90%", delay: 0.9, size: "md" },
  { left: "32%", top: "95%", delay: 0.5, size: "lg" },
]

const getSparkleSize = (size: string) => {
  switch (size) {
    case "lg":
      return "w-5 h-5 md:w-7 md:h-7"
    case "md":
      return "w-4 h-4 md:w-5 md:h-5"
    default:
      return "w-3 h-3 md:w-4 md:h-4"
  }
}

const testimonials = [
  {
    name: "Sarah Mitchell",
    title: "CEO",
    company: "TechForward Solutions",
    quote: "Working with The Wizard of AI transformed our entire workflow. What used to take our team 40 hours a week now happens automatically. We've redirected that time to strategic growth initiatives.",
    results: {
      percentage: "87%",
      metric: "time saved on reporting",
      additional: "$12K/month in reduced labor costs"
    },
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    title: "Founder & Creative Director",
    company: "Content Studio Pro",
    quote: "I was skeptical about AI replacing the creative touch, but Julian showed me how to use it as a creative amplifier. Now I produce 3x the content in half the time, and it's better quality than ever.",
    results: {
      percentage: "300%",
      metric: "increase in content output",
      additional: "6-figure deal closed from extra capacity"
    },
    rating: 5,
  },
  {
    name: "Emily Chen",
    title: "VP of Operations",
    company: "Summit Digital Agency",
    quote: "The AI automation Julian implemented gave our 12-person agency the output capacity of a 40-person team. We're delivering more value to clients without hiring, and our profit margins have never been better.",
    results: {
      percentage: "65%",
      metric: "increase in profit margins",
      additional: "Client retention jumped to 94%"
    },
    rating: 5,
  },
  {
    name: "David Thompson",
    title: "Co-Founder",
    company: "Velocity Startups",
    quote: "Julian's approach to AI implementation is pure magic. He didn't just give us tools—he rebuilt our entire operational foundation. We launched 3 new products this quarter that would have taken us a year before.",
    results: {
      percentage: "400%",
      metric: "faster product launches",
      additional: "Saved 200+ hours per month"
    },
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const nextTestimonial = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial()
    }, 8000)
    return () => clearInterval(timer)
  }, [])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
  }

  return (
    <section className="relative bg-[#0A4D3C] py-20 md:py-32 overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle, i) => (
          <motion.div
            key={i}
            className={`absolute ${getSparkleSize(sparkle.size)} z-10 pointer-events-none`}
            style={{ left: sparkle.left, top: sparkle.top }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.7, 1, 0],
              scale: [0, 1.3, 0.9, 1.3, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3.5,
              delay: sparkle.delay,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1.2,
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"
                fill="#D4A84B"
                style={{ filter: "drop-shadow(0 0 10px rgba(212,168,75,0.95))" }}
              />
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Decorative swirls */}
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="swirl-gradient-testimonials" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A84B" />
              <stop offset="100%" stopColor="#E8C55A" />
            </linearGradient>
          </defs>
          <motion.path
            d="M100,10 Q150,50 140,100 T100,190 Q50,150 60,100 T100,10"
            fill="none"
            stroke="url(#swirl-gradient-testimonials)"
            strokeWidth="2"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            style={{ transformOrigin: "center" }}
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-[#FDF8E8] leading-tight tracking-tight">
            Success <span className="text-[#D4A84B]">Stories</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-[#F0D98C]/90 max-w-2xl mx-auto">
            Real results from real businesses who transformed their operations with AI
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="relative h-[550px] md:h-[500px] mb-8">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="absolute inset-0"
              >
                <div className="bg-[#0D6B4F]/40 backdrop-blur-sm rounded-3xl border-2 border-[#D4A84B]/30 p-8 md:p-12 h-full flex flex-col relative overflow-hidden">
                  {/* Golden corner accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#D4A84B]/20 to-transparent rounded-bl-[100px]" />

                  {/* Quote Icon */}
                  <div className="absolute top-8 left-8 opacity-10">
                    <Quote className="w-16 h-16 md:w-20 md:h-20 text-[#D4A84B]" />
                  </div>

                  {/* Stars */}
                  <div className="flex gap-1 mb-6 relative z-10">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-[#D4A84B] text-[#D4A84B]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl md:text-2xl text-[#FDF8E8] font-medium leading-relaxed mb-8 flex-grow relative z-10">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>

                  {/* Results Box */}
                  <div className="bg-[#D4A84B]/10 border border-[#D4A84B]/30 rounded-2xl p-6 mb-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-4xl md:text-5xl font-black text-[#D4A84B] mb-2">
                          {testimonials[currentIndex].results.percentage}
                        </div>
                        <div className="text-[#FDF8E8]/80 text-sm md:text-base">
                          {testimonials[currentIndex].results.metric}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-[#FDF8E8]/70 text-sm md:text-base">
                          {testimonials[currentIndex].results.additional}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A84B] to-[#E8C55A] flex items-center justify-center text-[#0A4D3C] font-black text-2xl">
                      {testimonials[currentIndex].name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[#FDF8E8] font-bold text-lg">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-[#D4A84B] text-sm">
                        {testimonials[currentIndex].title}, {testimonials[currentIndex].company}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-6">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-[#D4A84B]/20 border-2 border-[#D4A84B] text-[#D4A84B] flex items-center justify-center hover:bg-[#D4A84B] hover:text-[#0A4D3C] transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Dot Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-[#D4A84B]"
                      : "w-2 bg-[#D4A84B]/30 hover:bg-[#D4A84B]/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-[#D4A84B]/20 border-2 border-[#D4A84B] text-[#D4A84B] flex items-center justify-center hover:bg-[#D4A84B] hover:text-[#0A4D3C] transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-[#FDF8E8]/70 mb-6 text-lg">
            Ready to write your own success story?
          </p>
          <motion.a
            href="#apply"
            className="inline-flex items-center gap-3 px-8 py-4 bg-[#D4A84B] text-[#0A4D3C] font-bold text-lg rounded-xl hover:bg-[#E8C55A] transition-all duration-300 shadow-lg hover:shadow-[#D4A84B]/30"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Book Your Discovery Call
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
