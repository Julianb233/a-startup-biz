'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  OnboardingWizard,
  StepContent,
  FormField,
  CheckboxGroup,
  RadioGroup,
} from '@/components/onboarding/onboarding-wizard';
import {
  type OnboardingData,
  industries,
  companySizes,
  revenueRanges,
  businessGoals,
  timelines,
  toolCategories,
  budgetRanges,
  services,
  priorityLevels,
  bestTimes,
  timezones,
  communicationPreferences,
  referralSources,
  brandStyles,
  businessCategories,
  validateStep,
  saveProgress,
  loadProgress,
  clearProgress,
} from '@/lib/onboarding-data';
import {
  Palette,
  Globe,
  Upload,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
} from 'lucide-react';

const STEPS = [
  {
    id: 1,
    title: 'Business Information',
    description: 'Tell us about your company',
  },
  {
    id: 2,
    title: 'Goals & Challenges',
    description: 'What are you looking to achieve?',
  },
  {
    id: 3,
    title: 'Current Situation',
    description: 'Help us understand where you are today',
  },
  {
    id: 4,
    title: 'Service Preferences',
    description: 'What services interest you most?',
  },
  {
    id: 5,
    title: 'Branding & Content',
    description: 'Share your brand identity and messaging',
  },
  {
    id: 6,
    title: 'Online Presence',
    description: 'Your digital footprint and social profiles',
  },
  {
    id: 7,
    title: 'Contact Preferences',
    description: 'How should we reach you?',
  },
];

