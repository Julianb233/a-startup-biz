"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

const GALLERY_URLS = {
  img1: "/images/93ab57ce-7adc-49f9-8081.jpeg",
  img2: "/images/4d926e98-d4e4-4327-9c4d.jpeg",
  img3: "/images/af54ca35-cfad-4bf1-a717.jpeg",
  img4: "/images/ba61a48a-3598-44bf-a88f.jpeg",
  img5: "/images/f855b866-11bc-446f-8332.jpeg",
  img6: "/images/f3aac5be-7b71-4710-b8d8.jpeg",
}

const galleryItems = [
  { type: "quote", content: "AUTOMATE EVERYTHING", rotate: -2 },
  { type: "image", src: GALLERY_URLS.img1, rotate: 3 },
  {
    type: "text",
    content: "AI isn't just technology, it's a lifestyle. Every automation creates more freedom in your life.",
    rotate: 1,
  },
  { type: "quote", content: "SCALE YOUR BUSINESS", rotate: -3 },
  { type: "image", src: GALLERY_URLS.img2, rotate: 2 },
  {
    type: "text",
    content:
      "From manual tasks to intelligent workflows, the journey is transformative. But this is just the beginning.",
    rotate: -1,
  },
  { type: "quote", content: "WORK SMARTER", rotate: 2 },
  { type: "image", src: GALLERY_URLS.img3, rotate: -2 },
  {
    type: "text",
    content: "Every AI agent is a new opportunity, every automation is a step toward freedom.",
    rotate: 1,
  },
  { type: "image", src: GALLERY_URLS.img4, rotate: 1 },
  { type: "quote", content: "BUILD YOUR EMPIRE", rotate: -1 },
  { type: "image", src: GALLERY_URLS.img5, rotate: 2 },
  { type: "image", src: GALLERY_URLS.img6, rotate: -1 },
]

function MasonryItem({ item, index }: { item: any; index: number }) {
  const ref = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.7, 1], [0, 1, 1, 0.03])
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <motion.div
      ref={ref}
      style={{
        opacity,
        y,
        rotate: item.rotate,
      }}
      whileHover={{
        scale: 1.02,
        rotate: 0,
        zIndex: 10,
        transition: { duration: 0.3 },
      }}
      className={`${index === 1 || index === 7 ? "md:col-span-1 md:row-span-2" : ""}`}
    >
      {item.type === "quote" && (
        <div className="bg-wizard-cyan text-wizard-dark-bg p-10 rounded-2xl border-4 border-wizard-cyan h-full flex flex-col items-center justify-center shadow-2xl">
          <p className="text-3xl md:text-4xl font-black text-center uppercase leading-tight">{item.content}</p>
        </div>
      )}

      {item.type === "image" && (
        <div className="relative h-full min-h-[300px] md:min-h-[400px] rounded-2xl overflow-hidden border-4 border-wizard-cyan/20 shadow-2xl hover:scale-102 transition-transform duration-300">
          <Image src={item.src || "/placeholder.svg"} alt="AI automation and business transformation showcase" fill className="object-cover" />
        </div>
      )}

      {item.type === "text" && (
        <div className="bg-wizard-navy/50 border-2 border-wizard-cyan/20 p-8 rounded-2xl h-full flex items-center justify-center shadow-xl">
          <p className="text-lg md:text-xl font-medium text-center leading-relaxed text-white">{item.content}</p>
        </div>
      )}
    </motion.div>
  )
}

export default function GallerySection() {
  return (
    <section id="gallery" className="relative min-h-screen bg-wizard-dark-bg text-white py-24 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-auto">
          {galleryItems.map((item, index) => (
            <MasonryItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
