// Category data configuration for organizing industry verticals
// 4 main categories: Fitness/Gyms, Activity-Based, Aesthetic Wellness, Race Events

export interface IndustryCategory {
  id: string
  slug: string
  title: string
  shortTitle: string
  description: string
  longDescription: string
  heroImage: string
  icon: string
  productType: 'single-use' | 'monthly' | 'both'
  sectors: string[]
  color: 'teal' | 'sky' | 'purple' | 'orange'
  stats: {
    label: string
    value: string
  }[]
}

export const industryCategories: IndustryCategory[] = [
  {
    id: 'fitness-gyms',
    slug: 'fitness-gyms',
    title: 'Fitness & Gyms',
    shortTitle: 'Fitness',
    description: 'Coverage for gyms, fitness centers, and climbing facilities',
    longDescription: 'Whether your members visit daily or drop in occasionally, protect them with flexible coverage options. Offer single-use day passes or ActiveGuard monthly protection for regular members.',
    heroImage: '/images/categories/fitness-gyms-hero.jpg',
    icon: 'Dumbbell',
    productType: 'both',
    sectors: ['gyms-fitness', 'rock-climbing'],
    color: 'teal',
    stats: [
      { label: 'Avg Monthly Revenue', value: '$2,800+' },
      { label: 'Member Opt-in Rate', value: '65%' },
      { label: 'Setup Time', value: '48 hours' }
    ]
  },
  {
    id: 'activity-based',
    slug: 'activity-based',
    title: 'Activity-Based Adventures',
    shortTitle: 'Activities',
    description: 'Protection for ski resorts, bike rentals, water sports, and aerial adventures',
    longDescription: 'From mountain slopes to ocean waves, protect participants during high-adrenaline activities. Single-use coverage activates when the adventure starts and ends when they return safely.',
    heroImage: '/images/categories/activity-based-hero.jpg',
    icon: 'Mountain',
    productType: 'single-use',
    sectors: ['ski-resorts', 'equipment-rentals', 'water-sports', 'skydiving'],
    color: 'sky',
    stats: [
      { label: 'Avg Monthly Revenue', value: '$8,500+' },
      { label: 'Participant Opt-in Rate', value: '72%' },
      { label: 'Setup Time', value: '24 hours' }
    ]
  },
  {
    id: 'aesthetic-wellness',
    slug: 'aesthetic-wellness',
    title: 'Aesthetic Wellness & Longevity',
    shortTitle: 'Wellness',
    description: 'Coverage for medispas, cold plunge, cryotherapy, and recovery centers',
    longDescription: 'Modern wellness experiences deserve modern protection. From cold plunge sessions to IV therapy, offer your members peace of mind with flexible single-use or monthly ActiveGuard coverage.',
    heroImage: '/images/categories/aesthetic-wellness-hero.jpg',
    icon: 'Sparkles',
    productType: 'both',
    sectors: ['medispas', 'wellness-recovery'],
    color: 'purple',
    stats: [
      { label: 'Avg Monthly Revenue', value: '$3,200+' },
      { label: 'Member Opt-in Rate', value: '58%' },
      { label: 'Setup Time', value: '48 hours' }
    ]
  },
  {
    id: 'race-events',
    slug: 'race-events',
    title: 'Race Events',
    shortTitle: 'Races',
    description: 'Event-based coverage for running, cycling, triathlons, and competitive events',
    longDescription: 'Races are events, not locations. Protect every participant from registration to finish line with coverage that activates on race day and ends when they cross the line.',
    heroImage: '/images/categories/race-events-hero.jpg',
    icon: 'Trophy',
    productType: 'single-use',
    sectors: [
      'race-directors',
      'cycling-events',
      'triathlons',
      'obstacle-courses',
      'marathons',
      'corporate-wellness',
      'schools-universities'
    ],
    color: 'orange',
    stats: [
      { label: 'Avg Revenue Per Event', value: '$1,200+' },
      { label: 'Participant Opt-in Rate', value: '45%' },
      { label: 'Setup Time', value: '5 minutes' }
    ]
  }
]

// Helper function to get category by ID
export function getCategoryById(id: string): IndustryCategory | undefined {
  return industryCategories.find(cat => cat.id === id)
}

// Helper function to get category by slug
export function getCategoryBySlug(slug: string): IndustryCategory | undefined {
  return industryCategories.find(cat => cat.slug === slug)
}

// Helper function to get category for a sector
export function getCategoryForSector(sectorSlug: string): IndustryCategory | undefined {
  return industryCategories.find(cat => cat.sectors.includes(sectorSlug))
}

// Get all categories that support ActiveGuard (monthly)
export function getActiveGuardCategories(): IndustryCategory[] {
  return industryCategories.filter(cat => cat.productType === 'both' || cat.productType === 'monthly')
}

// Get all categories for single-use
export function getSingleUseCategories(): IndustryCategory[] {
  return industryCategories.filter(cat => cat.productType === 'both' || cat.productType === 'single-use')
}
