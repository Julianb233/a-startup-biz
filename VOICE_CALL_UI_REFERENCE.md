# Voice Call UI Visual Reference

## Component States

### 1. Initial State - Floating Button
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│                                         │
│                                ┌─────┐  │
│                                │  🎧 │  │ ← Floating button
│                                └─────┘  │   with pulse animation
│                                         │
└─────────────────────────────────────────┘
  Mobile: 48x48px, bottom-4 right-4
  Desktop: 56x56px, bottom-6 right-6
  Color: Gradient orange to red (#ff6a1a → #ea580c)
```

### 2. Panel Open - Initial View
```
┌─────────────────────────────────────────┐
│                                         │
│                          ┌────────────┐ │
│                          │ Support Call│ │
│                          │ ────────────│ │
│                          │ Talk to our │ │
│                          │ AI assist.. │ │
│                          │             │ │
│                          │ ┌─────────┐ │ │
│                          │ │ Start   │ │ │ ← Primary CTA
│                          │ │ Voice   │ │ │
│                          │ │ Call    │ │ │
│                          │ └─────────┘ │ │
│                          │ Available   │ │
│                          │ 24/7        │ │
│                          └────────────┘ │
└─────────────────────────────────────────┘
  Mobile: Full width - 2rem, max 384px
  Desktop: 384px fixed
  Rounded: 16px
  Shadow: Large elevation
```

### 3. Connecting State
```
┌─────────────────────────────────────────┐
│                          ┌────────────┐ │
│                          │ Support Call│ │
│                          │ ────────────│ │
│                          │      ⟲      │ │ ← Spinner
│                          │             │ │
│                          │ Connecting..│ │
│                          │             │ │
│                          │ ┌─────────┐ │ │
│                          │ │ ⟲  Con- │ │ │ ← Disabled button
│                          │ │ necting │ │ │
│                          │ └─────────┘ │ │
│                          └────────────┘ │
└─────────────────────────────────────────┘
```

### 4. In Call - Active
```
┌─────────────────────────────────────────┐
│                          ┌────────────┐ │
│                          │ Support Call│ │
│                          │ ────────────│ │
│                          │      📞     │ │ ← Green circle
│                          │      ●      │ │   with pulse
│                          │             │ │
│                          │ Connected   │ │ ← Green text
│                          │   0:45      │ │ ← Timer
│                          │             │ │
│                          │  ▂▃▅▇▅▃▂   │ │ ← Audio visualizer
│                          │             │ │
│                          │  🎤  📞  🔊 │ │ ← Controls
│                          │             │ │
│                          │ Connected   │ │
│                          │ with AI     │ │
│                          └────────────┘ │
└─────────────────────────────────────────┘

  Controls (left to right):
  - Mute/Unmute microphone
  - End call (red, prominent)
  - Mute/Unmute speaker
```

### 5. Error State
```
┌─────────────────────────────────────────┐
│                          ┌────────────┐ │
│                          │ Support Call│ │
│                          │ ────────────│ │
│                          │      ⚠️     │ │ ← Error icon
│                          │             │ │
│                          │ Connection  │ │
│                          │ Failed      │ │
│                          │             │ │
│                          │ Voice serv- │ │
│                          │ ice tempor- │ │
│                          │ arily unav- │ │
│                          │ ailable     │ │
│                          │             │ │
│                          │ ┌─────────┐ │ │
│                          │ │ Try     │ │ │ ← Retry button
│                          │ │ Again   │ │ │
│                          │ └─────────┘ │ │
│                          └────────────┘ │
└─────────────────────────────────────────┘
```

---

## Responsive Breakpoints

### Mobile (< 768px)
```
Features:
- Full-width backdrop (black/50)
- Panel: calc(100vw - 2rem)
- Button: 48x48px
- Control padding: p-3
- Bottom: 1rem (16px)
- Right: 1rem (16px)
```

### Desktop (≥ 768px)
```
Features:
- No backdrop
- Panel: max-width 384px
- Button: 56x56px
- Control padding: p-4
- Bottom: 1.5rem (24px)
- Right: 1.5rem (24px)
```

---

## Color Palette

### Primary Colors
```
Orange Gradient:
- Start: #ff6a1a
- End: #ea580c
- Hover: #ea580c → #dc2626

Green (Connected):
- Circle: #10b981 (green-500)
- Pulse: #34d399 (green-400)
- Text: #10b981

Red (Error/End):
- Background: #ef4444 (red-500)
- Hover: #dc2626 (red-600)
- Shadow: red-500/50

Gray (Inactive):
- Light: #e5e7eb (gray-200)
- Dark: #374151 (gray-700)
```

### Dark Mode
```
Panel Background: #1f2937 (gray-800)
Border: #374151 (gray-700)
Text: white
Icons: white/gray-200
```

---

## Animations

### Button Entry (Initial Load)
```
Duration: ~1 second delay
Type: Spring animation
From: scale(0), opacity(0)
To: scale(1), opacity(1)
Stiffness: 200
```

### Panel Open/Close
```
Duration: 300ms
From: scale(0.8), opacity(0), translateY(20px)
To: scale(1), opacity(1), translateY(0)
Easing: ease-in-out
```

### Pulse Animation (Button)
```
Element: Orange circle behind button
Animation: ping (infinite)
Opacity: 30%
```

### Pulse Animation (Connected)
```
Element: Green dot indicator
Animation: ping (infinite)
Opacity: 75%
Size: 3px (mobile), 4px (desktop)
```

### Audio Visualizer
```
Bars: 7 total
Animation: Height oscillation
Duration: 0.5s + index * 0.1s (staggered)
Heights: [12px, 20px, 28px, 32px, 28px, 20px, 12px]
Peak multiplier: 1.5x
Color: Orange gradient
```

---

## Interaction Zones

### Touch Targets (Mobile)
```
Minimum size: 44x44px (WCAG compliant)
Actual button: 48x48px
Controls: 40x40px (p-3 + icon)
Spacing: 12px between controls
```

### Hover States (Desktop)
```
Button: Scale 1.1, shadow increase
Controls: Background darken
Close: Background lighten
All: transition-all 200ms
```

---

## Accessibility Features

### Keyboard Navigation
```
Tab: Focus through interactive elements
Enter/Space: Activate focused element
Escape: Close panel (when not in call)
```

### ARIA Labels
```
Button: "Open voice call"
Close: "Close"
Mute: "Mute microphone" / "Unmute microphone"
Speaker: "Mute speaker" / "Unmute speaker"
End Call: "End call"
```

### Screen Reader Announcements
```
Status changes:
- "Connecting..."
- "Connected"
- "Reconnecting..."
- "Disconnected"
- "Connection failed"
```

---

## Component Hierarchy

```
FloatingCallButtonWrapper
└── FloatingCallButton
    ├── Backdrop (mobile only)
    │   └── AnimatePresence
    └── Main Container
        ├── Closed State
        │   └── Button
        │       ├── Headphones Icon
        │       └── Pulse Effect
        └── Open State
            └── Panel
                ├── Header
                │   ├── Icon + Title
                │   └── Close Button
                ├── Content (conditional)
                │   ├── Initial View
                │   │   ├── Greeting
                │   │   ├── Start Button
                │   │   └── Availability Text
                │   ├── Connecting View
                │   │   ├── Spinner
                │   │   └── Status Text
                │   ├── Call Interface
                │   │   └── VoiceCallInterface
                │   └── Error View
                │       ├── Error Icon
                │       ├── Error Message
                │       └── Retry Button
                └── Footer (conditional)
```

---

## Z-Index Layering

```
Layer 40 (Backdrops):
- Mobile backdrop: z-40

Layer 50 (Fixed UI):
- Button container: z-50
- Panel: z-50 (inherited)
- Sales chatbot: z-50 (potential conflict)
```

---

## CSS Classes Reference

### Button
```css
/* Closed button */
.floating-button {
  width: 3rem; /* 48px mobile */
  height: 3rem;
  @media (min-width: 768px) {
    width: 3.5rem; /* 56px desktop */
    height: 3.5rem;
  }
  background: linear-gradient(to bottom right, #ff6a1a, #ea580c);
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  touch-action: manipulation;
}
```

### Panel
```css
.call-panel {
  width: calc(100vw - 2rem); /* Mobile */
  max-width: 24rem; /* 384px */
  background: white;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid #f3f4f6;
}

/* Dark mode */
.dark .call-panel {
  background: #1f2937;
  border-color: #374151;
}
```

### Controls
```css
.control-button {
  padding: 0.75rem; /* Mobile */
  @media (min-width: 768px) {
    padding: 1rem; /* Desktop */
  }
  border-radius: 9999px;
  transition: all 200ms;
  touch-action: manipulation;
}

.control-button.muted {
  background: #ef4444;
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.5);
}
```

---

## File Locations

```
/components/
  ├── floating-call-button-wrapper.tsx  (SSR wrapper)
  ├── floating-call-button.tsx          (Main component)
  └── voice-call-interface.tsx          (LiveKit integration)

/app/
  └── layout.tsx                        (Integration point)

/app/api/voice/
  └── token/
      └── route.ts                      (Token endpoint)

/components/__tests__/
  └── voice-call-integration.test.tsx   (Tests)
```

---

## Quick Reference - Key Measurements

| Element | Mobile | Desktop |
|---------|--------|---------|
| Button Size | 48x48px | 56x56px |
| Panel Width | 100vw - 2rem | 384px max |
| Panel Padding | 16px | 16px |
| Button Position | 1rem from edges | 1.5rem from edges |
| Control Buttons | 40x40px | 48x48px |
| Border Radius | 16px | 16px |
| Animation Duration | 300ms | 300ms |

---

This visual reference should help developers and designers understand the exact specifications and behavior of the voice call UI components.
