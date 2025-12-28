'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Lock,
  Check,
  AlertCircle,
  Info,
  Zap,
  Shield,
  Clock,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year' | 'one-time';
  popular?: boolean;
  features: string[];
  description: string;
  savings?: string;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter Package',
    price: 2999,
    interval: 'one-time',
    description: 'Perfect for new businesses getting started',
    features: [
      'Website Consultation',
      'Basic SEO Setup',
      'Business Analysis',
      '30-day Support',
      'Email Support',
    ],
  },
  {
    id: 'growth',
    name: 'Growth Package',
    price: 5999,
    interval: 'one-time',
    popular: true,
    description: 'Most popular for scaling businesses',
    features: [
      'Everything in Starter',
      'Custom Website Development',
      'CRM Integration',
      'Advanced SEO',
      '90-day Priority Support',
      'Marketing Strategy',
      'Social Media Setup',
    ],
    savings: 'Save $1,500',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Package',
    price: 9999,
    interval: 'one-time',
    description: 'Complete solution for established businesses',
    features: [
      'Everything in Growth',
      'Custom AI Automation',
      'Mobile App Development',
      'Advanced Analytics',
      'Dedicated Account Manager',
      '6-month Premium Support',
      'Custom Integrations',
      'Training & Documentation',
    ],
    savings: 'Save $3,000',
  },
];

interface PaymentStepProps {
  selectedPlan: string | null;
  onPlanSelect: (planId: string) => void;
  onPaymentMethodChange: (method: 'full' | 'deposit') => void;
  paymentMethod: 'full' | 'deposit';
}

export function PaymentStep({
  selectedPlan,
  onPlanSelect,
  onPaymentMethodChange,
  paymentMethod,
}: PaymentStepProps) {
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  const selectedPlanDetails = PRICING_PLANS.find(p => p.id === selectedPlan);
  const depositAmount = selectedPlanDetails ? selectedPlanDetails.price * 0.3 : 0;

  return (
    <div className="space-y-8">
      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Lock className="w-4 h-4 text-blue-600" />
          <span className="font-medium">SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Money-Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="font-medium">Fast Setup</span>
        </div>
      </div>

      {/* Pricing Plans */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Select Your Package
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <motion.button
                key={plan.id}
                onClick={() => onPlanSelect(plan.id)}
                className={cn(
                  'relative p-6 rounded-2xl border-2 text-left transition-all',
                  'hover:shadow-xl hover:scale-105',
                  isSelected
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800',
                  plan.popular && 'ring-2 ring-orange-500 ring-offset-2'
                )}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full shadow-lg">
                      <Zap className="w-3 h-3" />
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {plan.savings && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                    {plan.savings}
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {plan.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${(plan.price / 100).toLocaleString()}
                    </span>
                    {plan.interval !== 'one-time' && (
                      <span className="text-gray-600 dark:text-gray-400">
                        /{plan.interval}
                      </span>
                    )}
                  </div>
                  {plan.interval === 'one-time' && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      One-time investment
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className={cn(
                  'text-center py-2 px-4 rounded-lg font-medium transition-colors',
                  isSelected
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                )}>
                  {isSelected ? 'Selected' : 'Select Plan'}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Payment Method Selection */}
      {selectedPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Payment Options
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                onPaymentMethodChange('full');
                setShowPaymentInfo(true);
              }}
              className={cn(
                'p-6 rounded-xl border-2 text-left transition-all',
                'hover:shadow-lg',
                paymentMethod === 'full'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <CreditCard className="w-6 h-6 text-orange-500" />
                {paymentMethod === 'full' && (
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                Pay in Full
              </h4>
              <p className="text-2xl font-bold text-orange-500 mb-2">
                ${selectedPlanDetails ? (selectedPlanDetails.price / 100).toLocaleString() : 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                One-time payment. Start immediately with full access to all features.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Best value - Save 5%</span>
              </div>
            </button>

            <button
              onClick={() => {
                onPaymentMethodChange('deposit');
                setShowPaymentInfo(true);
              }}
              className={cn(
                'p-6 rounded-xl border-2 text-left transition-all',
                'hover:shadow-lg',
                paymentMethod === 'deposit'
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <Clock className="w-6 h-6 text-orange-500" />
                {paymentMethod === 'deposit' && (
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                30% Deposit
              </h4>
              <p className="text-2xl font-bold text-orange-500 mb-2">
                ${depositAmount ? (depositAmount / 100).toLocaleString() : 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pay 30% now, remaining balance due before project delivery.
              </p>
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Remaining: ${selectedPlanDetails ? ((selectedPlanDetails.price - depositAmount) / 100).toLocaleString() : 0}
              </div>
            </button>
          </div>

          {/* Payment Info Notice */}
          {showPaymentInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
            >
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-medium mb-1">Next Step</p>
                <p>
                  After submitting this form, you'll receive an email with a secure payment link
                  and invoice. No payment is required to continue with the form.
                </p>
              </div>
            </motion.div>
          )}

          {/* Money-Back Guarantee */}
          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-medium mb-1">30-Day Money-Back Guarantee</p>
              <p>
                If you're not completely satisfied with our service within 30 days,
                we'll provide a full refund—no questions asked.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Warning if no plan selected */}
      {!selectedPlan && (
        <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-sm text-gray-700 dark:text-gray-300">
            <p className="font-medium">Please select a package to continue</p>
          </div>
        </div>
      )}
    </div>
  );
}
