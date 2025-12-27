"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Calculator, TrendingUp, DollarSign, Users, Building2, Sparkles } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

// Tiered commission structure - more volume = higher percentage
// Base policy price: ~$40, commission tiers from 25% to 37.5%
const commissionTiers = [
  { minVolume: 0, maxVolume: 999, percentage: 25, perParticipant: 10 },
  { minVolume: 1000, maxVolume: 2499, percentage: 27.5, perParticipant: 11 },
  { minVolume: 2500, maxVolume: 4999, percentage: 30, perParticipant: 12 },
  { minVolume: 5000, maxVolume: 9999, percentage: 32.5, perParticipant: 13 },
  { minVolume: 10000, maxVolume: 24999, percentage: 35, perParticipant: 14 },
  { minVolume: 25000, maxVolume: Infinity, percentage: 37.5, perParticipant: 15 },
]

const volumeTiers = [
  { label: "1,000", value: 1000 },
  { label: "2,500", value: 2500 },
  { label: "5,000", value: 5000 },
  { label: "10,000", value: 10000 },
  { label: "25,000", value: 25000 },
  { label: "50,000+", value: 50000 },
]

const locationOptions = [
  { label: "1 Location", value: 1, bonus: 0 },
  { label: "2-5 Locations", value: 3, bonus: 0.5 },
  { label: "6-10 Locations", value: 8, bonus: 1 },
  { label: "11-25 Locations", value: 18, bonus: 1.5 },
  { label: "25+ Locations", value: 30, bonus: 2 },
]

// Expected opt-in rate
const OPT_IN_RATE = 0.65

// Get commission tier based on total volume
function getCommissionTier(totalVolume: number) {
  return commissionTiers.find(tier => totalVolume >= tier.minVolume && totalVolume <= tier.maxVolume) || commissionTiers[0]
}

// Generate chart data points for visualization
function generateChartData(locations: number = 1) {
  const data = []
  const locationOption = locationOptions.find(o => o.value === locations) || locationOptions[0]

  const dataPoints = [
    0, 500, 999, 1000, 1500, 2000, 2499, 2500, 3000, 4000, 4999,
    5000, 6000, 8000, 9999, 10000, 15000, 20000, 24999, 25000, 35000, 50000
  ]

  for (const participants of dataPoints) {
    const optedIn = Math.round(participants * OPT_IN_RATE)
    const tier = getCommissionTier(participants)
    const effectiveRate = tier.perParticipant + locationOption.bonus
    const monthlyEarnings = Math.round(optedIn * effectiveRate)

    data.push({
      participants,
      earnings: monthlyEarnings,
      tier: `${tier.percentage}% tier ($${tier.perParticipant}/participant)`,
    })
  }

  return data
}

// Custom tooltip for chart
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    payload: {
      participants: number
      earnings: number
      tier: string
    }
  }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-teal-200 rounded-xl shadow-xl p-4 min-w-[200px]">
        <p className="text-sm font-semibold text-slate-700 mb-2">
          {data.participants.toLocaleString()} participants
        </p>
        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
          ${data.earnings.toLocaleString()}
        </p>
        <p className="text-xs text-slate-500 mt-1">monthly earnings</p>
        <p className="text-xs text-teal-600 font-medium mt-2 border-t border-slate-200 pt-2">
          {data.tier}
        </p>
      </div>
    )
  }
  return null
}

