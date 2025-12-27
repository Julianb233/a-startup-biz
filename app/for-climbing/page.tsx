"use client"

import { motion } from "framer-motion"
import { ArrowRight, Shield, Users, TrendingUp, CheckCircle, Mountain, Award, Clock, Zap } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

// Hero Section
function ClimbingHeroSection() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-teal-900">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Decorative Blobs */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 right-10 w-64 h-64 bg-teal-400 rounded-full opacity-20 blur-3xl"
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-400 rounded-full opacity-20 blur-3xl"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full"
          >
            <Mountain className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">For Climbing Facilities</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black uppercase text-white leading-tight tracking-tight"
          >
            Protect Your{" "}
            <span className="relative inline-block">
              Climbers
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="absolute bottom-2 left-0 right-0 h-2 bg-cyan-400/50 origin-left"
              />
            </span>
            ,<br />
            Grow Your{" "}
            <span className="text-cyan-300">Revenue</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl sm:text-2xl lg:text-3xl text-white/90 max-w-3xl mx-auto leading-relaxed"
          >
            Same-day insurance for climbing sessions, courses, and memberships
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-black uppercase text-teal-700 bg-white rounded-full shadow-2xl hover:bg-cyan-50 transition-all duration-300"
            >
              <span>Request a Demo</span>
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/80 pt-8"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cyan-300" />
              <span className="font-semibold">Free to Join</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cyan-300" />
              <span className="font-semibold">5-Min Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-cyan-300" />
              <span className="font-semibold">Earn Commission</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Challenge Section
