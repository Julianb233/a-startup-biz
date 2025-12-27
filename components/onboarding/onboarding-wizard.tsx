'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface OnboardingWizardProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
  children: React.ReactNode;
  onNext?: () => boolean; // Return false to prevent navigation
  onBack?: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
}

export function OnboardingWizard({
  steps,
  currentStep,
  onStepChange,
  children,
  onNext,
  onBack,
  onSubmit,
  isLastStep = false,
  isSubmitting = false,
}: OnboardingWizardProps) {
  const [direction, setDirection] = useState(1);

  const handleNext = () => {
    if (onNext && !onNext()) {
      return; // Validation failed
    }

    if (isLastStep) {
      onSubmit?.();
    } else {
      setDirection(1);
      onStepChange(currentStep + 1);
    }
  };

  const handleBack = () => {
    onBack?.();
    setDirection(-1);
    onStepChange(currentStep - 1);
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setDirection(stepId < currentStep ? -1 : 1);
      onStepChange(stepId);
    }
  };

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-orange-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        <div className="flex justify-between mt-4">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const isClickable = step.id < currentStep;

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center gap-2 flex-1 group',
                  isClickable && 'cursor-pointer hover:opacity-80',
                  !isClickable && 'cursor-default'
                )}
              >
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    isCompleted &&
                      'bg-orange-500 border-orange-500 text-white',
                    isActive &&
                      !isCompleted &&
                      'border-orange-500 bg-white text-orange-500',
                    !isActive &&
                      !isCompleted &&
                      'border-gray-300 bg-white text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="text-center hidden sm:block">
                  <p
                    className={cn(
                      'text-xs font-medium transition-colors',
                      isActive && 'text-orange-500',
                      isCompleted && 'text-gray-700',
                      !isActive && !isCompleted && 'text-gray-400'
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Step Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {steps[currentStep - 1]?.title}
        </h2>
        <p className="text-gray-600">
          {steps[currentStep - 1]?.description}
        </p>
      </div>

      {/* Step Content with Animation */}
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-500'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className={cn(
            'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
            'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
            'hover:from-orange-600 hover:to-orange-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'shadow-lg hover:shadow-xl'
          )}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">⏳</span>
              Submitting...
            </>
          ) : isLastStep ? (
            <>
              Complete Onboarding
              <Check className="w-5 h-5" />
            </>
          ) : (
            <>
              Next Step
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>

      {/* Auto-save Indicator */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          ✓ Progress automatically saved
        </p>
      </div>
    </div>
  );
}

// Step Content Wrapper for consistent styling
export function StepContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-6', className)}>
      {children}
    </div>
  );
}

// Form Field Wrapper
export function FormField({
  label,
  required = false,
  error,
  children,
  description,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-orange-500 ml-1">*</span>}
      </label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Checkbox Group Component
export function CheckboxGroup({
  options,
  selected,
  onChange,
  max,
}: {
  options: readonly string[] | string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  max?: number;
}) {
  const handleToggle = (option: string) => {
    const isSelected = selected.includes(option);

    if (isSelected) {
      onChange(selected.filter((item) => item !== option));
    } else {
      if (max && selected.length >= max) {
        return; // Don't add if max reached
      }
      onChange([...selected, option]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option) => {
        const isSelected = selected.includes(option);
        const isDisabled = !!(max && selected.length >= max && !isSelected);

        return (
          <label
            key={option}
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
              isSelected
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300',
              isDisabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => handleToggle(option)}
              disabled={isDisabled}
              className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {option}
            </span>
          </label>
        );
      })}
    </div>
  );
}

// Radio Group Component
export function RadioGroup({
  options,
  selected,
  onChange,
  name,
}: {
  options: readonly string[] | string[];
  selected: string;
  onChange: (value: string) => void;
  name: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {options.map((option) => {
        const isSelected = selected === option;

        return (
          <label
            key={option}
            className={cn(
              'flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
              isSelected
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={isSelected}
              onChange={(e) => onChange(e.target.value)}
              className="w-5 h-5 text-orange-500 border-gray-300 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {option}
            </span>
          </label>
        );
      })}
    </div>
  );
}
