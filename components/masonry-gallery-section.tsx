"use client"

import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

const galleryImages = [
  {
    src: "/images/5b967406-7d8b-451d-a95d.jpeg",
    alt: "The Wizard of AI - Lifestyle",
    aspect: "aspect-[4/3]",
  },
  {
    src: "/images/692aaacc-002e-42a8-9402.jpeg",
    alt: "The Wizard of AI - Casual",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/925b8513-0ea4-4ae3-99a1.jpeg",
    alt: "The Wizard of AI - Professional",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/97472e88-240f-4a56-ac72.jpeg",
    alt: "The Wizard of AI - Outdoor",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/b2e01217-05b2-462e-8101.jpeg",
    alt: "The Wizard of AI - Business",
    aspect: "aspect-[3/4]",
  },
  {
    src: "/images/f2b878eb-5b2f-482c-9ed1.jpeg",
    alt: "The Wizard of AI - Executive",
    aspect: "aspect-[3/4]",
  },
]

export default function MasonryGallerySection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const backgroundColor = useTransform(scrollYProgress, [0, 0.6, 0.9], ["#0A4D3C", "#0D6B4F", "#0A4D3C"])

  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "-50vh"])

  const column1 = galleryImages.filter((_, i) => i % 3 === 0)
  const column2 = galleryImages.filter((_, i) => i % 3 === 1)
  const column3 = galleryImages.filter((_, i) => i % 3 === 2)

  return (
    <section
      ref={sectionRef}
      id="masonry-gallery"
      className="relative overflow-hidden"
      style={{
        height: isMobile ? "150vh" : "250vh",
      }}
    >
      <motion.div className="sticky top-0 h-screen w-full overflow-hidden" style={{ backgroundColor }}>
        <motion.div
          style={{ y: isMobile ? 0 : y }}
          className="relative w-full max-w-[1400px] mx-auto px-4 md:px-8 py-10 md:py-20"
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full">
            {isMobile ? (
              <div className="flex flex-col gap-4 w-full">
                {galleryImages.slice(0, 4).map((image, index) => (
                  <MasonryCard key={`mobile-${index}`} image={image} index={index} />
                ))}
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-8 w-full md:w-1/3">
                  {column1.map((image, index) => (
                    <MasonryCard key={`col1-${index}`} image={image} index={index * 3} />
                  ))}
                </div>
                <div className="flex flex-col gap-8 w-full md:w-1/3">
                  {column2.map((image, index) => (
                    <MasonryCard key={`col2-${index}`} image={image} index={index * 3 + 1} />
                  ))}
                </div>
                <div className="flex flex-col gap-8 w-full md:w-1/3">
                  {column3.map((image, index) => (
                    <MasonryCard key={`col3-${index}`} image={image} index={index * 3 + 2} />
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function MasonryCard({ image, index }: { image: any; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      viewport={{ once: true, margin: "-30px" }}
      className={`relative overflow-hidden rounded-lg md:rounded-xl shadow-xl transition-all duration-500 bg-[#0D6B4F]/20 border border-[#D4A84B]/20 w-full ${image.aspect}`}
    >
      <Image
        src={image.src || "/placeholder.svg"}
        alt={image.alt}
        fill
        className="object-cover transition-transform duration-700 hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        quality={85}
      />
    </motion.div>
  )
}
