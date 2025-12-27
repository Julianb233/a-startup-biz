"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Sparkles, Zap, Brain, Workflow } from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceItem {
  name: string
  description: string
  features: string[]
}

interface ServiceCategory {
  title: string
  icon: React.ReactNode
  tagline: string
  services: ServiceItem[]
}

const servicesData: ServiceCategory[] = [
  {
    title: "AI Automation",
    icon: <Zap className="w-6 h-6" />,
    tagline: "Streamline your workflows with intelligent automation",
    services: [
      {
        name: "N8N Workflow Setup",
        description: "Custom workflow automation using N8N",
        features: ["API Integrations", "Custom Triggers", "Error Handling"],
      },
      {
        name: "Zapier Automation",
        description: "Connect your apps and automate tasks",
        features: ["Multi-app Zaps", "Conditional Logic", "Scheduled Tasks"],
      },
      {
        name: "Make.com Scenarios",
        description: "Visual automation builder for complex workflows",
        features: ["Data Transformation", "Webhooks", "App Connections"],
      },
    ],
  },
  {
    title: "AI Chatbots",
    icon: <Brain className="w-6 h-6" />,
    tagline: "Intelligent conversational AI for your business",
    services: [
      {
        name: "Customer Support Bot",
        description: "24/7 AI-powered customer assistance",
        features: ["Natural Language", "Multi-language", "Escalation"],
      },
      {
        name: "Lead Generation Bot",
        description: "Qualify and nurture leads automatically",
        features: ["Lead Scoring", "CRM Sync", "Follow-up Sequences"],
      },
      {
        name: "FAQ Assistant",
        description: "Instant answers to common questions",
        features: ["Knowledge Base", "Smart Search", "Analytics"],
      },
    ],
  },
  {
    title: "AI Content",
    icon: <Sparkles className="w-6 h-6" />,
    tagline: "Generate engaging content at scale",
    services: [
      {
        name: "Social Media Content",
        description: "AI-generated posts and captions",
        features: ["Multi-platform", "Brand Voice", "Scheduling"],
      },
      {
        name: "Blog & Article Writing",
        description: "SEO-optimized long-form content",
        features: ["Research", "SEO Tools", "Editing"],
      },
      {
        name: "Email Marketing",
        description: "Personalized email campaigns",
        features: ["A/B Testing", "Personalization", "Analytics"],
      },
    ],
  },
  {
    title: "AI Integration",
    icon: <Workflow className="w-6 h-6" />,
    tagline: "Connect AI to your existing systems",
    services: [
      {
        name: "CRM Integration",
        description: "AI-enhanced customer management",
        features: ["Salesforce", "HubSpot", "Custom CRMs"],
      },
      {
        name: "E-commerce AI",
        description: "Smart product recommendations",
        features: ["Shopify", "WooCommerce", "Custom Stores"],
      },
      {
        name: "Analytics & BI",
        description: "AI-powered business intelligence",
        features: ["Dashboards", "Predictions", "Reports"],
      },
    ],
  },
]

export function AIServicesAccordion() {
  const [activeCategory, setActiveCategory] = useState<string | null>("AI Automation")

  return (
    <div className="w-full bg-[#0A4D3C] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="flex flex-col">
            <h2 className="font-[family-name:var(--font-oswald)] text-4xl md:text-6xl font-bold uppercase leading-none text-white tracking-tighter">
              OUR SERVICES
            </h2>
            <h1 className="font-brier text-5xl text-[#D4A84B] leading-none md:-mt-2 md:text-7xl mt-2.5">
              What We Offer
            </h1>
          </div>
          <p className="text-[#F0D98C] text-sm md:text-base max-w-xs md:text-right font-medium">
            Comprehensive AI solutions tailored to your business needs.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {servicesData.map((category) => (
            <div key={category.title} className="border-b border-white/10 last:border-none">
              <button
                onClick={() => setActiveCategory(activeCategory === category.title ? null : category.title)}
                className={cn(
                  "w-full flex items-center justify-between p-4 md:p-6 transition-all duration-300 ease-out group",
                  activeCategory === category.title
                    ? "bg-[#D4A84B] text-[#0A4D3C]"
                    : "bg-transparent text-white hover:bg-white/5",
                )}
              >
                <div className="flex items-center gap-6">
                  <ChevronDown
                    className={cn(
                      "w-6 h-6 md:w-8 md:h-8 transition-transform duration-300",
                      activeCategory === category.title ? "rotate-180 text-[#0A4D3C]" : "text-white -rotate-90",
                    )}
                  />
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "p-2 rounded-lg",
                        activeCategory === category.title ? "bg-[#0A4D3C]/20" : "bg-white/10",
                      )}
                    >
                      {category.icon}
                    </div>
                    <span className="font-[family-name:var(--font-oswald)] font-bold text-3xl md:text-5xl tracking-tighter leading-none">
                      {category.title}
                    </span>
                  </div>
                </div>

                <div className="hidden md:block">
                  <span className="text-sm opacity-70">{category.tagline}</span>
                </div>
              </button>

              <AnimatePresence>
                {activeCategory === category.title && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden bg-[#0D6B4F]/30"
                  >
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      {category.services.map((service, index) => (
                        <motion.div
                          key={service.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors"
                        >
                          <h3 className="font-[family-name:var(--font-oswald)] font-bold text-xl text-white mb-2">
                            {service.name}
                          </h3>
                          <p className="text-white/60 text-sm mb-4">{service.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {service.features.map((feature, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 rounded-full bg-[#D4A84B]/20 text-[#D4A84B]">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
