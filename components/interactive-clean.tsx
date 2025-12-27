"use client"
import { motion } from "framer-motion"

const IMAGE_URL = "/images/e52f0172-aad3-4ca1-ad35.jpeg"

export function InteractiveClean() {
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-[#D4A84B]/30"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
      >
        <img
          src={IMAGE_URL || "/placeholder.svg"}
          alt="Julian Bradley - The Wizard of AI"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A4D3C]/50 via-transparent to-transparent" />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
        />
      </motion.div>

      {/* Glow */}
      <div className="absolute -inset-4 bg-[#D4A84B]/10 rounded-3xl blur-2xl -z-10" />
    </div>
  )
}
