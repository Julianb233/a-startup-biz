# Voice Call Integration - Usage Examples

## Basic Usage

### 1. Add to Any Page or Layout

```tsx
// app/page.tsx or app/layout.tsx
import { FloatingCallButton } from "@/components/floating-call-button"

export default function Page() {
  return (
    <div>
      <h1>Welcome to A Startup Biz</h1>
      {/* Your page content */}

      {/* Add the floating call button */}
      <FloatingCallButton />
    </div>
  )
}
```

### 2. Custom API Endpoint

If you have a custom voice token endpoint:

```tsx
import { FloatingCallButton } from "@/components/floating-call-button"

export default function Page() {
  return (
    <div>
      <FloatingCallButton voiceApiUrl="/api/custom/voice" />
    </div>
  )
}
```

### 3. Layout Integration (Available on All Pages)

```tsx
// app/layout.tsx
import { FloatingCallButton } from "@/components/floating-call-button"
import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
          {/* Available on all pages */}
          <FloatingCallButton />
        </body>
      </html>
    </ClerkProvider>
  )
}
```

## Advanced Usage

### 4. Conditional Rendering

```tsx
"use client"

import { FloatingCallButton } from "@/components/floating-call-button"
import { usePathname } from "next/navigation"

export default function ConditionalCallButton() {
  const pathname = usePathname()

  // Only show on specific pages
  const showOnPages = ["/dashboard", "/support", "/pricing"]
  const shouldShow = showOnPages.includes(pathname)

  if (!shouldShow) return null

  return <FloatingCallButton />
}
```

### 5. With Custom Positioning

```tsx
// Create a wrapper component with custom positioning
"use client"

import { FloatingCallButton } from "@/components/floating-call-button"

export function CustomPositionedCallButton() {
  return (
    <div className="fixed bottom-24 right-6 z-50">
      <FloatingCallButton />
    </div>
  )
}
```

Note: You'll need to modify the `floating-call-button.tsx` to remove its own positioning classes.

### 6. Integration with Analytics

```tsx
"use client"

import { FloatingCallButton } from "@/components/floating-call-button"
import { useEffect } from "react"

export function TrackedCallButton() {
  useEffect(() => {
    // Track when component mounts
    console.log("Call button rendered")
    // Or use your analytics service
    // analytics.track("call_button_viewed")
  }, [])

  return <FloatingCallButton />
}
```

## Server Components

### 7. Dashboard with Server Component

```tsx
// app/dashboard/page.tsx
import { FloatingCallButton } from "@/components/floating-call-button"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div>
      <h1>Dashboard</h1>
      {/* Your dashboard content */}

      {/* The button will only show for authenticated users */}
      <FloatingCallButton />
    </div>
  )
}
```

## Mobile Responsive Examples

### 8. Hide on Mobile

```tsx
// components/desktop-call-button.tsx
"use client"

import { FloatingCallButton } from "@/components/floating-call-button"
import { useMediaQuery } from "@/hooks/use-media-query" // Install or create this hook

export function DesktopOnlyCallButton() {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (!isDesktop) return null

  return <FloatingCallButton />
}
```

### 9. Different Position on Mobile

```tsx
"use client"

import { FloatingCallButton } from "@/components/floating-call-button"

export function ResponsiveCallButton() {
  return (
    <>
      {/* Mobile - bottom center */}
      <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <FloatingCallButton />
      </div>

      {/* Desktop - bottom right */}
      <div className="hidden md:block">
        <FloatingCallButton />
      </div>
    </>
  )
}
```

## Testing Examples

### 10. Storybook Story

```tsx
// components/floating-call-button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { FloatingCallButton } from "./floating-call-button"

const meta: Meta<typeof FloatingCallButton> = {
  title: "Components/FloatingCallButton",
  component: FloatingCallButton,
  parameters: {
    layout: "fullscreen",
  },
}

export default meta
type Story = StoryObj<typeof FloatingCallButton>

export const Default: Story = {}

export const CustomApiUrl: Story = {
  args: {
    voiceApiUrl: "/api/custom/voice",
  },
}
```

