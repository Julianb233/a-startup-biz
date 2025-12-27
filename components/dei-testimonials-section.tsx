"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote, MessageSquare, Play, X } from "lucide-react"

interface Testimonial {
  name: string
  title: string
  company: string
  companyLogo?: string // Optional company logo URL
  location: string
  industry: string
  customerSince: string
  quote: string
  videoUrl?: string // Optional video testimonial URL
  results: {
    percentage: string
    metric: string
    additional: string
  }
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Mitchell",
    title: "Owner & Head Coach",
    company: "PowerHouse CrossFit",
    companyLogo: undefined, // Can be replaced with actual logo URL
    location: "Austin, TX",
    industry: "Fitness & CrossFit",
    customerSince: "March 2023",
    quote: "I was skeptical at first, but adding Daily Event Insurance to our membership packages has been absolutely incredible. We're making an extra $2,400 every single month in commission, and our members actually thank us for offering it. It's the easiest revenue stream we've ever added—literally zero overhead, just pure profit.",
    videoUrl: undefined, // Can be replaced with actual video URL
    results: {
      percentage: "$2,400",
      metric: "extra monthly revenue",
      additional: "91% member opt-in rate"
    },
  },
  {
    name: "Marcus Chen",
    title: "Facility Director",
    company: "Summit Rock Climbing & Bouldering",
    companyLogo: undefined,
    location: "Denver, CO",
    industry: "Indoor Climbing",
    customerSince: "June 2023",
    quote: "Before Daily Event Insurance, I spent sleepless nights worrying about liability. What if someone gets seriously hurt? What if we get sued? Now our climbers have real protection, and honestly, it's taken this massive weight off my shoulders. We haven't had a single claim issue, and our members feel safer pushing their limits. It's peace of mind you can't put a price on.",
    videoUrl: undefined,
    results: {
      percentage: "Zero",
      metric: "claims disputes in 18 months",
      additional: "73% reduction in liability stress"
    },
  },
  {
    name: "Jamie Rodriguez",
    title: "Owner",
    company: "Alpine Adventure Rentals",
    companyLogo: undefined,
    location: "Lake Tahoe, CA",
    industry: "Equipment Rentals",
    customerSince: "January 2024",
    quote: "Our customers love it. Seriously, they're adding insurance at checkout without us even having to mention it. We were up and running in less than 48 hours, and now 68% of our rentals include coverage. That's translated to a 43% jump in our average transaction value. Best part? It runs itself—we literally don't do anything except watch the commission checks roll in every month.",
    videoUrl: undefined,
    results: {
      percentage: "43%",
      metric: "increase in transaction value",
      additional: "68% customer opt-in rate"
    },
  },
  {
    name: "Dr. Elena Martinez",
    title: "Medical Director & Owner",
    company: "Radiance MedSpa & Wellness",
    companyLogo: undefined,
    location: "Scottsdale, AZ",
    industry: "Medical Spa & Wellness",
    customerSince: "September 2023",
    quote: "In the aesthetic medicine space, client peace of mind is everything. When we started offering Daily Event Insurance for our procedures, our client satisfaction scores jumped 34%. They feel protected, we feel protected, and the revenue from commissions covers our entire marketing budget. It's transformed how we operate—this should be standard in every medspa.",
    videoUrl: undefined, // Perfect candidate for video testimonial
    results: {
      percentage: "34%",
      metric: "increase in client satisfaction",
      additional: "$3,200 monthly commission revenue"
    },
  },
  {
    name: "Tom Bergstrom",
    title: "General Manager",
    company: "Powder Peak Ski Resort",
    companyLogo: undefined,
    location: "Park City, UT",
    industry: "Winter Sports & Resort",
    customerSince: "November 2023",
    quote: "We were bleeding money on lift ticket insurance through traditional carriers—complex policies, terrible customer experience, and barely any margin. Daily Event Insurance changed the game. Our guests love the simplicity, we're earning 4x more in commission, and claims processing went from weeks to hours. This past season alone, we made an extra $47,000 in commission revenue. Absolute no-brainer.",
    videoUrl: undefined, // Perfect candidate for video testimonial
    results: {
      percentage: "$47K",
      metric: "commission revenue last season",
      additional: "4x higher profit margin vs. old carrier"
    },
  },
  {
    name: "Alex Thompson",
    title: "Co-Founder",
    company: "Thrill Seekers Gear Rental",
    companyLogo: undefined,
    location: "Moab, UT",
    industry: "Adventure Equipment",
    customerSince: "April 2024",
    quote: "We rent mountain bikes, climbing gear, and kayaks to tourists who've never done this stuff before. The liability kept me up at night. Daily Event Insurance solved everything—our customers get instant coverage for $8-15 per rental, we make 30% commission, and our insurance costs dropped by 60% because we're not absorbing all the risk. Literally a win-win-win scenario.",
    videoUrl: undefined,
    results: {
      percentage: "60%",
      metric: "reduction in insurance costs",
      additional: "82% customer opt-in rate"
    },
  },
]

