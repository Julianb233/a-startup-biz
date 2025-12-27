"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "How quickly can members get coverage?",
    answer: "Members can purchase and activate coverage instantly - same day, same moment. No waiting periods.",
  },
  {
    question: "What types of businesses can partner with you?",
    answer: "We work with gyms, fitness centers, rock climbing facilities, equipment rental shops, adventure sports operators, and more.",
  },
  {
    question: "How do I integrate with my existing systems?",
    answer: "We offer simple API integration or a standalone partner portal. Most businesses are live within 24-48 hours.",
  },
  {
    question: "What's the revenue sharing model?",
    answer: "Partners earn a commission on every policy sold. Contact us for specific rates based on your volume.",
  },
  {
    question: "What does the insurance cover?",
    answer: "Coverage includes activity-related injuries, equipment damage, and liability protection. Policies are tailored to your business type.",
  },
  {
    question: "Is there a minimum commitment?",
    answer: "No minimums required. Pay only for the coverage your members purchase.",
  },
]

interface FAQItemProps {
  question: string
  answer: string
  index: number
  isOpen: boolean
  onClick: () => void
}

function FAQItem({ question, answer, index, isOpen, onClick }: FAQItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border-b border-gray-200 last:border-b-0"
    >
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between gap-4 text-left group hover:bg-teal-50 transition-colors duration-300 px-4 rounded-lg"
        aria-expanded={isOpen}
      >
        <span className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-6 h-6 text-teal-500" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6 px-4">
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative bg-gray-50 py-20 md:py-32 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Frequently Asked <span className="text-teal-500">Questions</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about partnering with Daily Event Insurance
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 text-lg">
            Still have questions? Contact us to learn more about our partnership program.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
