import { z } from 'zod';

// Industry Options
export const industries = [
  'Adventure & Outdoor Recreation',
  'Climbing & Mountaineering',
  'Fitness & Wellness',
  'Sports & Recreation',
  'Equipment Rental',
  'Tourism & Travel',
  'Health & Safety',
  'Technology',
  'Retail',
  'Professional Services',
  'Education & Training',
  'Other',
] as const;

// Revenue Ranges
export const revenueRanges = [
  'Pre-revenue',
  'Under $100k',
  '$100k - $500k',
  '$500k - $1M',
  '$1M - $5M',
  '$5M - $10M',
  '$10M+',
  'Prefer not to say',
] as const;

// Company Size Options
export const companySizes = [
  'Solo founder',
  '2-5 employees',
  '6-10 employees',
  '11-25 employees',
  '26-50 employees',
  '51-100 employees',
  '100+ employees',
] as const;

// Business Goals
export const businessGoals = [
  'Increase online visibility',
  'Generate more leads',
  'Improve conversion rates',
  'Automate business processes',
  'Enhance customer experience',
  'Build brand awareness',
  'Launch new products/services',
  'Scale operations',
  'Reduce operational costs',
  'Improve team efficiency',
  'Enter new markets',
  'Modernize technology stack',
] as const;

// Timeline Options
export const timelines = [
  'Immediate (1-2 weeks)',
  'Short-term (1-3 months)',
  'Medium-term (3-6 months)',
  'Long-term (6+ months)',
  'Flexible',
] as const;

// Current Tools Categories
export const toolCategories = [
  'CRM (Customer Relationship Management)',
  'Project Management',
  'Email Marketing',
  'Analytics & Tracking',
  'Accounting & Finance',
  'Customer Support',
  'E-commerce Platform',
  'Booking & Scheduling',
  'Inventory Management',
  'Marketing Automation',
  'Social Media Management',
  'Website Builder',
  'None currently',
] as const;

// Budget Ranges
export const budgetRanges = [
  'Under $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  '$100,000+',
  'Not sure yet',
] as const;

// Services
export const services = [
  'AI Automation & Integration',
  'Custom Software Development',
  'Web Design & Development',
  'Mobile App Development',
  'Marketing & SEO',
  'Business Consulting',
  'CRM Implementation',
  'E-commerce Solutions',
  'Cloud Infrastructure',
  'Data Analytics',
  'Training & Support',
  'Ongoing Maintenance',
] as const;

// Priority Levels
export const priorityLevels = [
  'Critical - Need ASAP',
  'High - Important',
  'Medium - Helpful',
  'Low - Nice to have',
] as const;

// Communication Preferences
export const communicationPreferences = [
  'Email',
  'Phone',
  'Video Call',
  'Text/SMS',
  'In-person meeting',
  'Slack/Teams',
] as const;

// Best Times to Call
export const bestTimes = [
  'Morning (8am-12pm)',
  'Afternoon (12pm-5pm)',
  'Evening (5pm-8pm)',
  'Weekends',
  'Anytime',
] as const;

// Timezones
export const timezones = [
  'Eastern (ET)',
  'Central (CT)',
  'Mountain (MT)',
  'Pacific (PT)',
  'Alaska (AKT)',
  'Hawaii (HST)',
  'Other',
] as const;

