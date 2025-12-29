'use client'

import { motion } from 'framer-motion'
import { Check, Sparkles, FileText, CreditCard, Rocket } from 'lucide-react'

export interface OnboardingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'completed' | 'current' | 'upcoming'
}

interface OnboardingProgressProps {
  currentStep: number
  steps?: OnboardingStep[]
}

const defaultSteps: Omit<OnboardingStep, 'status'>[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    description: 'Get started with your partnership',
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    id: 'agreements',
    title: 'Agreements',
    description: 'Review and sign partner documents',
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 'payment',
    title: 'Payment Setup',
    description: 'Set up how you get paid',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'complete',
    title: 'Ready to Go',
    description: 'Start earning commissions',
    icon: <Rocket className="h-5 w-5" />,
  },
]

export function OnboardingProgress({ currentStep, steps }: OnboardingProgressProps) {
  const displaySteps = steps || defaultSteps.map((step, index) => ({
    ...step,
    status: index < currentStep ? 'completed' as const : index === currentStep ? 'current' as const : 'upcoming' as const,
  }))

  return (
    <div className="w-full">
      {/* Desktop Progress */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200">
            <motion.div
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (displaySteps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {displaySteps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center" style={{ width: `${100 / displaySteps.length}%` }}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                    ${step.status === 'completed'
                      ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : step.status === 'current'
                        ? 'bg-white border-orange-500 text-orange-500 shadow-lg shadow-orange-500/20 ring-4 ring-orange-100'
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    }
                  `}
                >
                  {step.status === 'completed' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    step.icon
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="mt-4 text-center"
                >
                  <p className={`text-sm font-semibold ${
                    step.status === 'current' ? 'text-orange-600' :
                    step.status === 'completed' ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-xs mt-1 max-w-[120px] mx-auto ${
                    step.status === 'current' ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.description}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep + 1} of {displaySteps.length}
          </span>
          <span className="text-sm font-semibold text-orange-600">
            {displaySteps[currentStep]?.title}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / displaySteps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {displaySteps.map((step, index) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full ${
                index <= currentStep ? 'bg-orange-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