export function RevenueCalculator() {
  const [monthlyVolume, setMonthlyVolume] = useState(2500)
  const [locations, setLocations] = useState(1)
  const [isHovered, setIsHovered] = useState(false)

  // Generate chart data based on current location selection
  const chartData = useMemo(() => generateChartData(locations), [locations])

  // Calculate revenue with tiered commission
  const totalParticipants = monthlyVolume * locations
  const optedInParticipants = Math.round(totalParticipants * OPT_IN_RATE)
  const commissionTier = getCommissionTier(totalParticipants)
  const locationOption = locationOptions.find(o => o.value === locations) || locationOptions[0]
  const effectivePerParticipant = commissionTier.perParticipant + locationOption.bonus
  const monthlyRevenue = optedInParticipants * effectivePerParticipant
  const annualRevenue = monthlyRevenue * 12

  // Animated values
  const animatedMonthly = useSpring(monthlyRevenue, { stiffness: 100, damping: 20 })
  const animatedAnnual = useSpring(annualRevenue, { stiffness: 100, damping: 20 })
  const [displayMonthly, setDisplayMonthly] = useState(monthlyRevenue)
  const [displayAnnual, setDisplayAnnual] = useState(annualRevenue)

  useEffect(() => {
    const unsubMonthly = animatedMonthly.on("change", (v) => setDisplayMonthly(Math.round(v)))
    const unsubAnnual = animatedAnnual.on("change", (v) => setDisplayAnnual(Math.round(v)))
    return () => {
      unsubMonthly()
      unsubAnnual()
    }
  }, [animatedMonthly, animatedAnnual])

  // Update animated values when calculations change
  useEffect(() => {
    animatedMonthly.set(monthlyRevenue)
    animatedAnnual.set(annualRevenue)
  }, [monthlyRevenue, annualRevenue, animatedMonthly, animatedAnnual])

  // 3D Card effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [3, -3]), { stiffness: 150, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-3, 3]), { stiffness: 150, damping: 20 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    mouseX.set(x)
    mouseY.set(y)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setIsHovered(false)
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <section id="calculator" className="relative bg-gradient-to-b from-white to-slate-50 py-20 md:py-32 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 -left-20 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 -right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -40, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #14B8A6 1px, transparent 1px), linear-gradient(to bottom, #14B8A6 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 rounded-full border border-teal-200 mb-6"
          >
            <Calculator className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Revenue Calculator</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-slate-900 leading-tight tracking-tight">
            See What You <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">Could Earn</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
            Calculate your potential monthly recurring revenue based on your participant volume.
            Our tiered commission structure rewards volume: earn <strong className="text-teal-600">$10-15 per participant</strong> with
            <strong className="text-teal-600"> bonus incentives for multi-location partners</strong>.
          </p>
        </motion.div>

        {/* Calculator Card with 3D effect */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="perspective-1000"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative"
          >
            {/* Glow effect */}
            <motion.div
              className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-teal-500/20 via-cyan-400/15 to-teal-500/20 blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.3 }}
              transition={{ duration: 0.4 }}
            />

            <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl border border-teal-100 p-8 md:p-12 shadow-premium hover:shadow-premium-hover transition-shadow duration-500">
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: "-100%" }}
                animate={isHovered ? { x: "200%" } : { x: "-100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                {/* Left side - Inputs */}
                <div className="space-y-8">
                  {/* Monthly Volume Selector */}
                  <div>
                    <label className="flex items-center gap-2 text-slate-700 font-semibold mb-4">
                      <Users className="w-5 h-5 text-teal-600" />
                      Monthly Participants (per location)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {volumeTiers.map((tier) => (
                        <motion.button
                          key={tier.value}
                          onClick={() => setMonthlyVolume(tier.value)}
                          className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            monthlyVolume === tier.value
                              ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {tier.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Location Selector */}
                  <div>
                    <label className="flex items-center gap-2 text-slate-700 font-semibold mb-4">
                      <Building2 className="w-5 h-5 text-teal-600" />
                      Number of Locations
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {locationOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => setLocations(option.value)}
                          className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            locations === option.value
                              ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Stats Summary */}
                  <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Total monthly participants</span>
                      <span className="font-semibold text-slate-700">{totalParticipants.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Est. opt-in rate</span>
                      <span className="font-semibold text-slate-700">65%</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Participants with coverage</span>
                      <span className="font-semibold text-teal-600">{optedInParticipants.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-200 pt-3 mt-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500">Your commission tier</span>
                        <span className="font-bold text-teal-600">{commissionTier.percentage}%</span>
                      </div>
                      <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-slate-500">Per participant</span>
                        <span className="font-semibold text-teal-600">${effectivePerParticipant.toFixed(2)}</span>
                      </div>
                      {locationOption.bonus > 0 && (
                        <div className="text-xs text-teal-600 mt-2 text-right">
                          +${locationOption.bonus.toFixed(2)} multi-location bonus
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side - Results */}
                <div className="flex flex-col justify-center">
                  <div className="relative">
                    {/* Sparkle decorations */}
                    <motion.div
                      className="absolute -top-4 -right-4 text-teal-400"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-6 h-6" />
                    </motion.div>

                    {/* Monthly Revenue */}
                    <div className="mb-8">
                      <div className="text-slate-500 text-sm font-medium mb-2 uppercase tracking-wide">
                        Start Earning Today
                      </div>
                      <motion.div
                        className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 0.3 }}
                        key={displayMonthly}
                      >
                        {formatCurrency(displayMonthly)}
                      </motion.div>
                      <div className="text-slate-500 text-sm mt-2">
                        per month in recurring commission
                      </div>
                    </div>

                    {/* Annual Revenue */}
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border border-teal-100">
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-medium mb-2">
                        <TrendingUp className="w-4 h-4 text-teal-600" />
                        Annual Revenue Potential
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-teal-600">
                        {formatCurrency(displayAnnual)}
                      </div>
                      <div className="text-slate-500 text-sm mt-2">
                        added to your bottom line every year
                      </div>
                    </div>

                    {/* CTA */}
                    <motion.a
                      href="#apply"
                      className="mt-8 w-full inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/40 transition-all duration-300"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Earning Today
                      <DollarSign className="w-5 h-5" />
                    </motion.a>
                  </div>
                </div>
              </div>

              {/* Bottom accent line */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 rounded-b-3xl"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0.5 }}
                transition={{ duration: 0.4 }}
                style={{ originX: 0.5 }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Interactive Earnings Chart */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Earnings Growth <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">Potential</span>
            </h3>
            <p className="text-slate-600 text-sm md:text-base">
              See how your earnings scale with participant volume across commission tiers
            </p>
          </div>

          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-teal-100 p-6 md:p-8 shadow-lg">
            <div className="w-full h-[300px] md:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                  <XAxis
                    dataKey="participants"
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                    stroke="#cbd5e1"
                  />

                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                    stroke="#cbd5e1"
                  />

                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: '#14B8A6', strokeWidth: 2, strokeDasharray: '5 5' }}
                  />

                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="#14B8A6"
                    strokeWidth={3}
                    fill="url(#earningsGradient)"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Tier breakpoints legend */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-wider font-semibold">Commission Tiers</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {commissionTiers.map((tier, idx) => (
                  <div key={idx} className="text-center p-2 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-600 font-semibold">{tier.percentage}%</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {tier.minVolume.toLocaleString()}{tier.maxVolume === Infinity ? '+' : `-${tier.maxVolume.toLocaleString()}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              No setup fees
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Get paid monthly
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              48 hours to go live (timeline depends on contract signing)
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Zero overhead
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
