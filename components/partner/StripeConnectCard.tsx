'use client'

import { useState } from 'react'
import { ExternalLink, CheckCircle2, AlertCircle, Loader2, Link2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { StripeConnectStatusResponse } from '@/lib/types/stripe-connect'

interface StripeConnectCardProps {
  status: StripeConnectStatusResponse | null
  onConnect: () => Promise<void>
  onRefreshOnboarding: () => Promise<void>
  onOpenDashboard: () => Promise<void>
  isLoading?: boolean
}

export function StripeConnectCard({
  status,
  onConnect,
  onRefreshOnboarding,
  onOpenDashboard,
  isLoading = false,
}: StripeConnectCardProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const handleAction = async (action: string, fn: () => Promise<void>) => {
    setActionLoading(action)
    try {
      await fn()
    } finally {
      setActionLoading(null)
    }
  }

  // Not connected state
  if (!status?.connected) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-orange-600" />
            Connect Your Bank Account
          </CardTitle>
          <CardDescription>
            Connect your Stripe account to receive commission payouts directly to your bank.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => handleAction('connect', onConnect)}
            disabled={isLoading || actionLoading !== null}
            className="bg-orange-600 hover:bg-orange-700"
          >
            {actionLoading === 'connect' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Connect Stripe Account
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Pending/incomplete onboarding
  if (status.status === 'pending' || !status.onboardingComplete) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            Complete Your Account Setup
          </CardTitle>
          <CardDescription>
            Your Stripe account is connected but requires additional information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => handleAction('onboarding', onRefreshOnboarding)}
            disabled={isLoading || actionLoading !== null}
            variant="outline"
            className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
          >
            {actionLoading === 'onboarding' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Continue Setup
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Restricted account
  if (status.status === 'restricted') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            Account Restricted
          </CardTitle>
          <CardDescription>
            Your Stripe account has restrictions. Please update your information.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            onClick={() => handleAction('onboarding', onRefreshOnboarding)}
            disabled={isLoading || actionLoading !== null}
            variant="outline"
            className="border-red-600 text-red-700 hover:bg-red-100"
          >
            {actionLoading === 'onboarding' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ExternalLink className="mr-2 h-4 w-4" />
                Update Information
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Disabled account
  if (status.status === 'disabled') {
    return (
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-gray-600" />
            Account Disconnected
          </CardTitle>
          <CardDescription>
            Your Stripe account has been disconnected. Please reconnect to receive payouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => handleAction('connect', onConnect)}
            disabled={isLoading || actionLoading !== null}
          >
            {actionLoading === 'connect' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Link2 className="mr-2 h-4 w-4" />
                Reconnect Stripe
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Active and ready
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          Stripe Account Connected
        </CardTitle>
        <CardDescription>
          Your account is set up and ready to receive payouts.
          {status.payoutsEnabled && ' Payouts are enabled.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => handleAction('dashboard', onOpenDashboard)}
          disabled={isLoading || actionLoading !== null}
          variant="outline"
          className="border-green-600 text-green-700 hover:bg-green-100"
        >
          {actionLoading === 'dashboard' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Stripe Dashboard
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
