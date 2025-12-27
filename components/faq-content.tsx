"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Search, MessageCircle, Mail } from "lucide-react"
import { faqItems } from "@/lib/site-data"

const categories = [
  { id: "all", label: "All Questions" },
  { id: "general", label: "General" },
  { id: "pricing", label: "Pricing" },
  { id: "process", label: "Process" },
  { id: "services", label: "Services" },
  { id: "guarantee", label: "Guarantee" },
]

export default function FAQContent() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const filteredFAQs = useMemo(() => {
    let filtered = faqItems

    if (selectedCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        faq =>
          faq.question.toLowerCase().includes(query) ||
          faq.answer.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [selectedCategory, searchQuery])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-black via-[#1a0a00] to-black overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#ff6a1a] to-transparent" />
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#ff6a1a] to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#ff6a1a]/20 border border-[#ff6a1a]/30 rounded-full mb-8"
            >
              <MessageCircle className="w-4 h-4 text-[#ff6a1a]" />
              <span className="text-white font-semibold text-sm tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Frequently Asked Questions
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Got Questions?
              <br />
              <span className="text-[#ff6a1a]">I've Got Answers.</span>
            </h1>

            <p className="text-xl text-white/80 max-w-3xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Everything you need to know about working with A Startup Biz, from pricing to process and everything in between.
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff6a1a] to-transparent" />
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-[#ff6a1a] focus:outline-none transition-colors"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setOpenIndex(null)
                }}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? "bg-[#ff6a1a] text-white shadow-lg shadow-[#ff6a1a]/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {searchQuery && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mt-6 text-gray-600"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Found {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'}
            </motion.p>
          )}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredFAQs.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden"
            >
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full py-6 px-6 flex items-center justify-between gap-4 text-left group hover:bg-[#ff6a1a]/5 transition-all duration-300 rounded-lg"
                    aria-expanded={openIndex === index}
                  >
                    <span className="text-lg md:text-xl font-bold text-black group-hover:text-[#ff6a1a] transition-colors duration-300 pr-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-6 h-6 text-[#ff6a1a]" />
                    </motion.div>
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
                        <div className="pb-6 px-6">
                          <p className="text-black/80 text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-xl text-gray-500 mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                No questions found matching your search.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
                className="text-[#ff6a1a] font-semibold hover:underline"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#ff6a1a] to-[#ff8a3a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <Mail className="w-16 h-16 text-white" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Still Have Questions?
              <br />
              Let's Talk.
            </h2>

            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Can't find what you're looking for? Book a consultation and I'll answer all your questions personally.
            </p>

            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-10 py-5 bg-black text-white font-bold text-lg rounded-xl hover:bg-black/90 transition-all shadow-2xl"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Get Your Consultation
            </motion.a>

            <p className="text-white/80 text-sm mt-8" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              No pressure, no BS—just honest answers about how I can help your business succeed.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}
