"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  Send,
  Calendar,
  ExternalLink,
  Search,
  Book,
  Video,
  Headphones
} from "lucide-react"
import Link from "next/link"

// FAQ data
const faqs = [
  {
    id: 1,
    question: "How long does business formation typically take?",
    answer: "Business formation timelines vary by state. For most states, we can complete LLC formation within 5-7 business days. Expedited processing is available for an additional fee and can reduce this to 1-2 business days.",
    category: "business"
  },
  {
    id: 2,
    question: "When will I receive my documents?",
    answer: "Documents are delivered digitally through your dashboard as soon as they're ready. You'll receive an email notification when new documents are available. Physical copies can be mailed upon request for an additional fee.",
    category: "documents"
  },
  {
    id: 3,
    question: "How do I reschedule a consultation?",
    answer: "You can reschedule consultations through your Consultations page up to 24 hours before the scheduled time. For last-minute changes, please contact support directly.",
    category: "consultations"
  },
  {
    id: 4,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, and bank transfers for orders over $1,000. Payment plans are available for select services.",
    category: "billing"
  },
  {
    id: 5,
    question: "How do I track my service progress?",
    answer: "Visit your 'My Services' page to see real-time progress on all active services. Each service shows detailed milestones, current status, and estimated completion dates.",
    category: "services"
  },
  {
    id: 6,
    question: "What if I need help after my service is complete?",
    answer: "We offer ongoing support for all our clients. You can reach out through this support page, schedule a follow-up consultation, or access our resource library for self-service help.",
    category: "general"
  }
]

const contactMethods = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team",
    availability: "Mon-Fri, 9AM-6PM EST",
    action: "Start Chat",
    color: "bg-blue-100 text-blue-600"
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "support@astartupbiz.com",
    availability: "Response within 24 hours",
    action: "Send Email",
    color: "bg-green-100 text-green-600"
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "(555) 123-4567",
    availability: "Mon-Fri, 9AM-6PM EST",
    action: "Call Now",
    color: "bg-purple-100 text-purple-600"
  },
  {
    icon: Calendar,
    title: "Schedule a Call",
    description: "Book a support consultation",
    availability: "Available slots this week",
    action: "Book Call",
    color: "bg-orange-100 text-[#ff6a1a]"
  }
]

const resources = [
  {
    icon: Book,
    title: "Knowledge Base",
    description: "Browse articles and guides",
    link: "/dashboard/resources"
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch step-by-step guides",
    link: "/dashboard/resources"
  },
  {
    icon: FileText,
    title: "Documentation",
    description: "Download templates and forms",
    link: "/dashboard/documents"
  }
]

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketMessage, setTicketMessage] = useState("")

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle ticket submission
    alert("Support ticket submitted! We'll get back to you within 24 hours.")
    setTicketSubject("")
    setTicketMessage("")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-montserrat text-2xl font-bold text-gray-900">Support Center</h1>
        <p className="text-gray-600 mt-1">Get help with your services and account</p>
      </div>

      {/* Quick Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {contactMethods.map((method, index) => (
          <motion.div
            key={method.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-lg w-fit mb-4 ${method.color}`}>
              <method.icon className="h-6 w-6" />
            </div>
            <h3 className="font-montserrat font-semibold text-gray-900 mb-1">
              {method.title}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{method.description}</p>
            <p className="text-xs text-gray-500 mb-4 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {method.availability}
            </p>
            <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg text-sm font-medium transition-colors">
              {method.action}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - FAQs */}
        <div className="lg:col-span-2 space-y-6">
          {/* FAQ Section */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-montserrat text-lg font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>

            {/* Search FAQs */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a]"
              />
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-4 pb-4"
                    >
                      <p className="text-gray-600">{faq.answer}</p>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No FAQs match your search</p>
              </div>
            )}
          </div>

          {/* Submit Ticket */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-montserrat text-lg font-bold text-gray-900 mb-6">
              Submit a Support Ticket
            </h2>
            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="Please describe your issue in detail..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a] resize-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
              >
                <Send className="h-4 w-4" />
                Submit Ticket
              </button>
            </form>
          </div>
        </div>

        {/* Right Column - Resources & Status */}
        <div className="space-y-6">
          {/* Support Status */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500 rounded-full">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-montserrat font-semibold text-gray-900">
                All Systems Operational
              </h3>
            </div>
            <p className="text-sm text-gray-600">
              Our support team is available and all services are running normally.
            </p>
          </div>

          {/* Quick Resources */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-montserrat font-semibold text-gray-900 mb-4">
              Self-Service Resources
            </h3>
            <div className="space-y-3">
              {resources.map((resource) => (
                <Link
                  key={resource.title}
                  href={resource.link}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-orange-100 transition-colors">
                    <resource.icon className="h-5 w-5 text-gray-600 group-hover:text-[#ff6a1a] transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{resource.title}</h4>
                    <p className="text-sm text-gray-500">{resource.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Office Hours */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-montserrat font-semibold text-gray-900 mb-4">
              Support Hours
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monday - Friday</span>
                <span className="font-medium text-gray-900">9:00 AM - 6:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Saturday</span>
                <span className="font-medium text-gray-900">10:00 AM - 2:00 PM EST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sunday</span>
                <span className="font-medium text-gray-500">Closed</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <Headphones className="h-4 w-4 inline-block mr-1" />
                Emergency support available 24/7 for active service clients
              </p>
            </div>
          </div>

          {/* Quick Call CTA */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <h3 className="font-montserrat font-semibold text-gray-900 mb-2">
              Need immediate help?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Book a support consultation for personalized assistance.
            </p>
            <Link
              href="/book-call"
              className="inline-flex items-center gap-2 w-full justify-center px-4 py-3 bg-[#ff6a1a] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Schedule Support Call
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
