# Hero Section Component

A professional, B2B-focused hero section for Daily Event Insurance with clean design and subtle animations.

## Component Location
`/root/github-repos/daily-event-insurance/components/hero-section.tsx`

## Preview
Visit `/hero-demo` to see the component in isolation.

## Features

### Design
- Clean, professional B2B aesthetic
- Light background with subtle gradient (white to slate-50)
- Teal accent color (#14B8A6) from the project palette
- Minimal dotted background pattern
- Large typography with clear hierarchy
- Mobile-first responsive design

### Content
- **Headline**: "Daily Event Insurance" with teal accent
- **Subheadline**: "Same-Day Coverage for Your Members"
- **Description**: Value proposition for B2B customers
- **Primary CTA**: "Get Started Today" (teal button)
- **Secondary CTA**: "See How It Works" (outline button)
- **Trust Indicators**: Three key benefits with checkmarks

### Animations (Framer Motion)
All animations are subtle and professional:
- Fade in + slide up for content sections
- Staggered delays for hierarchy
- Hover effects on buttons (scale + shadow)
- Floating cards on desktop view
- Gentle floating decorative elements

### Visual Elements (Desktop Only)
- Center card showcasing insurance policy with pricing
- Stats card showing "+42% Revenue Increase"
- Users card showing "1,247 Happy Members"
- Subtle gradient blob backgrounds
- Floating decorative circles with gentle motion

### Responsive Breakpoints
- **Mobile**: Content-only, centered layout
- **Tablet (sm)**: 2-column button layout
- **Desktop (lg)**: 2-column grid with visual showcase

## Usage

```tsx
import HeroSection from "@/components/hero-section"

export default function Page() {
  return <HeroSection />
}
```

## Dependencies
- `framer-motion` - Animations
- `lucide-react` - Icons (ArrowRight, PlayCircle)
- Tailwind CSS - Styling

## Color Palette
Uses the project's teal color scheme:
- Primary: `#14B8A6` (teal-600)
- Light: `#F8FAFC` (slate-50)
- Text: `#1E293B` (slate-900)
- Secondary: `#0EA5E9` (sky-500)

## Customization

### Update CTA Links
Edit the button elements to add proper routing:

```tsx
<motion.button
  onClick={() => router.push('/get-started')}
  // ... rest of props
>
```

### Change Content
All content is hardcoded for easy customization:
- Line 36-45: Headline
- Line 54-56: Subheadline
- Line 65-67: Description
- Line 82: Primary CTA text
- Line 94: Secondary CTA text

### Adjust Colors
The component uses Tailwind classes aligned with globals.css:
- `text-teal-600` - Primary accent
- `bg-teal-600` - Primary button
- `text-slate-900` - Headings
- `text-slate-600` - Body text

## Performance Considerations
- All animations use GPU-accelerated properties
- Motion components respect `prefers-reduced-motion`
- Desktop-only visual elements hidden on mobile
- SVG icons for crisp rendering at all sizes

## Accessibility
- Semantic HTML structure
- Proper heading hierarchy (h1 → h2 → p)
- Sufficient color contrast ratios
- Focus states on interactive elements
- Responsive text sizing

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript for animations
- Gracefully degrades without JS (content visible)

## File Size
- Component code: ~10KB
- No external images required
- Uses inline SVG for icons

## Next Steps
1. Connect CTA buttons to actual routes
2. Add analytics tracking to buttons
3. Consider A/B testing variations
4. Add video modal for "See How It Works" CTA
5. Implement form collection for "Get Started" CTA
