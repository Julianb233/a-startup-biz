"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

export function FounderStory() {
  return (
    <section data-section="founder-story" className="relative bg-gradient-to-br from-slate-50 via-white to-teal-50/30 py-16 md:py-24 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #14B8A6 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Decorative teal glow */}
      <motion.div
        className="absolute top-1/2 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-200">
            <Quote className="w-4 h-4 text-teal-400" />
            <span className="text-xs uppercase tracking-[0.3em] text-teal-600 font-semibold">
              The Origin Story
            </span>
          </div>
        </motion.div>

        {/* Main Quote Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12"
        >
          {/* Large decorative quote mark */}
          <div className="absolute top-6 left-6 text-teal-500/10 text-8xl font-serif leading-none select-none">
            "
          </div>

          {/* Story Content */}
          <div className="relative z-10 space-y-6 text-slate-700 leading-relaxed">
            {/* The Problem */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-lg md:text-xl font-medium">
                A gym owner in Colorado got hit with a lawsuit after a member was injured during a routine workout.{" "}
                <span className="text-teal-600 font-bold">No coverage. $47,000 lesson.</span>
              </p>
            </motion.div>

            {/* The Backstory */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-base md:text-lg">
                That's when I discovered the massive gap in insurance for active lifestyle businesses. Traditional policies don't cover customers—only employees. Gyms, climbing centers, adventure rentals, and sports facilities were all exposed to the same risk.
              </p>
            </motion.div>

            {/* The Epiphany */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="pl-6 border-l-4 border-teal-400 bg-teal-50/50 py-4 rounded-r-lg"
            >
              <p className="text-base md:text-lg font-semibold italic text-slate-800">
                "What if facilities could offer insurance to their members at check-in—AND make money doing it?"
              </p>
            </motion.div>

            {/* The Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p className="text-base md:text-lg">
                That simple idea became Daily Event Insurance. Today, we're helping{" "}
                <span className="font-bold text-teal-600">247 facilities</span> protect their members while earning{" "}
                <span className="font-bold text-teal-600">passive revenue</span> every single month. No overhead. No risk. Just better protection for everyone.
              </p>
            </motion.div>
          </div>

          {/* Bottom gradient accent */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent rounded-b-2xl" />
        </motion.div>

        {/* Author Attribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              D
            </div>
            <div className="text-slate-800 font-bold text-lg">DEI Founder</div>
            <div className="text-slate-500 text-sm">Founder & CEO, Daily Event Insurance</div>
          </div>
        </motion.div>

        {/* Mission Statement Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30">
            <span className="text-sm md:text-base font-semibold">
              Our Mission: Protect more members. Empower more businesses.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
