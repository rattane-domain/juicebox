# Player Logic Revamp - Version 11

## Overview
Complete architectural revamp of the core player logic, separating carousel navigation from audio activation. Users can now scroll freely through drinks without triggering audio changes, and must tap centered drinks to activate them.

## Key Changes

### 1. Fundamental Architecture Change
**Before (v10):**
- Center drink automatically became the active drink
- Adjacent drinks were preloaded
- Switching drinks immediately changed audio

**After (v11):**
- **Center drink ≠ Active drink** (two separate indices)
- Users scroll freely without affecting audio
- Tap centered drink to activate/load it
- Only center drink is preloaded (not adjacent)
- Loading animation always plays when activating

### 2. New State Architecture

#### Separated Indices
```typescript
centerDrinkIndex: number     // Visual center (carousel position)
activeDrinkIndex: number | null  // Audio active (what's playing)
```

The active drink keeps playing while user scrolls through other drinks. Only when user taps a centered inactive drink does that drink become active.

#### Removed State
- `leftAdjacentIndex` - No longer needed
- `rightAdjacentIndex` - No longer needed
- All adjacent preloading logic

#### New State
```typescript
isLoadingDrink: boolean          // TRUE when activating a drink
loadingAnimationStartTime: number | null  // Track minimum animation duration
centerPreloadIndex: number | null         // What we're preloading
```

### 3. Loading Animation System

**Minimum Duration:** 1000ms (1 second)
- Even if drink is already preloaded, loading animation plays for minimum 1 loop
- If drink takes longer to load, animation continues looping
- Ensures visual feedback for every activation

**When Loading Plays:**
1. User taps inactive centered drink → load and activate
2. User taps active muted drink → reload and unmute
3. Loading animation shows on the drink being activated

### 4. New User Interaction Flow

#### Carousel Navigation (Swipe/Tap Zones)
```
Swipe left/right → Move carousel
Tap left 33% → Previous drink
Tap right 33% → Next drink
```
✅ No audio change
✅ Triggers preload of newly centered drink
✅ Active drink keeps playing

#### Centered Drink Tap
```
Tap centered inactive drink → Loading animation → Activate
Tap centered active drink (not muted) → Mute it
Tap centered muted drink → Loading animation → Unmute & reload
```

### 5. Preloading Logic

**New System:**
- Only preload the currently centered drink
- Abort preload immediately when drink leaves center
- Lightweight - keeps app responsive

**Implementation:**
```typescript
// Preload starts when drink becomes centered
centerPreloadIndex = centerDrinkIndex

// Abort signal pattern
const abortSignal = { aborted: false };
preloadAbortRef.current = () => { abortSignal.aborted = true };

// Cleanup when center changes
if (centerPreloadIndex !== targetIndex) {
  preloadAbortRef.current();
}
```

### 6. Removed Features

#### Adjacent Drink Preloading
- ❌ No more left/right adjacent preloading
- ❌ No more 60-second countdown for adjacent streams
- ❌ No more background playing of adjacent streams

**Rationale:** With tap-to-activate and loading animations, preloading becomes less critical. Only preload the one drink user might tap.

#### Auto-Activation
- ❌ Center drink no longer auto-activates
- ❌ No auto-skip on station failure

**Rationale:** User controls when audio changes through explicit taps.

### 7. Core Functions

#### New Functions
```typescript
moveToDrink(targetIndex: number)
  // Visual carousel movement only
  // Triggers center drink preload
  
activateCenteredDrink()
  // Called when user taps centered drink
  // Handles: mute/unmute, load, activate
  // Shows loading animation
```

#### Removed Functions
```typescript
switchToDrink() // Replaced by moveToDrink + activateCenteredDrink
getAdjacentIndices() // No longer needed
getAdjacentStreamStatus() // No longer needed
```

#### Modified Functions
```typescript
togglePlayPause()
  // Still mutes/unmutes
  // 60-second timeout still active (muted stream stops after 60s)
```

### 8. File Changes

#### Modified Files
1. `/hooks/useCoreAudioManager.ts` - Complete rewrite
   - Separated center/active indices
   - Removed adjacent logic
   - Added activateCenteredDrink
   - Added abort-able preloading

2. `/utils/coreEventHandlers.ts` - Complete rewrite
   - New handleCenteredDrinkTap
   - Simplified handleDrinkChange (navigation only)

3. `/App.tsx`
   - Updated to use new hook interface
   - Removed adjacent status indicators
   - Added centered drink tap handler

