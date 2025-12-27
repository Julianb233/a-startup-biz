"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PartnerLayout from "@/components/partner-layout"
import {
  Search,
  Filter,
  Star,
  Send,
  CheckCircle,
  Building2,
  Users,
  Globe,
  Award,
  ArrowUpRight,
} from "lucide-react"

export default function ProvidersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const categories = [
    "All",
    "Legal",
    "Accounting",
    "EIN Filing",
    "Websites",
    "Marketing",
    "Insurance",
    "Banking",
    "HR Services",
  ]

  const providers = [
    {
      id: 1,
      name: "LegalEase Partners",
      category: "Legal",
      rating: 4.9,
      reviews: 247,
      commission: "$300",
      description: "Full-service business formation and legal support",
      specialties: ["LLC Formation", "Contracts", "Compliance"],
      verified: true,
      logo: "🏛️",
      stats: {
        completedReferrals: 523,
        avgResponseTime: "2 hours",
        successRate: "98%",
      },
    },
    {
      id: 2,
      name: "TaxPro Solutions",
      category: "EIN Filing",
      rating: 4.8,
      reviews: 189,
      commission: "$150",
      description: "Fast and reliable EIN filing service",
      specialties: ["EIN Filing", "Tax ID", "IRS Registration"],
      verified: true,
      logo: "📋",
      stats: {
        completedReferrals: 412,
        avgResponseTime: "1 hour",
        successRate: "99%",
      },
    },
    {
      id: 3,
      name: "NumbersFirst CPA",
      category: "Accounting",
      rating: 4.9,
      reviews: 312,
      commission: "$200",
      description: "Professional accounting and bookkeeping services",
      specialties: ["Bookkeeping", "Tax Prep", "Payroll"],
      verified: true,
      logo: "🧮",
      stats: {
        completedReferrals: 687,
        avgResponseTime: "3 hours",
        successRate: "97%",
      },
    },
    {
      id: 4,
      name: "WebCraft Studios",
      category: "Websites",
      rating: 4.7,
      reviews: 156,
      commission: "$500",
      description: "Custom website design and development",
      specialties: ["Web Design", "E-commerce", "SEO"],
      verified: true,
      logo: "🎨",
      stats: {
        completedReferrals: 298,
        avgResponseTime: "4 hours",
        successRate: "95%",
      },
    },
    {
      id: 5,
      name: "GrowthHub Marketing",
      category: "Marketing",
      rating: 4.8,
      reviews: 203,
      commission: "$400",
      description: "Full-service digital marketing agency",
      specialties: ["Social Media", "PPC", "Content Marketing"],
      verified: true,
      logo: "📈",
      stats: {
        completedReferrals: 445,
        avgResponseTime: "2 hours",
        successRate: "96%",
      },
    },
    {
      id: 6,
      name: "CoverRight Insurance",
      category: "Insurance",
      rating: 4.9,
      reviews: 278,
      commission: "$250",
      description: "Business insurance and risk management",
      specialties: ["General Liability", "Workers Comp", "Property"],
      verified: true,
      logo: "🛡️",
      stats: {
        completedReferrals: 534,
        avgResponseTime: "1 hour",
        successRate: "98%",
      },
    },
    {
      id: 7,
      name: "BizBank Pro",
      category: "Banking",
      rating: 4.6,
      reviews: 145,
      commission: "$175",
      description: "Business banking and merchant services",
      specialties: ["Business Accounts", "Merchant Services", "Loans"],
      verified: true,
      logo: "🏦",
      stats: {
        completedReferrals: 321,
        avgResponseTime: "3 hours",
        successRate: "94%",
      },
    },
    {
      id: 8,
      name: "HireWise HR",
      category: "HR Services",
      rating: 4.8,
      reviews: 192,
      commission: "$350",
      description: "HR solutions and employee management",
      specialties: ["Payroll", "Benefits", "Compliance"],
      verified: true,
      logo: "👥",
      stats: {
        completedReferrals: 389,
        avgResponseTime: "2 hours",
        successRate: "97%",
      },
    },
  ]

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "All" || provider.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <PartnerLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vetted Service Providers
          </h1>
          <p className="text-gray-600">
            Browse our network of trusted service providers and refer your
            clients to earn commissions.
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? "bg-[#ff6a1a] text-white shadow-lg shadow-orange-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">
                {filteredProviders.length}
              </span>{" "}
              providers found
            </p>
            <p className="text-gray-500">
              Total commission potential:{" "}
              <span className="font-semibold text-green-600">
                ${filteredProviders.reduce((sum, p) => sum + parseInt(p.commission.replace("$", "")), 0).toLocaleString()}
              </span>
            </p>
          </div>
        </motion.div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProviders.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center text-3xl">
                      {provider.logo}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {provider.name}
                        </h3>
                        {provider.verified && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {provider.category}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold text-gray-900">
                            {provider.rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({provider.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Commission</p>
                    <p className="text-2xl font-bold text-green-600">
                      {provider.commission}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 mb-4">{provider.description}</p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      <Users className="w-3 h-3" />
                      Referrals
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {provider.stats.completedReferrals}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      <Globe className="w-3 h-3" />
                      Response
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {provider.stats.avgResponseTime}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                      <Award className="w-3 h-3" />
                      Success
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {provider.stats.successRate}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-all shadow-lg shadow-orange-500/20"
                  >
                    <Send className="w-4 h-4" />
                    Refer Client
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProviders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center"
          >
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No providers found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find providers
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
              className="px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </PartnerLayout>
  )
}