function ChallengeSection() {
  const challenges = [
    {
      icon: Shield,
      title: "High-Risk Activity",
      description: "Climbing is inherently dangerous. Your facility needs proper protection from liability claims.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Clock,
      title: "Slow Traditional Insurance",
      description: "Traditional policies take days or weeks to process, creating friction for new members.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Zap,
      title: "Our Solution",
      description: "Instant coverage at check-in. Your climbers get protected in seconds, you earn revenue.",
      color: "from-teal-500 to-teal-600"
    }
  ]

  return (
    <section className="relative bg-slate-50 py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight mb-4">
            The Climbing Insurance{" "}
            <span className="text-teal-600">Challenge</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Traditional insurance wasn't built for the climbing industry
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {challenges.map((challenge, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${challenge.color} rounded-2xl transform group-hover:scale-105 transition-transform duration-300`} />
              <div className="relative bg-white rounded-2xl p-8 m-[2px]">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center mb-6">
                  <challenge.icon className="w-8 h-8 text-teal-700" />
                </div>
                <h3 className="text-2xl font-black uppercase text-slate-900 mb-4">
                  {challenge.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {challenge.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// How It Works Section
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Partner With Us",
      description: "Free to join. No setup costs, no monthly fees. We handle all compliance and underwriting.",
      icon: Users,
    },
    {
      number: "02",
      title: "Integrate Seamlessly",
      description: "Add our widget to your waiver or check-in system. Takes less than 5 minutes to set up.",
      icon: Zap,
    },
    {
      number: "03",
      title: "Earn Commission",
      description: "Climbers get instant coverage at check-in. You earn commission on every policy sold.",
      icon: TrendingUp,
    },
  ]

  return (
    <section className="relative bg-white py-20 md:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight mb-4">
            How It Works For{" "}
            <span className="text-teal-600">Climbing Facilities</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
            Three simple steps to start earning revenue
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border-2 border-teal-200"
            >
              <div className="absolute -top-6 left-8">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-500 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg">
                  {step.number}
                </div>
              </div>
              <div className="mt-8 mb-6">
                <step.icon className="w-12 h-12 text-teal-600" />
              </div>
              <h3 className="text-2xl font-black uppercase text-slate-900 mb-4">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Coverage Types Section
function CoverageTypesSection() {
  const coverageTypes = [
    {
      title: "Day Climbing Passes",
      description: "Full liability coverage for single-day climbers",
      icon: Mountain,
    },
    {
      title: "Belay Certification",
      description: "Insurance for belay and safety courses",
      icon: Award,
    },
    {
      title: "Lead Climbing",
      description: "Specialized coverage for advanced climbing",
      icon: TrendingUp,
    },
    {
      title: "Bouldering Sessions",
      description: "Protection for bouldering-only facilities",
      icon: Shield,
    },
    {
      title: "Membership Add-ons",
      description: "Ongoing coverage for monthly members",
      icon: Users,
    },
    {
      title: "Youth Programs",
      description: "Tailored insurance for youth climbing programs",
      icon: CheckCircle,
    },
  ]

  return (
    <section className="relative bg-teal-900 py-20 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(20,184,166,0.4) 1px, transparent 0)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-4">
            Coverage <span className="text-teal-400">Types</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Flexible insurance options for every climbing activity
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coverageTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-teal-500/20 rounded-lg flex items-center justify-center mb-4">
                <type.icon className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-black uppercase text-white mb-2">
                {type.title}
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                {type.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Stats Section
function StatsSection() {
  const stats = [
    {
      value: "64%",
      label: "Reduction in Liability Claims",
      icon: Shield,
      color: "from-teal-500 to-teal-600"
    },
    {
      value: "95%",
      label: "Member Satisfaction Rate",
      icon: Users,
      color: "from-cyan-500 to-sky-500"
    },
    {
      value: "$42K",
      label: "Avg. Annual Commission",
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600"
    }
  ]

  return (
    <section className="relative bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 py-20 md:py-32">

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-4">
            Risk Reduction <span className="text-cyan-300">Results</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Real outcomes from climbing facilities using Daily Event Insurance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`relative bg-gradient-to-br ${stat.color} rounded-2xl p-8 text-center overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300" />

              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl md:text-6xl font-black text-white mb-4">
                  {stat.value}
                </div>
                <p className="text-white/90 text-lg font-semibold uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonial Section
function TestimonialSection() {
  return (
    <section className="relative bg-white py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Quote Mark */}
          <div className="absolute -top-8 -left-4 text-9xl text-teal-200 font-serif leading-none">
            "
          </div>

          <div className="relative bg-gradient-to-br from-slate-50 to-white rounded-2xl p-12 border-2 border-teal-200 shadow-xl">
            <p className="text-xl md:text-2xl text-slate-700 leading-relaxed mb-8 italic">
              Daily Event Insurance transformed our business. We went from manually processing insurance waivers to offering instant coverage at check-in. Our members love the convenience, and we're earning $3,200/month in passive commission. It's a complete game-changer for climbing facilities.
            </p>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-black">
                SR
              </div>
              <div>
                <div className="text-lg font-black text-slate-900">Sarah Rodriguez</div>
                <div className="text-slate-600">Owner, Boulder Peak Climbing Gym</div>
                <div className="text-sm text-teal-600 font-semibold">San Diego, CA</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// CTA Section with Demo Form
function DemoFormSection() {
  return (
    <section id="demo-form" className="relative bg-teal-900 py-20 md:py-32">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-white leading-tight tracking-tight mb-6">
            Ready to Protect Your{" "}
            <span className="text-teal-400">Climbers?</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-4">
            Join 50+ climbing facilities already earning commission with embedded insurance.
          </p>
          <p className="text-base md:text-lg text-teal-400 font-bold max-w-2xl mx-auto mb-8">
            Free to join. No setup costs. Start earning in days, not weeks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-teal-800/50 backdrop-blur-sm rounded-2xl border border-teal-500/20 p-8 md:p-12"
        >
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Your Name *"
                required
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="email"
                placeholder="Email Address *"
                required
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Climbing Facility Name *"
                required
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <input
              type="text"
              placeholder="City & State *"
              required
              className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <select
              required
              className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Facility Type *</option>
              <option>Indoor Bouldering Only</option>
              <option>Indoor Roped Climbing</option>
              <option>Indoor + Outdoor Programs</option>
              <option>Outdoor Guiding Service</option>
              <option>Mixed Facility</option>
            </select>

            <select className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Estimated Monthly Climbers</option>
              <option>Under 100</option>
              <option>100-500</option>
              <option>500-1,000</option>
              <option>1,000-2,500</option>
              <option>2,500+</option>
            </select>

            <textarea
              placeholder="Tell us about your facility and what you're looking for..."
              rows={4}
              className="w-full px-6 py-4 rounded-lg bg-white text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-black uppercase px-8 py-5 rounded-full text-lg tracking-wider hover:from-teal-400 hover:to-teal-500 transition-all shadow-xl"
            >
              Request Your Demo
            </motion.button>
          </form>

          <p className="text-slate-400 text-sm text-center mt-6">
            We'll contact you within 24 hours to schedule your personalized demo.
          </p>
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
        >
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-teal-400" />
            <span className="text-white font-semibold">No Long-Term Contracts</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-teal-400" />
            <span className="text-white font-semibold">White-Label Options</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="w-8 h-8 text-teal-400" />
            <span className="text-white font-semibold">24/7 Support</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// Main Page Component
export default function ClimbingFacilitiesPage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white">
      <Header />
      <ClimbingHeroSection />
      <ChallengeSection />
      <HowItWorksSection />
      <CoverageTypesSection />
      <StatsSection />
      <TestimonialSection />
      <DemoFormSection />
      <Footer />
    </main>
  )
}
