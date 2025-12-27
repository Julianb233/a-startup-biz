"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { Plus, Minus } from "lucide-react"

interface FAQ {
  question: string
  answer: string
}

interface ServiceFAQProps {
  faqs: FAQ[]
  serviceTitle: string
}

export default function ServiceFAQ({ faqs, serviceTitle }: ServiceFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Everything you need to know about {serviceTitle}
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-start justify-between gap-4 text-left hover:bg-gray-50 transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="text-lg font-semibold text-black pr-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {faq.question}
                </span>
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#ff6a1a] flex items-center justify-center">
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-white" />
                  ) : (
                    <Plus className="w-4 h-4 text-white" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-2">
                      <p className="text-gray-600 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA after FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center bg-orange-50 rounded-2xl p-8 border border-orange-100"
        >
          <h3 className="text-2xl font-bold text-black mb-3" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Still Have Questions?
          </h3>
          <p className="text-gray-600 mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            We're here to help. Get in touch and we'll answer all your questions.
          </p>
          <a
            href="mailto:Astartupbiz@gmail.com"
            className="inline-flex items-center justify-center gap-2 bg-[#ff6a1a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e55f17] transition-all shadow-md hover:shadow-lg"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  )
}
