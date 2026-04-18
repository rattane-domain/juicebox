# Carousel V2 - Physical Interactions

## Overview

Carousel V2 is a complete rebuild of the carousel mechanics with identical visuals but much improved interaction feel. The old carousel (`SimpleCarousel.tsx` and `useSimpleCarousel.ts`) is kept as legacy and can be deleted once V2 is confirmed stable.

## Key Improvements

✅ **Continuous smooth animation** - No more abrupt jumps between drinks  
✅ **Dynamic speed adjustment** - Speed adapts in real-time during tapping  
✅ **Spring physics** - Natural, fluid motion that feels responsive  
✅ **No tempo changes** - First switch flows smoothly into subsequent switches

## Two Interaction Modes

### 1. TAP MODE
Click/tap on left/right zones (33% of screen width each) to navigate.

**Timing Formula:**
```
AnimationEnd = max(1.0s from first tap, lastTapTime + 0.5s)
```

**Behavior:**
- Rotation starts **immediately** on first tap
- **Continuous smooth animation** to target position (no discrete jumps)
- Speed adjusts **in real-time** during tapping (not between drinks)
- Uses **spring physics** for natural, fluid motion
- Each new tap extends target and animation adjusts seamlessly

**How it works:**
1. First tap sets target drink and deadline (1.0s from now)
2. Animation starts immediately with spring physics
3. Each additional tap:
   - Extends the target drink
   - Updates deadline: `max(currentDeadline, now + 0.5s)`
   - Animation **adapts in real-time** to reach new target by new deadline
4. requestAnimationFrame loop advances drink index when appropriate
5. Spring animation smoothly follows the changing centerIndex

**Examples:**
- User taps 9 times within 3 sec (evenly distributed):
  - Smooth continuous rotation through all 9 drinks
  - Completes at t=3.166s (last tap at 2.666s + 0.5s)
  - No abrupt speed changes - spring adapts fluidly

- User taps very fast (10+ taps/sec):
  - Animation extends deadline with each tap
  - Speed increases smoothly to keep up
  - Never feels jerky or discontinuous

### 2. SWIPE MODE
Drag horizontally to rotate the carousel like an iOS time picker wheel.

**Behavior:**
- Feels like a physical wheel
- Momentum and deceleration after release
- Snaps to discrete drink positions
- Fast swipe → skip multiple drinks
- Slow drag → move one drink

**Physics:**
- Velocity threshold: 500 px/s
- Fast swipe: `drinksToSkip = round(velocity / 800)` (clamped 1-5)
- Slow drag: offset > 50px → skip 1 drink
- Duration: `0.4s + (drinksToSkip * 0.1s)`

## Files

### New Files
- `/components/DrinkCarouselV2.tsx` - New carousel component
- `/hooks/usePhysicalCarousel.ts` - New carousel hook with both modes
- `/CAROUSEL_V2_README.md` - This file

### Legacy Files (can be deleted once V2 is stable)
- `/components/SimpleCarousel.tsx` - Old carousel component
- `/hooks/useSimpleCarousel.ts` - Old carousel hook

### Updated Files
- `/App.tsx` - Now uses DrinkCarouselV2 and usePhysicalCarousel

## Visuals

The visuals are **identical** to the old carousel:
- Same drink spacing (98px)
- Same center padding (20px)
- Same scales (center: 2.16, adjacent: 1.1, edge: 1.0)
- Same opacity levels
- Same 3:5 portrait ratio (75x125px)

Only the **mechanics** changed - how it rotates and how gestures are handled.

## Migration

To revert to old carousel (if needed):

1. In `/App.tsx`, uncomment the legacy imports:
   ```tsx
   import SimpleCarousel from './components/SimpleCarousel';
   import { useSimpleCarousel } from './hooks/useSimpleCarousel';
   ```

2. Comment out the V2 imports:
   ```tsx
   // import DrinkCarouselV2 from './components/DrinkCarouselV2';
   // import { usePhysicalCarousel } from './hooks/usePhysicalCarousel';
   ```

3. Replace the hook usage:
   ```tsx
   const { centerIndex, isAnimating, animationDuration, swipeLeft, swipeRight, navigateTo } = 
     useSimpleCarousel({ ... });
   ```

4. Replace the component:
   ```tsx
   <SimpleCarousel
     animationDuration={animationDuration}
     // ... (no onSwipeEnd prop)
   />
   ```

## Testing Checklist

- [ ] Tap left zone → drinks rotate right
- [ ] Tap right zone → drinks rotate left
- [ ] Tap center → activate/mute drink
- [ ] Multiple rapid taps → smooth queue processing
- [ ] Very fast tapping (10+ taps/sec) → graceful speed adaptation
- [ ] Slow swipe → rotate one drink
- [ ] Fast swipe → skip multiple drinks
- [ ] Swipe with momentum → natural deceleration
- [ ] All interactions snap to discrete positions
- [ ] Visual alignment unchanged
- [ ] No visual glitches during transitions
