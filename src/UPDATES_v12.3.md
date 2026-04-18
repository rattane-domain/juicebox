# Juicebox v12.3 - Tap Hint for Passive Drinks

## Feature

**"tap drink to play"** - Pulsierender Hint erscheint nach 3 Sekunden wenn ein passiver Drink centered ist.

## Problem Addressed

**Vorher:** User swiped zu einem neuen Drink und wusste nicht sofort, dass sie tippen müssen um ihn zu aktivieren. Keine visuelle Anleitung.

**Jetzt:** Nach 3 Sekunden erscheint ein dezenter, pulsierender Hint "tap drink to play" über dem Footer.

## User Experience Flow

```
User swiped zu passivem Drink
  ↓
Drink ist centered (passiv/grau)
  ↓
3 Sekunden warten...
  ↓
💡 "tap drink to play" erscheint (pulsierend)
  ↓
User tippt Drink
  ↓
Hint verschwindet sofort
  ↓
Drink aktiviert sich
```

## Visual Behavior

### Timing
```
t = 0s    → Passive drink centered
t = 0-3s  → Nothing (user kann selbst entdecken)
t = 3s    → Hint fades in, starts pulsing
```

### Animation
```css
animate-pulse
/* Tailwind's built-in pulse animation */
opacity: 1 → 0.5 → 1 (repeat)
duration: 1.5s
easing: cubic-bezier(0.4, 0, 0.6, 1)
```

### Positioning
```
┌─────────────────┐
│                 │
│   🍹 Drink      │  ← Carousel
│                 │
│                 │
├─────────────────┤
│ tap drink to play│  ← NEW: Hint (30px height)
├─────────────────┤
│   Martini       │  ← Footer (100px)
│   Radio Paradise│
│   Playing       │
└─────────────────┘
```

## Conditions

Hint wird **NUR** gezeigt wenn:

### ✅ All true:
1. **Start screen closed** - Main app visible
2. **Not animating** - Carousel settled
3. **Not loading** - No drink currently loading
4. **Center drink is passive** - `centerIndex !== activeDrinkIndex`
5. **3 seconds elapsed** - Timer completed

### ❌ Hide immediately when:
1. User taps center drink
2. User swipes (centerIndex changes)
3. Drink becomes active
4. Loading starts
5. Animation starts

## Implementation

### 1. State Management

```typescript
const [showTapHint, setShowTapHint] = useState(false);
```

### 2. Timer Logic

```typescript
useEffect(() => {
  // Reset hint immediately on any change
  setShowTapHint(false);
  
  // Don't show if conditions not met
  if (showStartScreen || isAnimating || isLoading || centerIndex === activeDrinkIndex) {
    return;
  }
  
  // Start 3-second timer
  const timer = setTimeout(() => {
    setShowTapHint(true);
  }, 3000);
  
  // Cleanup
  return () => {
    clearTimeout(timer);
    setShowTapHint(false);
  };
}, [centerIndex, activeDrinkIndex, isAnimating, isLoading, showStartScreen]);
```

### 3. Tap Handler

```typescript
const handleCenterTap = async () => {
  setShowTapHint(false); // Hide immediately
  // ... rest of tap logic
};
```

### 4. UI Component

```tsx
{/* Tap Hint (above footer) */}
<div className="flex-none h-[30px] flex items-center justify-center">
  {showTapHint && (
    <div 
      className="text-xs opacity-60 animate-pulse"
      style={{
        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}
    >
      tap drink to play
    </div>
  )}
</div>
```

## Design Decisions

### Why 3 seconds?
- **0-1s**: Too fast, user hasn't had time to explore
- **1-2s**: Still exploring, doesn't need help yet
- **3s**: Perfect balance - long enough to try, short enough to help
- **5s+**: Too long, user already frustrated

### Why pulsing animation?
- **Subtle**: Not annoying or distracting
- **Attention-grabbing**: Movement catches eye
- **Professional**: Smooth, native feel
- **Universal**: Standard UI pattern

### Why "tap drink to play"?
- **Clear action**: "tap" = what to do
- **Clear target**: "drink" = where to tap
- **Clear result**: "play" = what happens
- **Short**: Easy to read quickly

### Why above footer?
- **Near drink**: Visual connection to action
- **Not overlapping**: Doesn't cover drink name
- **Natural flow**: Eyes move down from drink to info
- **Clean**: Separate dedicated space

## Edge Cases Handled

### 1. Rapid Swiping
```typescript
// Timer resets on every centerIndex change
// Hint won't flicker during swipes
```

