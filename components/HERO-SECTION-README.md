# Hero Section Component

A modern, animated hero section component for A Startup Biz featuring Framer Motion animations, video embed support, and responsive design.

## Features

- **Animated Entrance**: Staggered fade-in animations using Framer Motion
- **Video Support**: YouTube and Vimeo embed-ready with play button overlay
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Brand Colors**: Orange (#ff6a1a), Black (#000000), Silver (#c0c0c0), White (#ffffff)
- **Typography**: Montserrat (headings) and Lato (body) from Google Fonts
- **Interactive Elements**: Hover effects, scale animations, gradient backgrounds
- **Scroll Indicator**: Animated scroll prompt (desktop only)

## Props

```typescript
interface HeroSectionProps {
  videoUrl?: string              // Optional YouTube/Vimeo embed URL
  onGetStartedClick?: () => void // Callback for "Get Started" button
  onWatchVideoClick?: () => void // Callback for "Watch Video" button
}
```

## Usage

### Basic Usage (No Video)

```tsx
import HeroSection from '@/components/hero-section'

export default function HomePage() {
  return (
    <HeroSection
      onGetStartedClick={() => console.log('Get Started clicked')}
    />
  )
}
```

### With YouTube Video

```tsx
import HeroSection from '@/components/hero-section'

export default function HomePage() {
  const handleGetStarted = () => {
    // Navigate to signup, open modal, etc.
    router.push('/get-started')
  }

  const handleWatchVideo = () => {
    // Track analytics
    trackEvent('video_play', { location: 'hero' })
  }

  return (
    <HeroSection
      videoUrl="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
      onGetStartedClick={handleGetStarted}
      onWatchVideoClick={handleWatchVideo}
    />
  )
}
```

### With Vimeo Video

```tsx
<HeroSection
  videoUrl="https://player.vimeo.com/video/YOUR_VIDEO_ID?autoplay=1"
  onGetStartedClick={handleGetStarted}
  onWatchVideoClick={handleWatchVideo}
/>
```

## Video URL Formats

### YouTube
```
https://www.youtube.com/embed/VIDEO_ID?autoplay=1
```

Additional YouTube parameters:
- `autoplay=1` - Auto-play when loaded
- `mute=1` - Start muted
- `controls=0` - Hide controls
- `rel=0` - Don't show related videos

Example:
```
https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1&controls=1
```

### Vimeo
```
https://player.vimeo.com/video/VIDEO_ID?autoplay=1
```

Additional Vimeo parameters:
- `autoplay=1` - Auto-play when loaded
- `muted=1` - Start muted
- `controls=1` - Show controls
- `title=0` - Hide title

Example:
```
https://player.vimeo.com/video/76979871?autoplay=1&muted=1
```

## Content Customization

To customize the headline and subheadline, edit the component directly:

```tsx
// In hero-section.tsx

// Main headline (line 85-96)
<motion.h1 className="...">
  Are You an{' '}
  <span className="text-[#ff6a1a] relative inline-block">
    Entrepreneur
    {/* Animated underline */}
  </span>{' '}
  or Wantrepreneur?
</motion.h1>

// Subheadline (line 100-106)
<motion.p className="...">
  Stop dreaming about success.{' '}
  <span className="font-semibold text-black">We help you build it.</span>
</motion.p>
```

## Color Scheme

The component uses A Startup Biz brand colors:

- **Primary Orange**: `#ff6a1a` - CTAs, accents, hover states
- **Black**: `#000000` - Main text, headlines
- **White**: `#ffffff` - Background, button text
- **Silver**: `#c0c0c0` - Accents, secondary elements
- **Gray tones**: For subtle backgrounds and gradients

## Animation Details

### Container Animation
- Staggered children with 0.2s delay
- 0.1s initial delay

### Item Animation
- 30px upward slide on entry
- 0.6s duration with custom easing
- Cubic bezier: `[0.22, 1, 0.36, 1]`

### CTA Button Animation
- Scale from 0.9 to 1.0
- 0.5s duration
- 0.4s delay

### Background Blobs
- 7s infinite animation
- Offset delays (0s, 2s, 4s)
- Gentle floating effect

## Responsive Breakpoints

- **Mobile**: < 640px - Single column, centered text
- **Tablet**: 640px - 1024px - Larger text, side-by-side CTAs
- **Desktop**: > 1024px - Two columns, left-aligned text, scroll indicator

## Dependencies

Required packages (already in package.json):
- `framer-motion` (^11.18.0) - Animations
- `lucide-react` (^0.454.0) - Icons
- `tailwindcss` (^4.1.9) - Styling
- `next` (16.1.0) - Framework

## CSS Classes

Custom utilities added to `globals.css`:

```css
/* Blob animation */
.animate-blob { animation: blob 7s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
.animation-delay-4000 { animation-delay: 4s; }

/* Font utilities */
.font-montserrat { font-family: var(--font-montserrat), sans-serif; }
.font-lato { font-family: var(--font-lato), sans-serif; }
```

## Accessibility

- Semantic HTML structure
- ARIA-compliant iframe attributes
- Reduced motion support (via Tailwind)
- Keyboard navigable buttons
- Screen reader friendly

## Performance Optimizations

- Lazy video loading (only loads when play button clicked)
- Optimized Framer Motion variants
- CSS-based animations where possible
- No layout shift with aspect-ratio
- Font display: swap for faster initial render

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with webkit prefixes)
- Mobile browsers: Full responsive support

## Example Integration

See `hero-section-example.tsx` for a complete integration example with:
- Video URL configuration
- Click handler implementations
- Analytics tracking setup
- Navigation integration

## Troubleshooting

### Video not loading
- Check video URL format (YouTube/Vimeo embed URL, not watch URL)
- Ensure autoplay parameter is included
- Check CORS and iframe permissions

### Animations not working
- Verify Framer Motion is installed: `npm list framer-motion`
- Check for CSS conflicts
- Ensure `use client` directive is present

### Fonts not loading
- Verify fonts are imported in `layout.tsx`
- Check font variable names match in `globals.css`
- Clear Next.js cache: `rm -rf .next`

### Blob animation not showing
- Check CSS is compiled: rebuild with `npm run dev`
- Verify animation classes in `globals.css`
- Check browser dev tools for CSS errors

## File Locations

- Component: `/components/hero-section.tsx`
- Example: `/components/hero-section-example.tsx`
- Styles: `/app/globals.css`
- Layout: `/app/layout.tsx`

## Support

For issues or questions, refer to:
- Next.js documentation: https://nextjs.org/docs
- Framer Motion docs: https://www.framer.com/motion/
- Tailwind CSS docs: https://tailwindcss.com/docs
