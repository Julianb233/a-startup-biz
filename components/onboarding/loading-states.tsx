'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function SubmittingOverlay({ message = 'Submitting your information...' }: { message?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-full" />
            <div className="relative bg-orange-100 dark:bg-orange-900/30 p-4 rounded-full">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Processing...
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {message}
          </p>

          <div className="w-full space-y-2">
            <ProgressStep completed text="Validating information" />
            <ProgressStep active text="Saving to database" />
            <ProgressStep text="Sending confirmations" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProgressStep({
  completed,
  active,
  text,
}: {
  completed?: boolean;
  active?: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div
        className={cn(
          'w-5 h-5 rounded-full flex items-center justify-center transition-colors',
          completed && 'bg-green-500',
          active && 'bg-orange-500',
          !completed && !active && 'bg-gray-200 dark:bg-gray-700'
        )}
      >
        {completed && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
        {active && <Loader2 className="w-3 h-3 text-white animate-spin" />}
      </div>
      <span
        className={cn(
          'transition-colors',
          (completed || active) && 'text-gray-900 dark:text-white font-medium',
          !completed && !active && 'text-gray-500 dark:text-gray-400'
        )}
      >
        {text}
      </span>
    </div>
  );
}

export function InlineLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-gray-600 dark:text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">{text}</span>
    </div>
  );
}