// Video Modal Component
function VideoModal({ videoUrl, isOpen, onClose }: { videoUrl: string; isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Close video"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          <iframe
            src={videoUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Testimonial Video"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

// 3D Testimonial Card with mouse tracking
function TestimonialCard({ testimonial, direction, onPlayVideo }: {
  testimonial: Testimonial;
  direction: number;
  onPlayVideo: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false)

  // Mouse position tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Subtle 3D rotation (less aggressive for testimonials)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), {
    stiffness: 150,
    damping: 20,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), {
    stiffness: 150,
    damping: 20,
  })

  // Floating quote parallax
  const quoteX = useSpring(useTransform(mouseX, [-0.5, 0.5], [10, -10]), {
    stiffness: 100,
    damping: 20,
  })
  const quoteY = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 100,
    damping: 20,
  })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

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
    <motion.div
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
      className="absolute inset-0 perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="h-full"
      >
        {/* Glow effect on hover */}
        <motion.div
          className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500/20 via-cyan-400/15 to-teal-500/20 blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-teal-500/20 p-8 md:p-12 h-full flex flex-col overflow-hidden shadow-premium hover:shadow-premium-hover transition-shadow duration-500">
          {/* Teal corner accent */}
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-500/10 to-transparent rounded-bl-[100px]"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
            animate={isHovered ? { x: ["100%", "200%"] } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transform: "translateX(-100%)" }}
          />

          {/* Floating Quote Icon with parallax */}
          <motion.div
            className="absolute top-8 left-8 opacity-10"
            style={{
              x: quoteX,
              y: quoteY,
              transform: "translateZ(20px)",
            }}
          >
            <Quote className="w-16 h-16 md:w-20 md:h-20 text-teal-500" />
          </motion.div>

          {/* Badges Row */}
          <div className="flex items-center gap-2 mb-6 relative z-10 flex-wrap" style={{ transform: "translateZ(15px)" }}>
            {/* Verified Partner Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 rounded-full border border-teal-200">
              <svg className="w-4 h-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-teal-700">Verified Partner</span>
            </div>

            {/* Video Available Badge */}
            {testimonial.videoUrl && (
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-full border border-purple-200"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Play className="w-3 h-3 text-purple-600 fill-purple-600" />
                <span className="text-sm font-medium text-purple-700">Video Available</span>
              </motion.div>
            )}

            {/* Customer Since Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-200">
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-slate-600">Partner since {testimonial.customerSince}</span>
            </div>
          </div>

          {/* Company Logo or Industry Tag */}
          <div className="mb-4 relative z-10" style={{ transform: "translateZ(15px)" }}>
            {testimonial.companyLogo ? (
              <img
                src={testimonial.companyLogo}
                alt={testimonial.company}
                className="h-8 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-50 rounded-lg border border-slate-200">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="text-sm font-semibold text-slate-700">{testimonial.industry}</span>
              </div>
            )}
          </div>

          {/* Quote with optional video play button */}
          <div className="relative mb-8 flex-grow">
            <blockquote
              className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed relative z-10"
              style={{ transform: "translateZ(10px)" }}
            >
              <span className="text-teal-500 text-5xl leading-none font-serif">"</span>
              {testimonial.quote}
              <span className="text-teal-500 text-5xl leading-none font-serif">"</span>
            </blockquote>

            {/* Video Play Button Overlay */}
            {testimonial.videoUrl && (
              <motion.button
                onClick={onPlayVideo}
                className="mt-6 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Watch video testimonial"
              >
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play className="w-5 h-5 fill-white" />
                </div>
                <span>Watch Video Testimonial</span>
              </motion.button>
            )}
          </div>

          {/* Results Box with Glass Effect */}
          <motion.div
            className="relative bg-teal-50/80 backdrop-blur-md border border-teal-200/50 rounded-2xl p-6 mb-6 z-10 overflow-hidden"
            style={{ transform: "translateZ(20px)" }}
            animate={{
              boxShadow: isHovered
                ? "0 10px 40px -10px rgba(20, 184, 166, 0.2)"
                : "0 4px 20px -5px rgba(20, 184, 166, 0.1)",
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Inner shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              initial={{ x: "-100%" }}
              animate={isHovered ? { x: "200%" } : { x: "-100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div>
                <motion.div
                  className="text-4xl md:text-5xl font-black text-teal-600 mb-2"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {testimonial.results.percentage}
                </motion.div>
                <div className="text-slate-600 text-sm md:text-base">
                  {testimonial.results.metric}
                </div>
              </div>
              <div className="flex items-center">
                <div className="text-slate-500 text-sm md:text-base">
                  {testimonial.results.additional}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Author Info with 3D Avatar */}
          <div className="flex items-center gap-4 relative z-10" style={{ transform: "translateZ(25px)" }}>
            {/* Avatar with 3D ring effect */}
            <div className="relative">
              <motion.div
                className="absolute -inset-1 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 blur-sm"
                animate={{
                  opacity: isHovered ? 0.6 : 0.3,
                  scale: isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.div
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-black text-2xl shadow-lg"
                animate={{
                  rotate: isHovered ? [0, -5, 5, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
              >
                {testimonial.name.charAt(0)}
              </motion.div>
            </div>

            <div>
              <div className="text-slate-900 font-bold text-lg">
                {testimonial.name}
              </div>
              <div className="text-teal-600 text-sm font-medium">
                {testimonial.title}
              </div>
              <div className="text-slate-500 text-sm">
                {testimonial.company}
              </div>
              <div className="text-slate-400 text-xs mt-0.5">
                {testimonial.location} • {testimonial.industry}
              </div>
            </div>
          </div>

          {/* Bottom accent line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 z-20"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{ originX: 0 }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>("")

  const nextTestimonial = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handlePlayVideo = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl)
    setIsVideoModalOpen(true)
  }

  const handleCloseVideo = () => {
    setIsVideoModalOpen(false)
    setCurrentVideoUrl("")
  }

  // Auto-advance carousel (pause when video is open)
  useEffect(() => {
    if (isVideoModalOpen) return

    const timer = setInterval(() => {
      nextTestimonial()
    }, 8000)
    return () => clearInterval(timer)
  }, [isVideoModalOpen])

  return (
    <>
      {/* Video Modal */}
      <AnimatePresence>
        {isVideoModalOpen && currentVideoUrl && (
          <VideoModal
            videoUrl={currentVideoUrl}
            isOpen={isVideoModalOpen}
            onClose={handleCloseVideo}
          />
        )}
      </AnimatePresence>

      <section id="testimonials" className="relative bg-gradient-to-b from-slate-50 to-white py-20 md:py-32 overflow-hidden">
        {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 -right-20 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #14B8A6 1px, transparent 1px), linear-gradient(to bottom, #14B8A6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6"
          >
            <MessageSquare className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Partner Testimonials</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight">
            Success <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">Stories</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Real results from real partners who transformed their business with Daily Event Insurance
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Main Testimonial Card */}
          <div className="relative h-[680px] md:h-[600px] mb-8">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <TestimonialCard
                key={currentIndex}
                testimonial={testimonials[currentIndex]}
                direction={direction}
                onPlayVideo={() => {
                  if (testimonials[currentIndex].videoUrl) {
                    handlePlayVideo(testimonials[currentIndex].videoUrl!)
                  }
                }}
              />
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-6">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-white border-2 border-teal-500 text-teal-600 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.1, boxShadow: "0 10px 30px -10px rgba(20, 184, 166, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            {/* Dot Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1)
                    setCurrentIndex(index)
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "w-8 bg-gradient-to-r from-teal-500 to-teal-600"
                      : "w-2 bg-teal-300 hover:bg-teal-400"
                  }`}
                  whileHover={{ scale: 1.2 }}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-white border-2 border-teal-500 text-teal-600 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.1, boxShadow: "0 10px 30px -10px rgba(20, 184, 166, 0.3)" }}
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
          <p className="text-slate-600 mb-6 text-lg">
            Ready to become a partner and earn commission?
          </p>
          <motion.a
            href="#apply"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Join Our Partner Network
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>
        </motion.div>
      </div>
      </section>
    </>
  )
}
