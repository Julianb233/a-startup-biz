"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Youtube, MessageCircle, Users, BookOpen } from "lucide-react"

const socialImages = [
  "/images/692aaacc-002e-42a8-9402.jpeg",
  "/images/925b8513-0ea4-4ae3-99a1.jpeg",
  "/images/97472e88-240f-4a56-ac72.jpeg",
  "/images/e52f0172-aad3-4ca1-ad35.jpeg",
  "/images/b2e01217-05b2-462e-8101.jpeg",
  "/images/f2b878eb-5b2f-482c-9ed1.jpeg",
  "/images/5b967406-7d8b-451d-a95d.jpeg",
]

export default function SocialSection() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  // Parallax rotation effect for the swirl - rotates as you scroll
  // Scale increased 30% more to prevent corners from showing
  const swirlRotate = useTransform(scrollYProgress, [0, 1], [0, 45])
  const swirlScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.56, 1.3, 1.43])
  const swirlY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])

  return (
    <section 
      id="social-section" 
      ref={sectionRef}
      className="relative text-white py-24 px-6 md:px-12 overflow-hidden"
    >
      {/* Green Swirl Background with Parallax Rotation */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{
          rotate: swirlRotate,
          scale: swirlScale,
          y: swirlY,
        }}
      >
        <Image
          src="/green-swirl-bg.png"
          alt="Green cosmic swirl background"
          fill
          className="object-cover"
          priority
        />
      </motion.div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-[#041f1a]/40 z-[1]" />

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(4, 31, 26, 0.7) 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-tight text-white"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.8)" }}
          >
            JOIN THE
          </h2>
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-brier mt-2 leading-tight text-yellow-400"
            style={{ textShadow: "0 0 40px rgba(255, 215, 0, 0.5), 0 4px 20px rgba(0,0,0,0.8)" }}
          >
            AI REVOLUTION
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative h-[600px] md:h-[700px] mb-16 flex items-center justify-center"
        >
          {socialImages.map((image, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, rotate: 0, scale: 0 }}
              whileInView={{
                opacity: 1,
                rotate: (i - 3) * 6,
                scale: 1 - Math.abs(i - 3) * 0.02,
                x: (i - 3) * 90,
                y: Math.abs(i - 3) * 35,
              }}
              transition={{
                duration: 0.8,
                delay: 0.2 + i * 0.1,
                type: "spring",
                stiffness: 60,
                damping: 12,
              }}
              viewport={{ once: true }}
              whileHover={{
                rotate: 0,
                scale: 1.1,
                zIndex: 20,
                y: -40,
                transition: { duration: 0.3 },
              }}
              className="absolute w-60 md:w-80 h-80 md:h-[480px] bg-emerald-950 rounded-3xl shadow-2xl overflow-hidden cursor-pointer origin-bottom border-2 border-yellow-400/30"
              style={{ 
                zIndex: 10 - Math.abs(i - 3),
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 215, 0, 0.1)"
              }}
            >
              <div className="relative w-full h-full">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`The Wizard of AI ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <p className="text-lg md:text-xl text-white/90 font-medium"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
          >
            Whether you're scaling a business, learning AI, or joining our community - your journey starts here
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { name: "YOUTUBE", icon: Youtube, href: "#youtube" },
              { name: "COMMUNITY", icon: Users, href: "#community" },
              { name: "RESOURCES", icon: BookOpen, href: "#resources" },
              { name: "CONTACT", icon: MessageCircle, href: "#contact" },
            ].map((platform) => (
              <motion.a
                key={platform.name}
                href={platform.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 font-black uppercase text-sm tracking-wider text-white hover:text-yellow-400 transition-colors"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}
              >
                <platform.icon className="w-5 h-5" />
                {platform.name}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
