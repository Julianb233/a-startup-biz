"use client"

import { motion } from "framer-motion"
import { Clock, Users, TrendingUp, Sparkles } from "lucide-react"

export type UrgencyVariant = "limited-spots" | "early-bird" | "fast-review" | "social-proof"

interface UrgencyBannerProps {
  variant?: UrgencyVariant
  className?: string
  compact?: boolean
}

const urgencyConfig = {
  "limited-spots": {
    icon: Users,
    text: "Only 15 partner spots available for January 2025",
    subtext: "7 spots remaining",
    color: "teal",
    badge: "Limited Availability"
  },
  "early-bird": {
    icon: TrendingUp,
    text: "Next 10 partners get 27.5% commission rate",
    subtext: "vs. standard 25% - Limited time offer",
    color: "sky",
    badge: "Early Bird Bonus"
  },
  "fast-review": {
    icon: Clock,
    text: "Applications reviewed within 24 hours",
    subtext: "Average response time: 4 hours",
    color: "teal",
    badge: "Fast Track"
  },
  "social-proof": {
    icon: Sparkles,
    text: "Join 247 facilities already earning commissions",
    subtext: "New partners added this week: 12",
    color: "teal",
    badge: "Growing Network"
  }
}

export function UrgencyBanner({
  variant = "limited-spots",
  className = "",
  compact = false
}: UrgencyBannerProps) {
  const config = urgencyConfig[variant]
  const Icon = config.icon

  const colorClasses = {
    teal: {
      bg: "from-teal-500/10 to-teal-600/10",
      border: "border-teal-400/30",
      iconBg: "bg-teal-500/20",
      iconColor: "text-teal-600",
      textColor: "text-teal-900",
      subtextColor: "text-teal-700",
      badgeBg: "bg-teal-500",
      badgeText: "text-white",
      glow: "shadow-teal-500/20"
    },
    sky: {
      bg: "from-sky-500/10 to-sky-600/10",
      border: "border-sky-400/30",
      iconBg: "bg-sky-500/20",
      iconColor: "text-sky-600",
      textColor: "text-sky-900",
      subtextColor: "text-sky-700",
      badgeBg: "bg-sky-500",
      badgeText: "text-white",
      glow: "shadow-sky-500/20"
    }
  }

  const colors = colorClasses[config.color as keyof typeof colorClasses]

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-lg ${className}`}
      >
        <Icon className={`w-4 h-4 ${colors.iconColor}`} />
        <span className={`text-sm font-semibold ${colors.textColor}`}>
          {config.text}
        </span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-xl border ${colors.border} bg-gradient-to-r ${colors.bg} backdrop-blur-sm ${className}`}
    >
      {/* Animated background shimmer */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ["-100%", "100%"]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative p-4 md:p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.iconBg} flex items-center justify-center shadow-lg ${colors.glow}`}>
            <Icon className={`w-6 h-6 ${colors.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className={`text-base md:text-lg font-bold ${colors.textColor} leading-tight`}>
                {config.text}
              </h3>
              <span className={`flex-shrink-0 px-3 py-1 ${colors.badgeBg} ${colors.badgeText} text-xs font-semibold rounded-full shadow-sm`}>
                {config.badge}
              </span>
            </div>
            <p className={`text-sm ${colors.subtextColor} font-medium`}>
              {config.subtext}
            </p>
          </div>
        </div>

        {/* Progress indicator for limited spots variant */}
        {variant === "limited-spots" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 pt-4 border-t border-teal-200/50"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-teal-700">Spots Filled</span>
              <span className="text-xs font-bold text-teal-900">8 of 15</span>
            </div>
            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "53%" }}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
              />
            </div>
          </motion.div>
        )}

        {/* Countdown timer effect for early bird */}
        {variant === "early-bird" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center gap-2 text-xs font-semibold text-sky-700"
          >
            <Clock className="w-4 h-4" />
            <span>Offer ends when spots fill up</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