// Zod Schema for Validation
export const onboardingSchema = z.object({
  // Step 1: Business Information
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  industry: z.enum(industries, {
    required_error: 'Please select an industry',
  }),
  companySize: z.enum(companySizes, {
    required_error: 'Please select company size',
  }),
  revenueRange: z.enum(revenueRanges, {
    required_error: 'Please select revenue range',
  }),
  yearsInBusiness: z.string().min(1, 'Please provide years in business'),
  website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),

  // Step 2: Goals & Challenges
  businessGoals: z
    .array(z.string())
    .min(1, 'Please select at least one goal')
    .max(5, 'Please select up to 5 goals'),
  primaryChallenge: z
    .string()
    .min(10, 'Please describe your primary challenge (min 10 characters)')
    .max(1000, 'Please keep description under 1000 characters'),
  timeline: z.enum(timelines, {
    required_error: 'Please select a timeline',
  }),

  // Step 3: Current Situation
  currentTools: z.array(z.string()),
  teamSize: z.string().min(1, 'Please provide team size'),
  budgetRange: z.enum(budgetRanges, {
    required_error: 'Please select budget range',
  }),
  additionalContext: z.string().max(1000).optional(),

  // Step 4: Service Preferences
  servicesInterested: z
    .array(z.string())
    .min(1, 'Please select at least one service'),
  priorityLevel: z.enum(priorityLevels, {
    required_error: 'Please select priority level',
  }),
  specificNeeds: z.string().max(1000).optional(),

  // Step 5: Contact Preferences
  contactName: z.string().min(2, 'Please provide contact name'),
  contactEmail: z.string().email('Please provide valid email'),
  contactPhone: z.string().min(10, 'Please provide valid phone number'),
  bestTimeToCall: z.enum(bestTimes, {
    required_error: 'Please select best time to call',
  }),
  timezone: z.enum(timezones, {
    required_error: 'Please select timezone',
  }),
  communicationPreference: z.enum(communicationPreferences, {
    required_error: 'Please select communication preference',
  }),
  additionalNotes: z.string().max(1000).optional(),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;

// Helper function to validate a single step
export function validateStep(step: number, data: Partial<OnboardingData>): boolean {
  try {
    switch (step) {
      case 1:
        z.object({
          companyName: z.string().min(2),
          industry: z.enum(industries),
          companySize: z.enum(companySizes),
          revenueRange: z.enum(revenueRanges),
          yearsInBusiness: z.string().min(1),
        }).parse(data);
        return true;
      case 2:
        z.object({
          businessGoals: z.array(z.string()).min(1).max(5),
          primaryChallenge: z.string().min(10).max(1000),
          timeline: z.enum(timelines),
        }).parse(data);
        return true;
      case 3:
        z.object({
          currentTools: z.array(z.string()),
          teamSize: z.string().min(1),
          budgetRange: z.enum(budgetRanges),
        }).parse(data);
        return true;
      case 4:
        z.object({
          servicesInterested: z.array(z.string()).min(1),
          priorityLevel: z.enum(priorityLevels),
        }).parse(data);
        return true;
      case 5:
        z.object({
          contactName: z.string().min(2),
          contactEmail: z.string().email(),
          contactPhone: z.string().min(10),
          bestTimeToCall: z.enum(bestTimes),
          timezone: z.enum(timezones),
          communicationPreference: z.enum(communicationPreferences),
        }).parse(data);
        return true;
      default:
        return false;
    }
  } catch {
    return false;
  }
}

// Helper function to get step completion percentage
export function getStepCompletionPercentage(data: Partial<OnboardingData>): number {
  const totalFields = Object.keys(onboardingSchema.shape).length;
  const completedFields = Object.keys(data).filter((key) => {
    const value = data[key as keyof OnboardingData];
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== '';
  }).length;

  return Math.round((completedFields / totalFields) * 100);
}

// Helper to save progress to localStorage
export function saveProgress(data: Partial<OnboardingData>): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('onboarding-progress', JSON.stringify(data));
    localStorage.setItem('onboarding-timestamp', new Date().toISOString());
  }
}

// Helper to load progress from localStorage
export function loadProgress(): Partial<OnboardingData> | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('onboarding-progress');
    const timestamp = localStorage.getItem('onboarding-timestamp');

    if (saved && timestamp) {
      const savedDate = new Date(timestamp);
      const now = new Date();
      const hoursDiff = (now.getTime() - savedDate.getTime()) / (1000 * 60 * 60);

      // Only restore if saved within last 24 hours
      if (hoursDiff < 24) {
        return JSON.parse(saved);
      }
    }
  }
  return null;
}

// Helper to clear saved progress
export function clearProgress(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('onboarding-progress');
    localStorage.removeItem('onboarding-timestamp');
  }
}
