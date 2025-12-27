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
  validateStep,
  saveProgress,
  loadProgress,
  clearProgress,
} from '@/lib/onboarding-data';

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
    companyName: '',
    industry: undefined,
    companySize: undefined,
    revenueRange: undefined,
    yearsInBusiness: '',
    website: '',
    businessGoals: [],
    primaryChallenge: '',
    timeline: undefined,
    currentTools: [],
    teamSize: '',
    budgetRange: undefined,
    additionalContext: '',
    servicesInterested: [],
    priorityLevel: undefined,
    specificNeeds: '',
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
      setFormData(saved);
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
        isLastStep={currentStep === 5}
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

        {currentStep === 5 && (
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
