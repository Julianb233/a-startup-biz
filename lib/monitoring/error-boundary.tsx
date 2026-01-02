/**
 * Monitored Error Boundary Component
 *
 * Wraps components with error tracking and context
 */

'use client';

import * as Sentry from '@sentry/nextjs';
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  context?: string;
  businessCritical?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class MonitoredErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Add business context to error
    Sentry.withScope((scope) => {
      scope.setContext('component', {
        context: this.props.context,
        componentStack: errorInfo.componentStack,
      });

      // Tag critical business flows
      if (this.props.businessCritical) {
        scope.setTag('business_critical', 'true');
        scope.setLevel('error');
      }

      if (this.props.context) {
        scope.setTag('error_boundary_context', this.props.context);
      }

      Sentry.captureException(error);
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback or default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="max-w-md text-center">
            <div className="mb-4">
              <svg
                className="mx-auto h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We've been notified and are working to fix the issue. Please try
              refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Pre-configured error boundaries for common use cases
 */
export const PartnerOnboardingErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MonitoredErrorBoundary context="partner-onboarding" businessCritical={true}>
    {children}
  </MonitoredErrorBoundary>
);

export const PaymentErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MonitoredErrorBoundary context="payment-processing" businessCritical={true}>
    {children}
  </MonitoredErrorBoundary>
);

export const VoiceCallErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MonitoredErrorBoundary context="voice-call" businessCritical={true}>
    {children}
  </MonitoredErrorBoundary>
);

export const BookingErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <MonitoredErrorBoundary context="booking" businessCritical={true}>
    {children}
  </MonitoredErrorBoundary>
);
