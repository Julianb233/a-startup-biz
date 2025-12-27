"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {
  CheckCircle2,
  Building2,
  Code2,
  Settings,
  Rocket,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Download,
  ExternalLink,
  Phone,
  CreditCard,
  DollarSign,
  Users,
  Sparkles,
  TrendingUp,
  BookOpen,
  Mail
} from "lucide-react"

interface StepperProps {
  currentStep: number
  totalSteps: number
}

function Stepper({ currentStep, totalSteps }: StepperProps) {
  const steps = [
    { number: 1, title: "Business Info", icon: Building2 },
    { number: 2, title: "Integration", icon: Code2 },
    { number: 3, title: "Customize", icon: Settings },
    { number: 4, title: "Go Live", icon: Rocket },
  ]

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
          <motion.div
            className="h-full bg-gradient-to-r from-[#14B8A6] to-[#0D9488]"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between items-start">
          {steps.map((step) => {
            const Icon = step.icon
            const isCompleted = currentStep > step.number
            const isCurrent = currentStep === step.number

            return (
              <div key={step.number} className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? "bg-[#14B8A6] text-white"
                      : isCurrent
                      ? "bg-[#14B8A6] text-white ring-4 ring-[#14B8A6]/20"
                      : "bg-white border-2 border-gray-300 text-gray-400"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: step.number * 0.1 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </motion.div>
                <span className={`text-xs font-medium hidden sm:block ${
                  isCurrent ? "text-[#14B8A6]" : "text-gray-500"
                }`}>
                  {step.title}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Step1BusinessInfo({ onNext }: { onNext: () => void }) {
  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "",
    address: "",
    contactName: "",
    email: "",
    phone: "",
    estimatedCustomers: "",
  })

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Business Information</h2>
            <p className="text-sm text-gray-600">Tell us about your business</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
                placeholder="Peak Performance Gym"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Type *
              </label>
              <select
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
              >
                <option value="">Select type</option>
                <option value="gym">Gym</option>
                <option value="climbing">Climbing Facility</option>
                <option value="rental">Equipment Rental</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Business Address *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
              placeholder="123 Main St, City, State ZIP"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
                placeholder="(555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Daily Customers *
              </label>
              <select
                value={formData.estimatedCustomers}
                onChange={(e) => setFormData({ ...formData, estimatedCustomers: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent transition-all"
              >
                <option value="">Select range</option>
                <option value="1-50">1-50 customers/day</option>
                <option value="51-100">51-100 customers/day</option>
                <option value="101-250">101-250 customers/day</option>
                <option value="250+">250+ customers/day</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function Step2Integration({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selectedIntegration, setSelectedIntegration] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const widgetCode = `<script src="https://cdn.dailyeventinsurance.com/widget.js"></script>
<div id="dei-widget" data-partner-id="YOUR_ID"></div>`

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const integrationOptions = [
    {
      id: "widget",
      name: "Widget Embed",
      description: "Simple copy-paste widget for your website",
      difficulty: "Easiest",
      time: "5 minutes",
      recommended: true,
    },
    {
      id: "api",
      name: "API Integration",
      description: "Full control with RESTful API",
      difficulty: "Advanced",
      time: "1-2 hours",
      recommended: false,
    },
    {
      id: "manual",
      name: "Manual Portal",
      description: "Use our partner dashboard to process claims",
      difficulty: "No code",
      time: "Instant",
      recommended: false,
    },
  ]

  const posIntegrations = [
    { name: "Mindbody", logo: "💪" },
    { name: "Zen Planner", logo: "🧘" },
    { name: "ClimbingGym Pro", logo: "🧗" },
    { name: "Square", logo: "⬜" },
    { name: "Custom API", logo: "⚙️" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Choose Your Integration</h2>
            <p className="text-sm text-gray-600">Select how you want to connect with us</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {integrationOptions.map((option) => (
            <motion.div
              key={option.id}
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedIntegration(option.id)}
              className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all ${
                selectedIntegration === option.id
                  ? "border-[#14B8A6] bg-[#14B8A6]/5"
                  : "border-gray-200 hover:border-[#14B8A6]/50"
              }`}
            >
              {option.recommended && (
                <div className="absolute -top-3 right-4 px-3 py-1 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white text-xs font-bold rounded-full">
                  Recommended
                </div>
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{option.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                  <div className="flex gap-4 text-xs">
                    <span className="text-gray-500">
                      Difficulty: <span className="font-semibold text-[#14B8A6]">{option.difficulty}</span>
                    </span>
                    <span className="text-gray-500">
                      Setup Time: <span className="font-semibold text-[#14B8A6]">{option.time}</span>
                    </span>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedIntegration === option.id
                    ? "border-[#14B8A6] bg-[#14B8A6]"
                    : "border-gray-300"
                }`}>
                  {selectedIntegration === option.id && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedIntegration === "widget" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
          >
            <h3 className="text-sm font-bold text-gray-900 mb-3">Widget Code Snippet</h3>
            <div className="relative">
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto">
                <code>{widgetCode}</code>
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
          </motion.div>
        )}

        {selectedIntegration === "api" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200"
          >
            <h3 className="text-sm font-bold text-gray-900 mb-3">API Documentation</h3>
            <p className="text-sm text-gray-600 mb-4">
              Access our comprehensive API docs to build custom integrations.
            </p>
            <a
              href="/docs/api"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              View API Docs
              <ExternalLink className="w-4 h-4" />
            </a>
          </motion.div>
        )}

        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Compatible POS Systems</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {posIntegrations.map((pos) => (
              <div
                key={pos.name}
                className="p-4 border border-gray-200 rounded-lg text-center hover:border-[#14B8A6] hover:bg-[#14B8A6]/5 transition-all"
              >
                <div className="text-2xl mb-1">{pos.logo}</div>
                <div className="text-xs font-medium text-gray-700">{pos.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            disabled={!selectedIntegration}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function Step3Customize({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>(["liability"])
  const [pricing, setPricing] = useState({
    liability: 25,
    equipment: 15,
    cancellation: 20,
  })

  const products = [
    {
      id: "liability",
      name: "Liability Coverage",
      description: "Protection against accidents and injuries",
      basePrice: 25,
      commission: 40,
    },
    {
      id: "equipment",
      name: "Equipment Protection",
      description: "Coverage for damaged or lost rental equipment",
      basePrice: 15,
      commission: 35,
    },
    {
      id: "cancellation",
      name: "Event Cancellation",
      description: "Refund protection for cancelled events",
      basePrice: 20,
      commission: 30,
    },
  ]

  const toggleProduct = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const calculateCommission = (basePrice: number, commissionRate: number) => {
    return (basePrice * (commissionRate / 100)).toFixed(2)
  }

  const totalMonthlyRevenue = selectedProducts.reduce((total, productId) => {
    const product = products.find(p => p.id === productId)
    if (!product) return total
    return total + (Number(calculateCommission(pricing[productId as keyof typeof pricing], product.commission)) * 30)
  }, 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customize Your Coverage</h2>
            <p className="text-sm text-gray-600">Select products and set your pricing</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {products.map((product) => {
            const isSelected = selectedProducts.includes(product.id)
            const commission = calculateCommission(pricing[product.id as keyof typeof pricing], product.commission)

            return (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.01 }}
                className={`p-6 border-2 rounded-xl transition-all ${
                  isSelected
                    ? "border-[#14B8A6] bg-[#14B8A6]/5"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleProduct(product.id)}
                      className={`mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-[#14B8A6] bg-[#14B8A6]"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-600">{product.description}</p>
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="pl-9 space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Customer Price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <input
                            type="number"
                            value={pricing[product.id as keyof typeof pricing]}
                            onChange={(e) => setPricing({ ...pricing, [product.id]: Number(e.target.value) })}
                            className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Your Commission ({product.commission}%)
                        </label>
                        <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 font-bold">
                          ${commission}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="mb-8 p-6 bg-gradient-to-br from-[#14B8A6]/10 to-[#0D9488]/10 rounded-xl border border-[#14B8A6]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Estimated Monthly Revenue</h3>
              <p className="text-xs text-gray-600">Based on 30 sales per product/month</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#14B8A6]">
                ${totalMonthlyRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600 mt-1">Passive income potential</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Brand Customization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  defaultValue="#14B8A6"
                  className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  defaultValue="#14B8A6"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#14B8A6] focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Upload Logo
              </label>
              <div className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-gray-600 flex items-center justify-between">
                <span>Choose file...</span>
                <Download className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function Step4GoLive({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [checklist, setChecklist] = useState({
    testTransaction: false,
    staffTraining: false,
    marketingMaterials: false,
    supportContact: false,
  })

  const checklistItems = [
    {
      id: "testTransaction",
      title: "Complete Test Transaction",
      description: "Process a test insurance purchase to verify integration",
      icon: CreditCard,
      action: "Start Test",
    },
    {
      id: "staffTraining",
      title: "Staff Training Resources",
      description: "Access training videos and documentation for your team",
      icon: BookOpen,
      action: "View Training",
    },
    {
      id: "marketingMaterials",
      title: "Download Marketing Materials",
      description: "Get posters, email templates, and social media content",
      icon: Download,
      action: "Download Kit",
    },
    {
      id: "supportContact",
      title: "Save Support Contact",
      description: "Add our support team to your contacts for quick help",
      icon: Phone,
      action: "Add Contact",
    },
  ]

  const allCompleted = Object.values(checklist).every(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#14B8A6] to-[#0D9488] flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Go Live Checklist</h2>
            <p className="text-sm text-gray-600">Complete these steps to start earning</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {checklistItems.map((item) => {
            const Icon = item.icon
            const isCompleted = checklist[item.id as keyof typeof checklist]

            return (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.01 }}
                className={`p-6 border-2 rounded-xl transition-all ${
                  isCompleted
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    isCompleted ? "bg-green-500" : "bg-gray-100"
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      isCompleted ? "text-white" : "text-gray-600"
                    }`} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>

                      <button
                        onClick={() => setChecklist({ ...checklist, [item.id]: !isCompleted })}
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          isCompleted
                            ? "border-green-500 bg-green-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isCompleted && <Check className="w-4 h-4 text-white" />}
                      </button>
                    </div>

                    {!isCompleted && (
                      <button
                        onClick={() => setChecklist({ ...checklist, [item.id]: true })}
                        className="mt-3 px-4 py-2 bg-[#14B8A6] text-white text-sm font-semibold rounded-lg hover:bg-[#0D9488] transition-colors"
                      >
                        {item.action}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="text-sm font-bold text-blue-900 mb-1">Need Help?</h3>
              <p className="text-sm text-blue-700 mb-3">
                Our support team is here to help you get started.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:support@dailyeventinsurance.com"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  support@dailyeventinsurance.com
                </a>
                <span className="text-blue-400">•</span>
                <a
                  href="tel:1-800-123-4567"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  1-800-123-4567
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </motion.button>

          <motion.button
            whileHover={{ scale: allCompleted ? 1.02 : 1 }}
            whileTap={{ scale: allCompleted ? 0.98 : 1 }}
            onClick={onComplete}
            disabled={!allCompleted}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#14B8A6] to-[#0D9488] text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Complete Setup
            <Sparkles className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-gradient-to-br from-[#14B8A6] to-[#0D9488] rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-[#14B8A6]" />
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          You're Ready to Start Earning!
        </h1>
        <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
          Congratulations! Your account is set up and you can now start offering insurance to your customers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <DollarSign className="w-8 h-8 mb-3 mx-auto" />
            <div className="text-2xl font-bold mb-1">40%</div>
            <div className="text-sm text-white/80">Commission Rate</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <Users className="w-8 h-8 mb-3 mx-auto" />
            <div className="text-2xl font-bold mb-1">1,000+</div>
            <div className="text-sm text-white/80">Partner Locations</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
            <TrendingUp className="w-8 h-8 mb-3 mx-auto" />
            <div className="text-2xl font-bold mb-1">$2.5K</div>
            <div className="text-sm text-white/80">Avg Monthly Revenue</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
            href="/dashboard"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-white text-[#14B8A6] font-bold rounded-lg hover:bg-gray-50 transition-all shadow-lg"
          >
            Go to Dashboard
          </motion.a>

          <motion.a
            href="/docs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/20 transition-all border-2 border-white/20"
          >
            View Documentation
          </motion.a>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20">
          <p className="text-sm text-white/80 mb-2">
            Questions? Our team is here to help
          </p>
          <a
            href="mailto:support@dailyeventinsurance.com"
            className="text-sm font-semibold hover:underline"
          >
            support@dailyeventinsurance.com
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isComplete, setIsComplete] = useState(false)

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleComplete = () => {
    setIsComplete(true)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <div className="pt-32 pb-20 px-4">
        {/* Welcome Section */}
        {!isComplete && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-[#14B8A6] to-[#0D9488] bg-clip-text text-transparent">
                Daily Event Insurance
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let's get you set up in just a few minutes. Complete each step to start offering insurance to your customers.
            </p>
          </motion.div>
        )}

        {/* Stepper */}
        {!isComplete && <Stepper currentStep={currentStep} totalSteps={4} />}

        {/* Steps */}
        <AnimatePresence mode="wait">
          {!isComplete && (
            <>
              {currentStep === 1 && <Step1BusinessInfo onNext={handleNext} />}
              {currentStep === 2 && <Step2Integration onNext={handleNext} onBack={handleBack} />}
              {currentStep === 3 && <Step3Customize onNext={handleNext} onBack={handleBack} />}
              {currentStep === 4 && <Step4GoLive onBack={handleBack} onComplete={handleComplete} />}
            </>
          )}

          {isComplete && <SuccessState />}
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  )
}