### 2. Tap During Hint
```typescript
setShowTapHint(false); // Immediate hide
// No flash or delay
```

### 3. Active Drink Centered
```typescript
if (centerIndex === activeDrinkIndex) return;
// Never shows hint for active drink
```

### 4. Loading State
```typescript
if (isLoading) return;
// Don't show hint during load
```

### 5. Start Screen
```typescript
if (showStartScreen) return;
// Only in main app, not on start screen
```

## Testing Scenarios

- [x] Swipe to passive drink → Wait 3s → Hint appears
- [x] Tap before 3s → No hint appears
- [x] Tap after hint shows → Hint disappears immediately
- [x] Swipe away during hint → Hint disappears immediately
- [x] Active drink centered → No hint (ever)
- [x] During loading → No hint
- [x] During animation → No hint
- [x] Rapid swiping → No hint flicker
- [x] Start screen → No hint

## Performance

- **Memory**: 1 boolean state + 1 timer = negligible
- **CPU**: Timer cleanup on every state change (efficient)
- **Render**: Conditional render, no layout shift
- **Animation**: CSS-based (GPU accelerated)

## Accessibility

### Visual
- **Opacity 60%**: Subtle but readable
- **Pulsing**: Catches attention without being jarring
- **Size**: text-xs (12px) - small but legible

### Cognitive Load
- **Non-intrusive**: Appears after exploration time
- **Self-explanatory**: Clear instruction
- **Dismissable**: Goes away on action

### Motion Sensitivity
- **Smooth pulse**: Not rapid or jarring
- **Predictable**: Standard animation pattern
- Future: Could add `prefers-reduced-motion` support

## Future Enhancements

### Possible Improvements:
1. **Fade transition** - Smoother appear/disappear
2. **Internationalization** - Translate "tap drink to play"
3. **Reduced motion** - Respect system preferences
4. **Smart timing** - Adjust based on user behavior
5. **Different hints** - Vary text for repeat users

### Advanced:
```typescript
// Example: Don't show after first activation
const [hasActivatedOnce, setHasActivatedOnce] = useState(false);

if (hasActivatedOnce) return; // Skip hint for experienced users
```

## Comparison to Other Apps

| App | Discovery UX | Pattern |
|-----|--------------|---------|
| **Spotify** | No hint | Relies on familiar patterns |
| **Apple Music** | Tooltips | First-time user onboarding |
| **YouTube** | No hint | Click is obvious |
| **TikTok** | Tutorial overlay | Explicit instructions |
| **Juicebox** | ✅ Smart hint | Just-in-time guidance |

## User Feedback Scenarios

### 🎯 Positive:
- "Oh! I didn't know I could tap it"
- "Nice, the hint appeared right when I needed it"
- "Subtle and helpful"

### ⚠️ Potential Negative:
- "I already knew, why show hint?"
  → **Solution**: 3-second delay gives time to discover
- "The hint is annoying"
  → **Solution**: Subtle opacity + smooth animation
- "I don't see the hint"
  → **Solution**: Clear positioning + pulsing draws attention

## Metrics to Track (Future)

1. **Time to first tap** - Does hint reduce confusion?
2. **Hint appearance rate** - How often does it show?
3. **Tap after hint** - Do users respond to it?
4. **Repeat hint views** - Are users getting stuck?

## Files Changed

### Modified
- `/App.tsx` - Added hint state, timer logic, and UI
- `/constants/app.ts` - Version bump to v12.3

### Lines Added
- App.tsx: +30 lines
  - State: 1 line
  - Timer useEffect: 18 lines
  - Tap handler update: 1 line
  - UI component: 10 lines

## Code Patterns Used

### React Patterns
- ✅ useState for local UI state
- ✅ useEffect for side effects (timer)
- ✅ Cleanup function (clearTimeout)
- ✅ Dependency array (proper reactivity)
- ✅ Conditional rendering

### Best Practices
- ✅ Single responsibility (one useEffect for hint)
- ✅ Declarative (conditions, not imperative logic)
- ✅ Predictable (resets on any change)
- ✅ Performant (CSS animation, not JS)
- ✅ Maintainable (clear intent, good naming)

## Notes

- Hint text is lowercase to match app's casual, friendly tone
- No emoji in hint to keep it clean and professional
- 30px height gives breathing room, prevents cramping
- Timer cleanup prevents memory leaks
- Inline animation style ensures it works (Tailwind backup)

---

**Version:** v12.3  
**Date:** January 2025  
**Impact:** 🎯 Medium - Improved discoverability for new users  
**Type:** UX Enhancement - Progressive disclosure pattern
