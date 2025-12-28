import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { resources, categories, type Resource } from "@/lib/resources-data"
import {
  Download,
  FileText,
  Scale,
  Calculator,
  TrendingUp,
  Crown,
  Calendar,
  Search
} from "lucide-react"

const iconMap = {
  FileText,
  Scale,
  Calculator,
  TrendingUp
}

function getFileIcon(type: Resource["type"]) {
  switch (type) {
    case "PDF":
      return "📄"
    case "DOC":
    case "DOCX":
      return "📝"
    case "XLS":
    case "XLSX":
      return "📊"
    default:
      return "📁"
  }
}

export default async function ResourcesPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  // Group resources by category
  const resourcesByCategory = categories.map(category => ({
    ...category,
    items: resources.filter(r => r.category === category.name)
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-montserrat text-3xl font-bold text-gray-900 mb-2">
          Resource Library
        </h1>
        <p className="text-lg text-gray-600">
          Download templates, guides, and tools to accelerate your business growth
        </p>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search resources..."
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent font-montserrat"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Resources</p>
          <p className="font-montserrat text-3xl font-bold text-gray-900">
            {resources.length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-600 mb-1">Free Resources</p>
          <p className="font-montserrat text-3xl font-bold text-green-600">
            {resources.filter(r => !r.premium).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-sm font-medium text-gray-600 mb-1">Premium Resources</p>
          <p className="font-montserrat text-3xl font-bold text-[#ff6a1a]">
            {resources.filter(r => r.premium).length}
          </p>
        </div>
      </div>

      {/* Resources by category */}
      {resourcesByCategory.map(category => {
        const Icon = iconMap[category.icon as keyof typeof iconMap]

        return (
          <div key={category.name}>
            {/* Category header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                <Icon className="h-6 w-6 text-[#ff6a1a]" />
              </div>
              <div>
                <h2 className="font-montserrat text-2xl font-bold text-gray-900">
                  {category.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Resource cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {category.items.map(resource => (
                <div
                  key={resource.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
                >
                  {/* Card header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">
                        {getFileIcon(resource.type)}
                      </div>
                      {resource.premium && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] text-white text-xs font-semibold rounded-full">
                          <Crown className="h-3 w-3" />
                          <span>Premium</span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-montserrat font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-[#ff6a1a] transition-colors">
                      {resource.title}
                    </h3>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {resource.description}
                    </p>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="font-medium">{resource.type}</span>
                      {resource.fileSize && (
                        <>
                          <span>•</span>
                          <span>{resource.fileSize}</span>
                        </>
                      )}
                    </div>

                    {resource.lastUpdated && (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>Updated {new Date(resource.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Card footer */}
                  <div className="px-6 pb-6">
                    <button
                      className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        resource.premium
                          ? "bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] text-white hover:shadow-lg hover:shadow-orange-500/30"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      <Download className="h-4 w-4" />
                      <span>{resource.premium ? "Download (Premium)" : "Download Free"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Upgrade CTA for free users */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#ff6a1a]/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#ea580c]/20 to-transparent rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-[#ff6a1a] to-[#ea580c] rounded-lg">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="font-montserrat text-2xl font-bold mb-2">
                Unlock Premium Resources
              </h3>
              <p className="text-gray-300 text-lg">
                Get access to exclusive templates, advanced tools, and attorney-reviewed legal documents
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h4 className="font-semibold mb-1">Pitch Deck Template</h4>
              <p className="text-sm text-gray-300">Investor-ready presentation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h4 className="font-semibold mb-1">Financial Models</h4>
              <p className="text-sm text-gray-300">3-year projections & planning</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h4 className="font-semibold mb-1">Legal Agreements</h4>
              <p className="text-sm text-gray-300">Attorney-reviewed contracts</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-[#ff6a1a] to-[#ea580c] text-white font-semibold rounded-lg hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-200">
              Upgrade to Premium
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
