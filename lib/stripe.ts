import Stripe from 'stripe'

// Allow placeholder during build, but require real key at runtime
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

// Only throw if key is completely missing and we're not in build
if (!stripeSecretKey && typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  console.warn('STRIPE_SECRET_KEY is not set - Stripe functionality will not work')
}

export const stripe = new Stripe(stripeSecretKey || 'sk_test_placeholder', {
  apiVersion: '2025-12-15.clover',
  typescript: true,
})

// Helper to format price for Stripe (converts dollars to cents)
export function formatAmountForStripe(amount: number): number {
  return Math.round(amount * 100)
}

// Helper to format amount from Stripe (converts cents to dollars)
export function formatAmountFromStripe(amount: number): number {
  return amount / 100
}
