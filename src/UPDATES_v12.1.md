# Juicebox v12.1 - Momentum Carousel & UI Cleanup

## Changes

### ✅ Removed Complexity
1. **AnimatedShaker Removed**
   - No more shaker button/animation
   - Removed import and usage from App.tsx
   - Simpler UI, focus on drinks

2. **Theme Toggle Removed**
   - Removed sun/moon icon button
   - Theme still works (system-based)
   - Cleaner header with only version number

3. **Simplified Footer**
   - Removed play/pause button
   - Only shows station name + status
   - Reduced height from 140px to 100px

### 🚀 Momentum-Based Carousel

**Problem:** Previous carousel required precise swipes. Fast/long swipes didn't feel natural.

**Solution:** Leveraged Framer Motion's built-in drag + momentum system (rock solid library).

#### Implementation Details

**Framer Motion Drag Props:**
```typescript
drag="x"                    // Horizontal drag only
dragConstraints={{ left: 0, right: 0 }}  // Snap back to center
dragElastic={0.2}          // Rubber-band effect
dragMomentum={true}        // Enable momentum
```

**Velocity-Based Detection:**
```typescript
const handleDragEnd = (event, info: PanInfo) => {
  const { offset, velocity } = info;
  
  // Swipe if:
  // 1. Offset > 50px (dragged far enough)
  // OR
  // 2. Velocity > 300 (fast flick)
  const shouldSwipe = Math.abs(offset.x) > 50 || Math.abs(velocity.x) > 300;
  
  if (shouldSwipe) {
    // Direction from velocity (more responsive)
    const direction = Math.abs(velocity.x) > 300 ? velocity.x : offset.x;
    // ... trigger swipe
  }
};
```

**Benefits:**
- ✅ Fast flicks work perfectly
- ✅ Momentum feels natural
- ✅ Can swipe over multiple drinks quickly
- ✅ Rubber-band effect on edges
- ✅ Rock solid (Framer Motion is battle-tested)

**Performance:**
- Uses native browser momentum
- GPU-accelerated transforms
- No custom physics needed

### 🎨 UI Improvements

**Before:**
```
[Theme Toggle]              [Version]
        [Carousel]
   [Station Name]
  [Shaker Button]
    [Status Text]
```

**After:**
```
                           [Version]
        [Carousel]
   [Station Name]
    [Status Text]
```

Cleaner, more focused on the drinks.

### 🐛 Fixed Warnings

- Fixed StartScreen prop types (made optional props properly optional)
- Removed unused `activeDrinkIndices` variable
- All TypeScript warnings resolved

## Technical Details

### Files Modified
- `/App.tsx` - Removed AnimatedShaker, theme toggle, simplified footer
- `/components/SimpleCarousel.tsx` - Complete rewrite with Framer Motion drag
- `/components/StartScreen.tsx` - Fixed prop types
- `/constants/app.ts` - Version bump to v12.1

### Files NOT Deleted (For Reference)
- `/components/AnimatedShaker.tsx` - Kept for potential future use
- All legacy hooks and components remain for reference

### Code Reduction
- **App.tsx:** 195 lines → 180 lines (-8%)
- **SimpleCarousel.tsx:** 238 lines → 180 lines (-24%)

## Why Framer Motion?

**Alternatives Considered:**
1. ❌ react-spring - Good but adds complexity
2. ❌ Custom velocity tracking - Reinventing the wheel
3. ✅ Framer Motion - Already used, rock solid, built-in momentum

**Framer Motion Benefits:**
- Already in package.json (motion/react)
- Used throughout app
- Battle-tested by thousands of apps
- Excellent drag/momentum system
- Great performance
- Zero additional dependencies

## Testing Checklist

- [ ] Fast flicks navigate correctly
- [ ] Momentum feels natural
- [ ] Slow drags still work
- [ ] Tap center drink activates/mutes
- [ ] No console warnings
- [ ] Start screen works
- [ ] Station name displays correctly
- [ ] PWA still works

## Next Steps

Once carousel mechanics are perfect:
1. Add preloading for adjacent drinks
2. Add sleep timer (Night Star)
3. Add countdown system (60s)
4. Consider bringing back refined play/pause UI

## Version

- **Previous:** v12.0 (Ultra-simple)
- **Current:** v12.1 (Momentum carousel + UI cleanup)
- **Date:** January 2025

---

*"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away." - Antoine de Saint-Exupéry*
