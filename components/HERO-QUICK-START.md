# Hero Section - Quick Start Guide

## 1. Import the Component

```tsx
import HeroSection from '@/components/hero-section'
```

## 2. Add to Your Page

```tsx
export default function HomePage() {
  return (
    <main>
      <HeroSection />
      {/* Rest of your page content */}
    </main>
  )
}
```

## 3. Add Video (Optional)

```tsx
<HeroSection
  videoUrl="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
/>
```

## 4. Add Click Handlers (Optional)

```tsx
<HeroSection
  onGetStartedClick={() => {
    // Your code here - navigate, open modal, etc.
    console.log('Get Started clicked')
  }}
  onWatchVideoClick={() => {
    // Track analytics, etc.
    console.log('Watch Video clicked')
  }}
/>
```

## Complete Example

```tsx
'use client'

import { useRouter } from 'next/navigation'
import HeroSection from '@/components/hero-section'

export default function HomePage() {
  const router = useRouter()

  return (
    <main>
      <HeroSection
        videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
        onGetStartedClick={() => router.push('/contact')}
        onWatchVideoClick={() => console.log('Video started')}
      />
    </main>
  )
}
```

## Video URL Quick Reference

### YouTube
```
https://www.youtube.com/embed/VIDEO_ID?autoplay=1
```

### Vimeo
```
https://player.vimeo.com/video/VIDEO_ID?autoplay=1
```

## That's It!

Your hero section is now live with:
- Animated entrance
- Responsive design
- Video support
- Click handlers
- Brand colors and fonts

For more details, see `HERO-SECTION-README.md`
