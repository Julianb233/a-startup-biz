"use client"

import { motion } from "framer-motion"
import { Plus, Minus } from "lucide-react"
import { useState } from "react"

interface FAQ {
  question: string
  answer: string
}

interface SectorFAQProps {
  faqs: FAQ[]
  sectorTitle: string
}

export function SectorFAQ({ faqs, sectorTitle }: SectorFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Generate JSON-LD Schema for FAQs
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }

  return (
    <section className="relative bg-white py-20 md:py-32">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight mb-4">
            Frequently Asked <span className="text-teal-600">Questions</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600">
            Everything you need to know about {sectorTitle.toLowerCase()} insurance
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left group"
                >
                  <span className="text-lg md:text-xl font-bold text-slate-900 pr-8 group-hover:text-teal-600 transition-colors">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    {isOpen ? (
                      <Minus className="w-6 h-6 text-teal-600" />
                    ) : (
                      <Plus className="w-6 h-6 text-slate-400 group-hover:text-teal-600 transition-colors" />
                    )}
                  </motion.div>
                </button>

                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed text-base md:text-lg">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
