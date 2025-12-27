"use client"

import { motion } from "framer-motion"
import {
  Clock,
  Zap,
  Activity,
  Shield,
  Layers,
  CheckCircle2,
  ArrowRight
} from "lucide-react"

const eventTypes = [
  { label: "A race", icon: "🏃" },
  { label: "A gym check-in", icon: "🏋️" },
  { label: "A league game", icon: "⚽" },
  { label: "A ski day", icon: "⛷️" },
  { label: "A wellness visit", icon: "🧘" },
]

const platformLayers = [
  {
    icon: Zap,
    title: "Event Triggers",
    description: "Ticketing, check-in, session start activate coverage instantly",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Activity,
    title: "Digital Health Signals",
    description: "Biometric face scan enhances intent & conversion",
    color: "from-teal-500 to-cyan-500"
  },
  {
    icon: Shield,
    title: "ActiveGuard™ Coverage",
    description: "Time-bound AD&D + accident medical protection",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: Layers,
    title: "HIQOR OS",
    description: "Manages activation, billing & revenue share",
    color: "from-purple-500 to-pink-500"
  },
]

const differentiators = [
  "Insurance aligned to actual risk windows",
  "Embedded inside event platforms, not ads",
  "Lower CAC, higher conversion",
  "One infrastructure for all event types"
]

export function HiqorValueProp() {
  return (
    <section className="relative bg-white py-16 md:py-24 overflow-hidden">
      {/* Background subtle pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #14B8A6 1px, transparent 0)`,
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-4">
            <span className="text-teal-600 font-semibold text-sm">Why HIQOR</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
            Every Real-World Activity Is an <span className="text-teal-500">Event</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            HIQOR treats all activities as insurable events with a start time, end time, and participant context.
          </p>
        </motion.div>

        {/* Event Types Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16"
        >
          {eventTypes.map((event, index) => (
            <motion.div
              key={event.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.05, y: -2 }}
              className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-default"
            >
              <span className="text-xl">{event.icon}</span>
              <span className="text-sm md:text-base font-medium text-slate-700">{event.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Coverage Flow Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-r from-teal-500/5 via-teal-500/10 to-teal-500/5 rounded-2xl p-6 md:p-10 mb-16 border border-teal-500/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Event Starts */}
            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Event Starts</div>
                <div className="text-xs text-slate-500">Coverage activates</div>
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="hidden md:block"
            >
              <ArrowRight className="w-6 h-6 text-teal-500" />
            </motion.div>
            <div className="md:hidden">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="w-6 h-6 text-teal-500 rotate-90" />
              </motion.div>
            </div>

            {/* Protected During Event */}
            <div className="flex items-center gap-3 px-6 py-4 bg-teal-500 rounded-xl shadow-lg shadow-teal-500/30">
              <Shield className="w-8 h-8 text-white" />
              <div>
                <div className="text-base font-bold text-white">Participant Protected</div>
                <div className="text-sm text-teal-100">Full coverage active</div>
              </div>
            </div>

            {/* Arrow */}
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              className="hidden md:block"
            >
              <ArrowRight className="w-6 h-6 text-teal-500" />
            </motion.div>
            <div className="md:hidden">
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              >
                <ArrowRight className="w-6 h-6 text-teal-500 rotate-90" />
              </motion.div>
            </div>

            {/* Event Ends */}
            <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-slate-400 rounded-full" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Event Ends</div>
                <div className="text-xs text-slate-500">Coverage deactivates</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-lg md:text-xl font-semibold text-slate-800">
              Coverage turns <span className="text-green-600">on</span> for the event and <span className="text-slate-500">off</span> when it ends.
            </p>
          </div>
        </motion.div>

        {/* Platform Layers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8">
            How HIQOR Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {platformLayers.map((layer, index) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-lg transition-all"
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${layer.color}`} />

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${layer.color} bg-opacity-10 flex items-center justify-center mb-4`}>
                  <layer.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{layer.title}</h4>
                <p className="text-sm text-slate-600">{layer.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Why This Wins */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-slate-900 rounded-2xl p-8 md:p-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            Why This Model Wins
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {differentiators.map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 px-5 py-4 bg-white/5 rounded-xl border border-white/10"
              >
                <CheckCircle2 className="w-5 h-5 text-teal-400 flex-shrink-0" />
                <span className="text-white/90 text-sm md:text-base">{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Positioning Statement */}
          <div className="text-center mt-10 pt-8 border-t border-white/10">
            <p className="text-xl md:text-2xl font-bold text-white mb-2">
              "HIQOR is the InsurTech SaaS infrastructure for events-based insurance."
            </p>
            <p className="text-teal-400 font-semibold">
              Insurance for moments, not time.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
