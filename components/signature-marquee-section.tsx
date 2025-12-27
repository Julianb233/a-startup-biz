"use client"

import { motion } from "framer-motion"

export default function SignatureMarqueeSection() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center z-0 overflow-hidden max-w-full">
      <div className="w-full flex flex-col gap-4 md:gap-8 py-10 select-none pointer-events-none overflow-hidden">
        {/* Top Line - Moving Right */}
        <div className="w-full overflow-hidden flex">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {[...Array(4)].map((_, i) => (
              <h2
                key={i}
                className="font-[family-name:var(--font-brier)] text-[10vw] md:text-[8vw] text-[#4dd9e8] leading-[0.9] tracking-tight px-4"
              >
                AI MAGIC UNLEASHED AI MAGIC UNLEASHED AI MAGIC UNLEASHED AI MAGIC UNLEASHED
              </h2>
            ))}
          </motion.div>
        </div>

        {/* Bottom Line - Moving Left */}
        <div className="w-full overflow-hidden flex">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 25,
                ease: "linear",
              },
            }}
          >
            {[...Array(4)].map((_, i) => (
              <h2
                key={i}
                className="font-[family-name:var(--font-oswald)] font-bold uppercase text-[10vw] md:text-[8vw] text-white leading-[0.9] tracking-tighter px-4"
              >
                THE WIZARD OF AI THE WIZARD OF AI THE WIZARD OF AI THE WIZARD OF AI
              </h2>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