4. `/components/DrinkCarousel.tsx`
   - Added centered drink tap detection
   - Added loading state prop
   - Tap handlers for centered drink

5. `/components/DrinkIcon.tsx`
   - Added isLoading prop
   - Passes loading state to DrinkRenderer

6. `/components/drinks/DrinkRenderer.tsx`
   - Added isLoading support
   - Priority: loading > active > passive

7. `/constants/drinks.tsx`
   - Added loadingSvg to DrinkDefinition
   - All drinks have loading variants (using active as placeholder)

8. `/components/drinks/svgs/index.tsx`
   - Exported loading variants for all drinks

9. `/constants/app.ts`
   - Updated version to v11

### 9. SVG State System

**Three States:**
```typescript
passive: React.ReactNode  // Inactive drink (grayscale)
active: React.ReactNode   // Playing drink (color)
loading: React.ReactNode  // Loading drink (placeholder: uses active)
```

**Future:** Replace loading variants with actual loading animation SVGs

### 10. Preserved Features

✅ Mute-based pause system (60s timeout)
✅ Sleep timer for Night Star drink
✅ Volume control
✅ Screen-based navigation (left/right 33%)
✅ Swipe gestures
✅ PWA status bar colors
✅ Mobile debugging
✅ Theme system

### 11. Technical Debt Removed

- ❌ Adjacent stream preloading complexity
- ❌ Race condition guards for auto-switching
- ❌ switchToDrink serialization logic
- ❌ Background stream management
- ❌ Adjacent index calculation everywhere

**Result:** ~400 lines of code removed, simpler mental model, clearer user intent.

### 12. User Experience Impact

**Before:**
- Swipe/tap zones → Audio immediately changes
- Fast scrolling was discouraged (loaded too many streams)
- Accidental audio changes were common

**After:**
- Swipe/tap zones → Only visual change (fast & fluid)
- Tap centered drink → Deliberate audio activation
- Loading animation → Clear feedback
- Can scroll super fast without audio chaos

### 13. Performance Benefits

1. **Fewer Audio Streams:** Only 2 streams max (active + preload)
   - Before: Up to 3-5 streams (active + 2 adjacent + buffering)

2. **Abort-able Preloading:** No wasted loading
   - User scrolls away → Load aborted immediately

3. **Simpler State:** Less complex state management
   - Removed: switching guards, race protection, queue management

4. **Lighter Memory:** Fewer audio elements in DOM

### 14. Migration Notes

**Breaking Changes:**
- `switchToDrink()` removed → Use `moveToDrink()` + `activateCenteredDrink()`
- `leftAdjacentIndex` removed
- `rightAdjacentIndex` removed
- `getAdjacentStreamStatus()` removed

**Compatible:**
- `togglePlayPause()` still works the same
- `isPlaying` still reflects audio state
- `currentStation` still shows active station
- `activeDrinkIndices` still shows which drinks are active (for visual state)

### 15. Testing Checklist

- [x] Carousel navigation doesn't change audio
- [x] Tap centered inactive drink activates it with loading animation
- [x] Tap centered active drink mutes it
- [x] Tap centered muted drink reloads with loading animation
- [x] Active drink keeps playing while scrolling
- [x] Preload aborts when leaving center
- [x] Minimum loading animation duration enforced
- [x] Already-preloaded drinks still show loading animation
- [x] 60-second mute timeout still works
- [x] Sleep timer still works
- [x] Start screen still works
- [x] Screen tap zones still work
- [x] Swipe gestures still work

### 16. Known Limitations

1. **Loading SVGs are placeholders:** Currently using active SVGs as loading variants
   - Future: Import actual loading animation SVGs from Figma

2. **No visual distinction between center and active:** When they differ, only info panel shows it
   - Future: Could add subtle indicator on carousel

3. **Loading animation duration hardcoded:** Set to 1000ms
   - Future: Calculate from actual SVG animation duration

### 17. Future Enhancements

1. Import actual loading animation SVGs from Figma
2. Add visual indicator when center ≠ active
3. Smooth crossfade between drinks (currently instant switch)
4. Consider haptic feedback on drink activation
5. Add error state SVG variant for failed loads

---

## Summary

This is the most significant architectural change since the app's inception. It fundamentally changes how users interact with Juicebox:

**Old Model:** Scroll = Audio Change (coupled)
**New Model:** Scroll = Visual Only, Tap = Audio Change (decoupled)

This makes the app more intentional, performant, and delightful. Users have complete control over when audio changes, and the app responds only to deliberate actions.

Version 11 represents a major milestone in the app's evolution toward a truly fluid, user-controlled experience.
