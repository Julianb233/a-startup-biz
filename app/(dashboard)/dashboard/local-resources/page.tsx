"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Building2,
  Phone,
  Globe,
  Star,
  ExternalLink,
  Search,
  Filter,
  Users,
  Briefcase,
  Scale,
  Calculator,
  Megaphone,
  Wallet,
  ChevronRight,
  CheckCircle
} from "lucide-react"

// Mock location data
const userLocation = {
  city: "Orlando",
  state: "Florida",
  region: "Central Florida"
}

// Mock local resources data - will be replaced with real database queries based on user location
const localResources = [
  {
    id: 1,
    name: "Florida Small Business Development Center",
    category: "business_support",
    description: "Free business consulting, training workshops, and resources for Florida entrepreneurs.",
    address: "123 Business Park Dr, Orlando, FL 32801",
    phone: "(407) 555-0123",
    website: "https://floridasbdc.org",
    rating: 4.8,
    reviews: 156,
    services: ["Business Planning", "Financial Analysis", "Market Research"],
    verified: true,
    distance: "2.3 miles"
  },
  {
    id: 2,
    name: "Central Florida SCORE",
    category: "mentorship",
    description: "Free mentoring from experienced business professionals to help you start and grow.",
    address: "456 Entrepreneur Ave, Orlando, FL 32802",
    phone: "(407) 555-0456",
    website: "https://centralflorida.score.org",
    rating: 4.9,
    reviews: 234,
    services: ["Mentorship", "Workshops", "Business Templates"],
    verified: true,
    distance: "3.1 miles"
  },
  {
    id: 3,
    name: "Anderson & Associates CPA",
    category: "accounting",
    description: "Small business accounting, tax preparation, and financial consulting services.",
    address: "789 Financial Way, Orlando, FL 32803",
    phone: "(407) 555-0789",
    website: "https://andersoncpa.com",
    rating: 4.7,
    reviews: 89,
    services: ["Tax Preparation", "Bookkeeping", "Payroll"],
    verified: true,
    distance: "4.5 miles",
    partnerDiscount: "10% off first year"
  },
  {
    id: 4,
    name: "Florida Business Law Group",
    category: "legal",
    description: "Business formation, contracts, and legal services for entrepreneurs.",
    address: "321 Legal Plaza, Orlando, FL 32804",
    phone: "(407) 555-0321",
    website: "https://flbusinesslaw.com",
    rating: 4.6,
    reviews: 67,
    services: ["Business Formation", "Contracts", "Trademark"],
    verified: true,
    distance: "5.2 miles",
    partnerDiscount: "Free 30-min consultation"
  },
  {
    id: 5,
    name: "Orlando Marketing Collective",
    category: "marketing",
    description: "Local marketing agency specializing in small business branding and digital marketing.",
    address: "555 Creative Blvd, Orlando, FL 32805",
    phone: "(407) 555-0555",
    website: "https://orlandomarketingco.com",
    rating: 4.5,
    reviews: 112,
    services: ["Branding", "Social Media", "SEO"],
    verified: false,
    distance: "6.8 miles"
  },
  {
    id: 6,
    name: "First Community Bank - Small Business",
    category: "banking",
    description: "Local bank with specialized small business accounts and lending programs.",
    address: "999 Banking Center, Orlando, FL 32806",
    phone: "(407) 555-0999",
    website: "https://firstcommunitybank.com",
    rating: 4.4,
    reviews: 203,
    services: ["Business Accounts", "SBA Loans", "Credit Lines"],
    verified: true,
    distance: "1.5 miles",
    partnerDiscount: "No fees for 6 months"
  }
]

const categories = [
  { id: "all", name: "All Resources", icon: MapPin },
  { id: "business_support", name: "Business Support", icon: Briefcase },
  { id: "mentorship", name: "Mentorship", icon: Users },
  { id: "accounting", name: "Accounting", icon: Calculator },
  { id: "legal", name: "Legal", icon: Scale },
  { id: "marketing", name: "Marketing", icon: Megaphone },
  { id: "banking", name: "Banking", icon: Wallet }
]

export default function LocalResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredResources = localResources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.services.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const verifiedCount = localResources.filter(r => r.verified).length
  const partnersCount = localResources.filter(r => r.partnerDiscount).length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-montserrat text-2xl font-bold text-gray-900">Local Resources</h1>
        <p className="text-gray-600 mt-1">
          Trusted business resources in {userLocation.city}, {userLocation.state}
        </p>
      </div>

      {/* Location Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] rounded-xl p-6 text-white"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-lg">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-montserrat text-lg font-bold">
                Your Location: {userLocation.city}, {userLocation.state}
              </h2>
              <p className="text-white/90">
                Showing vetted resources from our {userLocation.region} referral network
              </p>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#ff6a1a] rounded-lg font-medium hover:bg-gray-100 transition-colors">
            <MapPin className="h-4 w-4" />
            Update Location
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Building2 className="h-6 w-6 text-[#ff6a1a]" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Local Resources</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">{localResources.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Verified Partners</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">{verifiedCount}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Star className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Exclusive Discounts</p>
              <p className="font-montserrat text-2xl font-bold text-gray-900">{partnersCount}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6a1a]/20 focus:border-[#ff6a1a]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-[#ff6a1a] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <category.icon className="h-4 w-4" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        {filteredResources.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-montserrat text-lg font-semibold text-gray-900 mb-2">
              No resources found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          filteredResources.map((resource, index) => {
            const CategoryIcon = categories.find(c => c.id === resource.category)?.icon || Building2

            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 rounded-lg">
                        <CategoryIcon className="h-6 w-6 text-[#ff6a1a]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-montserrat font-semibold text-gray-900">
                            {resource.name}
                          </h3>
                          {resource.verified && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          {resource.description}
                        </p>

                        {/* Services */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {resource.services.map((service, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                            >
                              {service}
                            </span>
                          ))}
                        </div>

                        {/* Contact Info */}
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {resource.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {resource.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            {resource.rating} ({resource.reviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {resource.partnerDiscount && (
                        <div className="bg-purple-100 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium text-center">
                          {resource.partnerDiscount}
                        </div>
                      )}
                      <a
                        href={resource.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#ff6a1a] text-white rounded-lg text-sm font-medium hover:bg-[#ea580c] transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        Visit Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <button className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Phone className="h-4 w-4" />
                        Call Now
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      {/* Request Resource */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="font-montserrat font-semibold text-gray-900 mb-1">
              Can't find what you need?
            </h3>
            <p className="text-gray-600">
              Let us know what type of resource you're looking for and we'll find vetted options in your area.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff6a1a] text-white rounded-lg font-semibold hover:bg-[#ea580c] transition-colors whitespace-nowrap">
            Request a Resource
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
