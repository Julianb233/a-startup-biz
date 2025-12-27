"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import {
  Calculator,
  TrendingUp,
  ArrowRight,
  Info,
  DollarSign,
  Clock,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import {
  CalculatorConfig,
  formatOutputValue
} from "@/lib/calculator-config"

interface ServiceCalculatorProps {
  config: CalculatorConfig
  serviceSlug: string
}

export default function ServiceCalculator({ config, serviceSlug }: ServiceCalculatorProps) {
  // Initialize input state with default values
  const [inputs, setInputs] = useState<Record<string, number>>(
    config.inputs.reduce((acc, input) => ({
      ...acc,
      [input.id]: input.defaultValue
    }), {})
  )

  // Calculate outputs whenever inputs change
  const [outputs, setOutputs] = useState<Record<string, number>>({})

  useEffect(() => {
    const calculated = config.calculate(inputs)
    setOutputs(calculated)
  }, [inputs, config])

  // Handle input changes
  const handleInputChange = (id: string, value: number) => {
    setInputs(prev => ({ ...prev, [id]: value }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  // Get color classes for outputs
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'primary':
        return 'bg-[#ff6a1a]/10 border-[#ff6a1a]/30 text-[#ff6a1a]'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-600'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-600'
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-600'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-600'
    }
  }

  const getIconForColor = (color: string) => {
    switch (color) {
      case 'primary':
        return TrendingUp
      case 'success':
        return CheckCircle2
      case 'warning':
        return DollarSign
      case 'info':
        return Clock
      default:
        return Sparkles
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#ff6a1a]/10 rounded-full mb-4">
              <Calculator className="w-5 h-5 text-[#ff6a1a]" />
              <span className="text-[#ff6a1a] font-semibold text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Value Calculator
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {config.title}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {config.description}
            </p>
          </motion.div>

          {/* Calculator Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden"
          >
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left Column - Inputs */}
              <div className="p-8 lg:p-10 bg-gradient-to-br from-white to-gray-50">
                <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <Sparkles className="w-5 h-5 text-[#ff6a1a]" />
                  Your Information
                </h3>

                <div className="space-y-8">
                  {config.inputs.map((input) => (
                    <motion.div
                      key={input.id}
                      variants={itemVariants}
                      className="space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {input.label}
                          {input.tooltip && (
                            <div className="group relative">
                              <Info className="w-4 h-4 text-gray-400 cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                {input.tooltip}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black" />
                              </div>
                            </div>
                          )}
                        </label>
                        <div className="text-lg font-bold text-[#ff6a1a]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {input.prefix}{inputs[input.id].toLocaleString()}{input.suffix}
                        </div>
                      </div>

                      {input.type === 'slider' ? (
                        <div className="space-y-2">
                          <Slider
                            value={[inputs[input.id]]}
                            onValueChange={(value) => handleInputChange(input.id, value[0])}
                            min={input.min}
                            max={input.max}
                            step={input.step}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                            <span>{input.prefix}{input.min.toLocaleString()}{input.suffix}</span>
                            <span>{input.prefix}{input.max.toLocaleString()}{input.suffix}</span>
                          </div>
                        </div>
                      ) : (
                        <input
                          type="number"
                          value={inputs[input.id]}
                          onChange={(e) => handleInputChange(input.id, parseFloat(e.target.value) || 0)}
                          min={input.min}
                          max={input.max}
                          step={input.step}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ff6a1a] focus:outline-none transition-colors"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Comparison Label */}
                <div className="mt-8 p-4 bg-orange-50 rounded-xl border-2 border-[#ff6a1a]/20">
                  <div className="text-sm font-semibold text-gray-900 text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {config.comparisonLabel}
                  </div>
                </div>
              </div>

              {/* Right Column - Results */}
              <div className="p-8 lg:p-10 bg-gradient-to-br from-[#ff6a1a] to-[#e55f17]">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  <TrendingUp className="w-5 h-5" />
                  Your Results
                </h3>

                <div className="space-y-4">
                  <AnimatePresence mode="wait">
                    {config.outputs.map((output, index) => {
                      const Icon = getIconForColor(output.color)
                      const value = outputs[output.id] || 0

                      return (
                        <motion.div
                          key={output.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-xl p-5 shadow-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {output.label}
                              </div>
                              <motion.div
                                key={value}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.5 }}
                                className="text-2xl sm:text-3xl font-bold text-black"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                              >
                                {formatOutputValue(value, output.format)}
                              </motion.div>
                              {output.description && (
                                <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {output.description}
                                </div>
                              )}
                            </div>
                            <div className={`p-2 rounded-lg ${getColorClasses(output.color)}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                          </div>

                          {/* Progress bar for visual representation */}
                          {output.format === 'currency' && value > 0 && (
                            <div className="mt-3">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                  className="h-full bg-gradient-to-r from-[#ff6a1a] to-[#e55f17]"
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>

                {/* CTA Button */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8"
                >
                  <Link
                    href={`/contact?service=${serviceSlug}`}
                    className="w-full flex items-center justify-center gap-2 bg-white text-[#ff6a1a] px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl group"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    {config.ctaText}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>

                {/* Additional CTA */}
                <motion.div
                  variants={itemVariants}
                  className="mt-4 text-center"
                >
                  <a
                    href="mailto:Astartupbiz@gmail.com"
                    className="inline-flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    or email us for a custom quote
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: Clock, label: '24-48hr Turnaround' },
              { icon: CheckCircle2, label: '100% Satisfaction' },
              { icon: DollarSign, label: 'Money-Back Guarantee' },
              { icon: TrendingUp, label: 'Proven Results' }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 border border-gray-200 text-center"
              >
                <item.icon className="w-6 h-6 text-[#ff6a1a] mx-auto mb-2" />
                <div className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