export default function IntakePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<OnboardingData>>({
    // Step 1
    companyName: '',
    industry: undefined,
    companySize: undefined,
    revenueRange: undefined,
    yearsInBusiness: '',
    website: '',
    // Step 2
    businessGoals: [],
    primaryChallenge: '',
    timeline: undefined,
    // Step 3
    currentTools: [],
    teamSize: '',
    budgetRange: undefined,
    additionalContext: '',
    referralSource: undefined,
    referralCode: '',
    // Step 4
    servicesInterested: [],
    priorityLevel: undefined,
    specificNeeds: '',
    // Step 5 - Branding & Content
    brandStyle: undefined,
    primaryColor: '#ff6a1a',
    secondaryColor: '#1a1a2e',
    logoUrl: '',
    aboutBusiness: '',
    servicesDescription: '',
    uniqueValue: '',
    targetAudience: '',
    // Step 6 - Online Presence
    businessCategory: undefined,
    businessHours: '',
    businessDescription: '',
    socialFacebook: '',
    socialInstagram: '',
    socialLinkedin: '',
    socialTiktok: '',
    socialYoutube: '',
    socialTwitter: '',
    googleMapsUrl: '',
    // Step 7
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    bestTimeToCall: undefined,
    timezone: undefined,
    communicationPreference: undefined,
    additionalNotes: '',
  });

  // Load saved progress on mount
  useEffect(() => {
    const saved = loadProgress();
    if (saved) {
      setFormData((prev) => ({ ...prev, ...saved }));
    }
  }, []);

  // Auto-save on data change
  useEffect(() => {
    const timer = setTimeout(() => {
      saveProgress(formData);
    }, 1000);

    return () => clearTimeout(timer);
  }, [formData]);

  const updateField = <K extends keyof OnboardingData>(
    field: K,
    value: OnboardingData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    // Validate current step
    const isValid = validateStep(currentStep, formData);

    if (!isValid) {
      // Show validation errors
      setErrors({ general: 'Please fill in all required fields' });
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // Clear saved progress
        clearProgress();

        // Redirect to confirmation page with submission ID
        router.push(
          `/onboarding/confirmation?id=${result.submissionId}&company=${encodeURIComponent(formData.companyName || '')}`
        );
      } else {
        setErrors({ general: result.message || 'Submission failed' });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({
        general: 'An error occurred. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50/30 to-gray-50 py-12">
      <OnboardingWizard
        steps={STEPS}
        currentStep={currentStep}
        onStepChange={setCurrentStep}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isLastStep={currentStep === 7}
        isSubmitting={isSubmitting}
      >
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-sm text-red-600">{errors.general}</p>
          </motion.div>
        )}

        {/* Step 1: Business Information */}
        {currentStep === 1 && (
          <StepContent>
            <FormField label="Company Name" required>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter your company name"
              />
            </FormField>

            <FormField label="Industry" required>
              <RadioGroup
                options={industries}
                selected={formData.industry || ''}
                onChange={(value) =>
                  updateField('industry', value as (typeof industries)[number])
                }
                name="industry"
              />
            </FormField>

            <FormField label="Company Size" required>
              <RadioGroup
                options={companySizes}
                selected={formData.companySize || ''}
                onChange={(value) =>
                  updateField(
                    'companySize',
                    value as (typeof companySizes)[number]
                  )
                }
                name="companySize"
              />
            </FormField>

            <FormField label="Annual Revenue Range" required>
              <RadioGroup
                options={revenueRanges}
                selected={formData.revenueRange || ''}
                onChange={(value) =>
                  updateField(
                    'revenueRange',
                    value as (typeof revenueRanges)[number]
                  )
                }
                name="revenueRange"
              />
            </FormField>

            <FormField label="Years in Business" required>
              <input
                type="number"
                min="0"
                value={formData.yearsInBusiness}
                onChange={(e) =>
                  updateField('yearsInBusiness', e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="How many years have you been in business?"
              />
            </FormField>

            <FormField
              label="Website"
              description="Optional - helps us understand your current online presence"
            >
              <input
                type="url"
                value={formData.website}
                onChange={(e) => updateField('website', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://yourwebsite.com"
              />
            </FormField>
          </StepContent>
        )}

        {/* Step 2: Goals & Challenges */}
        {currentStep === 2 && (
          <StepContent>
            <FormField
              label="Business Goals"
              required
              description="Select up to 5 goals that align with your business objectives"
            >
              <CheckboxGroup
                options={businessGoals}
                selected={formData.businessGoals || []}
                onChange={(selected) => updateField('businessGoals', selected)}
                max={5}
              />
              {formData.businessGoals && formData.businessGoals.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  {formData.businessGoals.length} of 5 selected
                </p>
              )}
            </FormField>

            <FormField
              label="Primary Challenge"
              required
              description="Describe the main challenge you're facing that brought you to us"
            >
              <textarea
                value={formData.primaryChallenge}
                onChange={(e) =>
                  updateField('primaryChallenge', e.target.value)
                }
                rows={6}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Tell us about the specific challenge or pain point you need help with..."
              />
              <p className="text-xs text-gray-500 text-right">
                {formData.primaryChallenge?.length || 0} / 1000
              </p>
            </FormField>

            <FormField label="Timeline" required>
              <RadioGroup
                options={timelines}
                selected={formData.timeline || ''}
                onChange={(value) =>
                  updateField('timeline', value as (typeof timelines)[number])
                }
                name="timeline"
              />
            </FormField>
          </StepContent>
        )}

        {/* Step 3: Current Situation */}
        {currentStep === 3 && (
          <StepContent>
            <FormField
              label="Current Tools & Systems"
              description="Select all that apply - this helps us understand your tech stack"
            >
              <CheckboxGroup
                options={toolCategories}
                selected={formData.currentTools || []}
                onChange={(selected) => updateField('currentTools', selected)}
              />
            </FormField>

            <FormField label="Team Size" required>
              <input
                type="number"
                min="0"
                value={formData.teamSize}
                onChange={(e) => updateField('teamSize', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="How many people are on your team?"
              />
            </FormField>

            <FormField label="Budget Range" required>
              <RadioGroup
                options={budgetRanges}
                selected={formData.budgetRange || ''}
                onChange={(value) =>
                  updateField(
                    'budgetRange',
                    value as (typeof budgetRanges)[number]
                  )
                }
                name="budgetRange"
              />
            </FormField>

            <FormField
              label="How did you hear about us?"
              description="This helps us serve you better"
            >
              <RadioGroup
                options={referralSources}
                selected={formData.referralSource || ''}
                onChange={(value) =>
                  updateField(
                    'referralSource',
                    value as (typeof referralSources)[number]
                  )
                }
                name="referralSource"
              />
            </FormField>

            <FormField
              label="Referral Code"
              description="If someone referred you, enter their code here"
            >
              <input
                type="text"
                value={formData.referralCode}
                onChange={(e) => updateField('referralCode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter referral code (optional)"
              />
            </FormField>

            <FormField
              label="Additional Context"
              description="Any other information that would help us serve you better?"
            >
              <textarea
                value={formData.additionalContext}
                onChange={(e) =>
                  updateField('additionalContext', e.target.value)
                }
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Share any additional details about your situation..."
              />
            </FormField>
          </StepContent>
        )}

        {/* Step 4: Service Preferences */}
        {currentStep === 4 && (
          <StepContent>
            <FormField
              label="Services You're Interested In"
              required
              description="Select all services that interest you"
            >
              <CheckboxGroup
                options={services}
                selected={formData.servicesInterested || []}
                onChange={(selected) =>
                  updateField('servicesInterested', selected)
                }
              />
            </FormField>

            <FormField label="Priority Level" required>
              <RadioGroup
                options={priorityLevels}
                selected={formData.priorityLevel || ''}
                onChange={(value) =>
                  updateField(
                    'priorityLevel',
                    value as (typeof priorityLevels)[number]
                  )
                }
                name="priorityLevel"
              />
            </FormField>

            <FormField
              label="Specific Needs or Requirements"
              description="Any specific features, integrations, or requirements for your project?"
            >
              <textarea
                value={formData.specificNeeds}
                onChange={(e) => updateField('specificNeeds', e.target.value)}
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Describe any specific requirements..."
              />
            </FormField>
          </StepContent>
        )}

        {/* Step 5: Branding & Content */}
        {currentStep === 5 && (
          <StepContent>
            <div className="flex items-center gap-3 mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Palette className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Brand Information</h3>
                <p className="text-sm text-gray-600">
                  This information helps us create assets that match your brand identity
                </p>
              </div>
            </div>

            <FormField
              label="Brand Style"
              description="What best describes your brand personality?"
            >
              <RadioGroup
                options={brandStyles}
                selected={formData.brandStyle || ''}
                onChange={(value) =>
                  updateField('brandStyle', value as (typeof brandStyles)[number])
                }
                name="brandStyle"
              />
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Primary Brand Color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.primaryColor || '#ff6a1a'}
                    onChange={(e) => updateField('primaryColor', e.target.value)}
                    className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.primaryColor || '#ff6a1a'}
                    onChange={(e) => updateField('primaryColor', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="#ff6a1a"
                  />
                </div>
              </FormField>

              <FormField label="Secondary Brand Color">
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.secondaryColor || '#1a1a2e'}
                    onChange={(e) => updateField('secondaryColor', e.target.value)}
                    className="w-16 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.secondaryColor || '#1a1a2e'}
                    onChange={(e) => updateField('secondaryColor', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="#1a1a2e"
                  />
                </div>
              </FormField>
            </div>

            <FormField
              label="Logo"
              description="Upload your logo or provide a URL to it"
            >
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => updateField('logoUrl', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://example.com/your-logo.png"
                  />
                </div>
                <div className="flex items-center justify-center w-16 h-12 bg-gray-100 rounded-lg border border-dashed border-gray-300 cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Tip: Use Dropbox, Google Drive, or any image hosting service to get a URL
              </p>
            </FormField>

            <FormField
              label="About Your Business"
              description="This will be used for website content, marketing materials, and AI-generated content"
            >
              <textarea
                value={formData.aboutBusiness}
                onChange={(e) => updateField('aboutBusiness', e.target.value)}
                rows={5}
                maxLength={2000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Tell us about your business story, mission, and what makes you unique..."
              />
              <p className="text-xs text-gray-500 text-right">
                {formData.aboutBusiness?.length || 0} / 2000
              </p>
            </FormField>

            <FormField
              label="Services/Products Description"
              description="Describe the main services or products you offer"
            >
              <textarea
                value={formData.servicesDescription}
                onChange={(e) => updateField('servicesDescription', e.target.value)}
                rows={4}
                maxLength={2000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="List and describe your main offerings..."
              />
            </FormField>

            <FormField
              label="Unique Value Proposition"
              description="What sets you apart from competitors?"
            >
              <textarea
                value={formData.uniqueValue}
                onChange={(e) => updateField('uniqueValue', e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="What makes your business unique?"
              />
            </FormField>

            <FormField
              label="Target Audience"
              description="Who are your ideal customers?"
            >
              <textarea
                value={formData.targetAudience}
                onChange={(e) => updateField('targetAudience', e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Describe your ideal customer profile..."
              />
            </FormField>
          </StepContent>
        )}

        {/* Step 6: Online Presence */}
        {currentStep === 6 && (
          <StepContent>
            <div className="flex items-center gap-3 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <Globe className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">Online Presence</h3>
                <p className="text-sm text-gray-600">
                  Help us understand your digital footprint for SEO and marketing
                </p>
              </div>
            </div>

            <FormField
              label="Business Category"
              description="For Google My Business and local SEO"
            >
              <RadioGroup
                options={businessCategories}
                selected={formData.businessCategory || ''}
                onChange={(value) =>
                  updateField('businessCategory', value as (typeof businessCategories)[number])
                }
                name="businessCategory"
              />
            </FormField>

            <FormField
              label="Business Hours"
              description="When are you typically open?"
            >
              <input
                type="text"
                value={formData.businessHours}
                onChange={(e) => updateField('businessHours', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Mon-Fri 9am-6pm, Sat 10am-4pm"
              />
            </FormField>

            <FormField
              label="Short Business Description"
              description="A brief description for Google My Business (max 750 characters)"
            >
              <textarea
                value={formData.businessDescription}
                onChange={(e) => updateField('businessDescription', e.target.value)}
                rows={3}
                maxLength={750}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Brief description for search engines and Google My Business..."
              />
              <p className="text-xs text-gray-500 text-right">
                {formData.businessDescription?.length || 0} / 750
              </p>
            </FormField>

            <FormField
              label="Google Maps URL"
              description="Link to your Google Maps listing if you have one"
            >
              <input
                type="url"
                value={formData.googleMapsUrl}
                onChange={(e) => updateField('googleMapsUrl', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="https://maps.google.com/..."
              />
            </FormField>

            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Profiles</h3>
              <p className="text-sm text-gray-600 mb-6">
                Enter your social media profile URLs (leave blank if not applicable)
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Facebook className="w-5 h-5 text-blue-600" />
                  </div>
                  <input
                    type="url"
                    value={formData.socialFacebook}
                    onChange={(e) => updateField('socialFacebook', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://facebook.com/yourbusiness"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                    <Instagram className="w-5 h-5 text-pink-600" />
                  </div>
                  <input
                    type="url"
                    value={formData.socialInstagram}
                    onChange={(e) => updateField('socialInstagram', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://instagram.com/yourbusiness"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-blue-700" />
                  </div>
                  <input
                    type="url"
                    value={formData.socialLinkedin}
                    onChange={(e) => updateField('socialLinkedin', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://linkedin.com/company/yourbusiness"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Twitter className="w-5 h-5 text-gray-800" />
                  </div>
                  <input
                    type="url"
                    value={formData.socialTwitter}
                    onChange={(e) => updateField('socialTwitter', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://x.com/yourbusiness"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Youtube className="w-5 h-5 text-red-600" />
                  </div>
                  <input
                    type="url"
                    value={formData.socialYoutube}
                    onChange={(e) => updateField('socialYoutube', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://youtube.com/@yourbusiness"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">TT</span>
                  </div>
                  <input
                    type="url"
                    value={formData.socialTiktok}
                    onChange={(e) => updateField('socialTiktok', e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="https://tiktok.com/@yourbusiness"
                  />
                </div>
              </div>
            </div>
          </StepContent>
        )}

        {/* Step 7: Contact Preferences */}
        {currentStep === 7 && (
          <StepContent>
            <FormField label="Contact Name" required>
              <input
                type="text"
                value={formData.contactName}
                onChange={(e) => updateField('contactName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </FormField>

            <FormField label="Email Address" required>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => updateField('contactEmail', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="your.email@company.com"
              />
            </FormField>

            <FormField label="Phone Number" required>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => updateField('contactPhone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="(555) 123-4567"
              />
            </FormField>

            <FormField label="Best Time to Call" required>
              <RadioGroup
                options={bestTimes}
                selected={formData.bestTimeToCall || ''}
                onChange={(value) =>
                  updateField(
                    'bestTimeToCall',
                    value as (typeof bestTimes)[number]
                  )
                }
                name="bestTimeToCall"
              />
            </FormField>

            <FormField label="Timezone" required>
              <RadioGroup
                options={timezones}
                selected={formData.timezone || ''}
                onChange={(value) =>
                  updateField('timezone', value as (typeof timezones)[number])
                }
                name="timezone"
              />
            </FormField>

            <FormField label="Preferred Communication Method" required>
              <RadioGroup
                options={communicationPreferences}
                selected={formData.communicationPreference || ''}
                onChange={(value) =>
                  updateField(
                    'communicationPreference',
                    value as (typeof communicationPreferences)[number]
                  )
                }
                name="communicationPreference"
              />
            </FormField>

            <FormField label="Additional Notes">
              <textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  updateField('additionalNotes', e.target.value)
                }
                rows={4}
                maxLength={1000}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                placeholder="Anything else you'd like us to know?"
              />
            </FormField>
          </StepContent>
        )}
      </OnboardingWizard>
    </div>
  );
}
