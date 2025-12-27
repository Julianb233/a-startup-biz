// ActiveGuard Monthly Product Configuration
// Two tiers: Standard ($40/month) and Premium ($100/month)

export interface ActiveGuardTier {
  id: string
  name: string
  price: number
  priceDisplay: string
  coverage: string
  coverageAmount: number
  features: string[]
  bestFor: string[]
  highlighted: boolean
  badge?: string
}

export interface ActiveGuardProduct {
  id: string
  name: string
  tagline: string
  description: string
  tiers: ActiveGuardTier[]
  eligibleCategories: string[]
  comparisonPoints: {
    singleUse: {
      title: string
      description: string
      benefits: string[]
      bestFor: string
      icon: string
    }
    monthly: {
      title: string
      description: string
      benefits: string[]
      bestFor: string
      icon: string
    }
  }
}

export const activeGuardProduct: ActiveGuardProduct = {
  id: 'activeguard',
  name: 'ActiveGuard Monthly',
  tagline: 'Monthly Protection for Monthly Members',
  description: 'For facilities with monthly memberships, ActiveGuard provides continuous coverage that matches how your members actually use your facility. One flat rate, unlimited visits protected.',
  tiers: [
    {
      id: 'standard',
      name: 'Standard',
      price: 40,
      priceDisplay: '$40',
      coverage: '$25,000 medical coverage',
      coverageAmount: 25000,
      features: [
        'Unlimited facility visits covered',
        'Group fitness class protection',
        'Equipment usage coverage',
        'Emergency medical expenses',
        'Accident medical coverage',
        '24/7 claims support',
        'Digital proof of coverage'
      ],
      bestFor: [
        'Regular gym members',
        'Standard fitness routines',
        'Group class participants',
        'Casual facility users'
      ],
      highlighted: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 100,
      priceDisplay: '$100',
      coverage: '$100,000 medical coverage',
      coverageAmount: 100000,
      features: [
        'Everything in Standard, plus:',
        'Personal training sessions covered',
        'Specialty class coverage (climbing, aerial, etc.)',
        'High-intensity activity protection',
        'Equipment damage protection',
        'Lost income protection (up to $500/week)',
        'Family member add-on option',
        'Priority claims processing',
        'Concierge support line'
      ],
      bestFor: [
        'Power users and daily visitors',
        'Personal training clients',
        'Climbing and specialty class members',
        'Athletes and serious fitness enthusiasts'
      ],
      highlighted: true,
      badge: 'Most Popular'
    }
  ],
  eligibleCategories: ['fitness-gyms', 'aesthetic-wellness'],
  comparisonPoints: {
    singleUse: {
      title: 'Single-Use Coverage',
      description: 'Pay per visit or event. Perfect for drop-ins, day passes, and one-time experiences.',
      benefits: [
        'Pay only when you visit',
        'Perfect for drop-ins and day passes',
        'Coverage for specific activities',
        'Ideal for race events and one-time experiences',
        'No monthly commitment'
      ],
      bestFor: 'Occasional visitors, drop-ins, and event participants',
      icon: 'Calendar'
    },
    monthly: {
      title: 'ActiveGuard Monthly',
      description: 'Flat monthly rate for unlimited visits. Perfect for regular members with monthly memberships.',
      benefits: [
        'One flat monthly rate',
        'Unlimited facility visits covered',
        'Seamless integration with membership billing',
        'No per-visit decisions needed',
        'Continuous protection all month'
      ],
      bestFor: 'Regular members with monthly or annual memberships',
      icon: 'CreditCard'
    }
  }
}

// Commission structure for ActiveGuard
export interface ActiveGuardCommission {
  tierId: string
  partnerCommission: number
  partnerCommissionDisplay: string
  estimatedMonthlyRevenue: {
    members50: number
    members100: number
    members250: number
    members500: number
  }
}

export const activeGuardCommissions: ActiveGuardCommission[] = [
  {
    tierId: 'standard',
    partnerCommission: 10, // $10 per member per month
    partnerCommissionDisplay: '$10/member/month',
    estimatedMonthlyRevenue: {
      members50: 500,
      members100: 1000,
      members250: 2500,
      members500: 5000
    }
  },
  {
    tierId: 'premium',
    partnerCommission: 25, // $25 per member per month
    partnerCommissionDisplay: '$25/member/month',
    estimatedMonthlyRevenue: {
      members50: 1250,
      members100: 2500,
      members250: 6250,
      members500: 12500
    }
  }
]

// Helper functions
export function getActiveGuardTier(tierId: string): ActiveGuardTier | undefined {
  return activeGuardProduct.tiers.find(tier => tier.id === tierId)
}

export function getCommissionForTier(tierId: string): ActiveGuardCommission | undefined {
  return activeGuardCommissions.find(c => c.tierId === tierId)
}

export function isActiveGuardEligible(categoryId: string): boolean {
  return activeGuardProduct.eligibleCategories.includes(categoryId)
}
