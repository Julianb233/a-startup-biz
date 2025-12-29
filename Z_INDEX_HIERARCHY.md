# Z-Index Hierarchy

## Current Z-Index Organization

To prevent conflicts between floating elements, here's the z-index hierarchy used across the application:

### Layer 0: Background (-z-10 to z-0)
- Background elements and decorative layers
- Blur effects and backdrop elements

### Layer 1: Content (z-10)
- Main content sections
- Relative positioning within sections
- Text overlays on images

### Layer 2: Dropdowns & Overlays (z-40)
- Modal backdrops: `z-40`
- Sidebar backdrops: `z-40`
- Chat widget backdrop: `z-40`
- **Floating call button backdrop**: `z-40` (mobile only)

### Layer 3: Fixed UI Elements (z-50)
- Header navigation: `z-50`
- **Sales chatbot**: `z-50`
- **Floating call button**: `z-50`
- Cart drawer: `z-50`
- Modals and dialogs: `z-50`
- Sidebars: `z-50`
- Notification bells: `z-50`

## Floating Elements Coordination

### Bottom-Right Corner Elements
1. **Sales Chatbot** (`bottom-6 right-6`)
   - Z-index: `z-50`
   - Icon button: 64px × 64px
   - Chat panel: 384px × 600px

2. **Floating Call Button** (`bottom-4 right-4` on mobile, `bottom-6 right-6` on desktop)
   - Z-index: `z-50`
   - Icon button: 48px × 48px (mobile), 56px × 56px (desktop)
   - Call panel: Full width - 2rem (mobile), max 384px (desktop)

### Conflict Resolution
Since both elements are in the bottom-right corner with the same z-index, positioning is staggered:

- **Mobile**: Call button at `bottom-4 right-4`, Chatbot at `bottom-6 right-6`
- **Desktop**: Both use standard `bottom-6 right-6` but buttons are different sizes

**Recommendation**: Consider adjusting positioning if both are visible simultaneously:

```tsx
// Option 1: Stack vertically
// Chatbot: bottom-24 right-6 (96px from bottom)
// Call button: bottom-6 right-6 (24px from bottom)

// Option 2: Stack horizontally
// Chatbot: bottom-6 right-24 (96px from right)
// Call button: bottom-6 right-6 (24px from right)

// Option 3: Only show one at a time based on context
```

## Best Practices

1. **Use Semantic Layers**: Group related elements in the same z-index range
2. **Leave Gaps**: Use increments of 10 (z-10, z-20, z-30) to allow for future additions
3. **Document Changes**: Update this file when adding new floating elements
4. **Test Interactions**: Verify click-through doesn't occur on overlapping elements
5. **Mobile Considerations**: Different positioning may be needed for mobile viewports

## Current Status

### Floating Call Button
- ✅ Properly positioned with responsive values
- ✅ Backdrop on mobile prevents background interaction
- ✅ Z-index matches other floating elements
- ✅ No conflicts detected
- ⚠️ May overlap with chatbot - consider conditional rendering or repositioning

### Recommendations
1. **Conditional Display**: Show only one floating element at a time
2. **Smart Positioning**: Detect other floating elements and adjust position
3. **Stacking Context**: Create a dedicated container for all floating elements
4. **State Management**: Coordinate which floating element is active

## Example Implementation

```tsx
// FloatingElementsProvider
const FloatingElementsContext = createContext({
  activeElement: null,
  setActiveElement: () => {},
})

// Usage in layout
<FloatingElementsProvider>
  {activeElement !== 'chat' && <FloatingCallButton />}
  {activeElement !== 'call' && <SalesChatbot />}
</FloatingElementsProvider>
```

This ensures only one floating element is expanded at a time, preventing visual conflicts.
