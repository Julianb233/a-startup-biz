"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PartnerLayout from "@/components/partner-layout"
import {
  Search,
  Download,
  FileText,
  Video,
  BookOpen,
  Lightbulb,
  ExternalLink,
  Play,
  Clock,
  Star,
  Filter,
} from "lucide-react"

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")

  const categories = ["All", "Guides", "Videos", "Templates", "Tools", "Training"]

  const resources = [
    {
      id: 1,
      title: "Partner Onboarding Guide",
      description: "Complete guide to getting started as a partner",
      category: "Guides",
      type: "PDF",
      icon: BookOpen,
      duration: "15 min read",
      rating: 4.8,
      downloads: 1234,
      featured: true,
    },
    {
      id: 2,
      title: "Referral Best Practices",
      description: "Learn how top partners generate consistent referrals",
      category: "Guides",
      type: "PDF",
      icon: Lightbulb,
      duration: "10 min read",
      rating: 4.9,
      downloads: 892,
      featured: true,
    },
    {
      id: 3,
      title: "Sales Training Video Series",
      description: "Master the art of selling our services",
      category: "Videos",
      type: "Video",
      icon: Video,
      duration: "2h 30min",
      rating: 4.7,
      downloads: 567,
      featured: false,
    },
    {
      id: 4,
      title: "Client Intake Form Template",
      description: "Professional template for new client onboarding",
      category: "Templates",
      type: "DOCX",
      icon: FileText,
      duration: "5 min setup",
      rating: 4.6,
      downloads: 2341,
      featured: false,
    },
    {
      id: 5,
      title: "Commission Calculator",
      description: "Spreadsheet to project your earnings",
      category: "Tools",
      type: "XLSX",
      icon: FileText,
      duration: "Ready to use",
      rating: 4.5,
      downloads: 1876,
      featured: false,
    },
    {
      id: 6,
      title: "Service Overview Presentation",
      description: "Slide deck explaining all our services",
      category: "Templates",
      type: "PPTX",
      icon: FileText,
      duration: "20 slides",
      rating: 4.8,
      downloads: 1543,
      featured: true,
    },
    {
      id: 7,
      title: "Partner Certification Course",
      description: "Complete training to become a certified partner",
      category: "Training",
      type: "Course",
      icon: BookOpen,
      duration: "4 hours",
      rating: 4.9,
      downloads: 432,
      featured: true,
    },
    {
      id: 8,
      title: "Marketing Materials Pack",
      description: "Brochures, flyers, and social media assets",
      category: "Templates",
      type: "ZIP",
      icon: FileText,
      duration: "50+ assets",
      rating: 4.7,
      downloads: 987,
      featured: false,
    },
  ]

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      categoryFilter === "All" || resource.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const featuredResources = resources.filter((r) => r.featured)

  return (
    <PartnerLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Partner Resources</h1>
            <p className="text-gray-600">Training materials, templates, and tools to help you succeed</p>
          </div>
        </motion.div>

        {/* Featured Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredResources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-xl p-6 text-white cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium bg-white/20 px-3 py-1 rounded-full">
                      {resource.type}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2 group-hover:underline">{resource.title}</h3>
                  <p className="text-sm text-white/80 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {resource.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      {resource.rating}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    categoryFilter === category
                      ? "bg-[#ff6a1a] text-white shadow-lg shadow-orange-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Resources Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <motion.div
                  key={resource.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#ff6a1a]/10 to-[#e55f17]/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-[#ff6a1a]" />
                      </div>
                      <span className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                        {resource.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#ff6a1a] transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {resource.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {resource.downloads.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-gray-900">{resource.rating}</span>
                    </div>
                    <button className="flex items-center gap-2 text-[#ff6a1a] font-medium text-sm hover:underline">
                      {resource.type === "Video" ? (
                        <>
                          <Play className="w-4 h-4" />
                          Watch Now
                        </>
                      ) : resource.type === "Course" ? (
                        <>
                          <ExternalLink className="w-4 h-4" />
                          Start Course
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </motion.div>
      </div>
    </PartnerLayout>
  )
}