### 11. Playwright Test

```typescript
// e2e/floating-call-button.spec.ts
import { test, expect } from "@playwright/test"

test.describe("Floating Call Button", () => {
  test("should render for authenticated users", async ({ page }) => {
    // Login first
    await page.goto("/sign-in")
    // ... perform login

    await page.goto("/dashboard")

    // Check button is visible
    const button = page.locator('button[aria-label="Open voice call"]')
    await expect(button).toBeVisible()
  })

  test("should open call panel on click", async ({ page }) => {
    await page.goto("/dashboard")

    const button = page.locator('button[aria-label="Open voice call"]')
    await button.click()

    // Check panel opened
    const panel = page.locator('text=Support Call')
    await expect(panel).toBeVisible()
  })

  test("should initiate call", async ({ page }) => {
    await page.goto("/dashboard")

    // Open panel
    await page.locator('button[aria-label="Open voice call"]').click()

    // Start call
    await page.locator('button:has-text("Start Voice Call")').click()

    // Wait for connection
    await expect(page.locator('text=Connected')).toBeVisible({ timeout: 10000 })
  })
})
```

## Environment Setup

### 12. Local Development .env.local

```bash
# LiveKit Configuration
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
LIVEKIT_HOST=ws://localhost:7880

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 13. Production .env.production

```bash
# LiveKit Cloud
LIVEKIT_API_KEY=APIxxx...
LIVEKIT_API_SECRET=xxx...
LIVEKIT_HOST=wss://your-project.livekit.cloud

# Clerk Production
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
```

## Common Integration Patterns

### 14. With Feature Flag

```tsx
"use client"

import { FloatingCallButton } from "@/components/floating-call-button"
import { useFeatureFlag } from "@/hooks/use-feature-flag"

export function FeatureFlaggedCallButton() {
  const isVoiceCallEnabled = useFeatureFlag("voice_call_enabled")

  if (!isVoiceCallEnabled) return null

  return <FloatingCallButton />
}
```

### 15. With User Subscription Check

```tsx
"use client"

import { FloatingCallButton } from "@/components/floating-call-button"
import { useUser } from "@clerk/nextjs"

export function PremiumCallButton() {
  const { user } = useUser()

  // Only show for premium users
  const isPremium = user?.publicMetadata?.subscription === "premium"

  if (!isPremium) {
    return null
  }

  return <FloatingCallButton />
}
```

### 16. Multiple Call Types

```tsx
"use client"

import { FloatingCallButton } from "@/components/floating-call-button"
import { useState } from "react"

export function MultiTypeCallButton() {
  const [callType, setCallType] = useState<"support" | "sales">("support")

  return (
    <div>
      <select value={callType} onChange={(e) => setCallType(e.target.value as any)}>
        <option value="support">Support</option>
        <option value="sales">Sales</option>
      </select>

      <FloatingCallButton
        voiceApiUrl={`/api/voice/token?type=${callType}`}
      />
    </div>
  )
}
```

## Deployment Checklist

- [ ] Set up LiveKit server or cloud account
- [ ] Configure environment variables
- [ ] Enable microphone permissions in browser
- [ ] Test on staging environment
- [ ] Verify Clerk authentication
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Monitor error logs
- [ ] Set up analytics tracking
- [ ] Configure CSP headers if needed

## Troubleshooting Common Issues

### Issue: Button doesn't appear
**Solution:** Ensure user is signed in with Clerk

### Issue: "Voice service not configured" error
**Solution:** Check LIVEKIT_API_KEY and LIVEKIT_API_SECRET in .env.local

### Issue: Connection fails
**Solution:** Verify LIVEKIT_HOST is correct and accessible

### Issue: No audio
**Solution:** Check browser microphone permissions

### Issue: Dark mode styling issues
**Solution:** Ensure dark mode classes are configured in tailwind.config
