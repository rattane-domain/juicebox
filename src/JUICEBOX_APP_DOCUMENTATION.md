# Juicebox Radio App - Complete Documentation

## Overview

Juicebox is a unique 3D carousel-based radio app where different drinks represent music categories/radio stations. Users navigate through drinks in a 3D carousel interface, with the active/centered drink playing its associated radio station. The app features a mute-based pause system, race-proof audio switching, and PWA capabilities.

## Core Concept

- **Drinks as Stations**: Each drink represents a specific radio station/music genre
- **3D Carousel Interface**: Drinks are arranged in a 3D carousel with depth and perspective
- **Active/Passive States**: Center drink is "active" (colorful), others are "passive" (grayscale)
- **Mute-Based Pause**: Instead of stopping streams, the app mutes them for faster switching

## App Architecture

### 1. State Management Systems

#### Core Audio Manager (`useCoreAudioManager`)
```pseudocode
CoreAudioManager {
  // Position tracking
  centerDrinkIndex: number
  leftAdjacentIndex: number  
  rightAdjacentIndex: number
  
  // Audio state
  activeStream: AudioStream | null
  targetStream: AudioStream | null
  isMuted: boolean
  isPlaying: boolean (computed: !isMuted && !paused)
  
  // Loading states
  isTargetLoading: boolean
  isActiveBuffering: boolean
  
  // Sleep timer (for Night Star drink)
  sleepTimer: {
    active: boolean
    remainingSeconds: number
    drinkIndex: number | null
    fadingOut: boolean
  }
  
  // Resource management
  streams: Map<drinkIndex, AudioStream>
  MAX_CONCURRENT_STREAMS: 5
  
  // Race protection
  switchController: SwitchController
  
  functions {
    switchToDrink(targetIndex) // Race-proof switching
    togglePlayPause() // Mute/unmute toggle
    loadStation(drinkIndex) // Load audio stream
    makeStreamActive(stream) // Activate stream with volume control
  }
}
```

#### Visual Carousel (`useVisualCarousel`)
```pseudocode
VisualCarousel {
  visualIndex: number
  isAnimating: boolean
  
  functions {
    transitionToIndex(index)
    handleSwipeLeft()
    handleSwipeRight() 
    handleAdjacentTap(direction)
  }
}
```

#### Core Event Handlers (`createCoreEventHandlers`)
```pseudocode
EventHandlers {
  handleDrinkChange(direction: 'left' | 'right')
  handleDrinkTap(index)
  handleBackgroundTap() // Toggle play/pause
  syncVisualToAudio(audioIndex, immediate)
}
```

### 2. Component Hierarchy

```
App
├── StartScreen (initial interaction)
│   ├── Volume control
│   ├── First swipe trigger
│   └── Completion handler
│
├── DrinkCarousel (main interface)
│   ├── 3D positioning system
│   ├── Individual drinks
│   ├── Touch/swipe handling
│   └── Visual state management
│
├── AnimatedShaker (loading indicator)
│   ├── Size: 44px normal, 56px for first load
│   ├── Position: top-left (32px from top, 24px from left)
│   └── Shows during any station loading
│
├── Information Panel (top-right overlay)
│   ├── Current drink name
│   ├── Station name (max 20 chars)
│   ├── Target stream indicator
│   ├── Adjacent stream status dots
│   └── App version
│
└── Sleep Timer Display (center overlay)
    ├── Shows 2 seconds after activation
    ├── Position: center top (-128px from center)
    └── Format: "Sleep: MM:SS"
```

## UI Layout & Positioning

### Screen Layout
```
┌─────────────────────────────────────┐ ← Safe area top
│  [Shaker]                    [Info] │ ← 32px from top
│                                     │
│                                     │
│            [Sleep Timer]            │ ← Center top -128px
│                                     │
│                                     │
│         ┌─────────────────┐         │
│         │                 │         │ ← 3D Carousel
│         │   🍹  🍸  🥤   │         │   Fill remaining space
│         │                 │         │
│         └─────────────────┘         │
│                                     │
│                                     │
└─────────────────────────────────────┘ ← Safe area bottom
```

### Touch Zones
```
┌─────────────────────────────────────┐
│←────33%────→│←──34%──→│←────33%────→│
│             │         │             │
│    LEFT     │ CENTER  │    RIGHT    │
│   ZONE      │ (NONE)  │    ZONE     │
│             │         │             │
│  Prev drink │         │ Next drink  │
│             │         │             │
└─────────────────────────────────────┘
```

### Component Sizes

#### AnimatedShaker
- **Normal loading**: 44px × 44px
- **First station loading**: 56px × 56px
- **Position**: `top-8 left-6` (32px top, 24px left)
- **Z-index**: 10

#### Information Panel
- **Position**: `top-6 right-4` (24px top, 16px right)
- **Font size**: 10px
- **Max width**: `max-w-xs` (320px)
- **Background**: `bg-background/90` with rounded corners
- **Z-index**: 10

#### Sleep Timer
- **Position**: Center horizontally, `transform -translate-y-32` (-128px from center)
- **Font size**: 10px
- **Background**: `bg-background/90 p-2 rounded`
- **Z-index**: 10
- **Visibility**: 2-second delay after activation

#### Drink SVGs
- **Base size**: 70px × 70px (CSS variable `--drink-svg-base-size`)
- **Container**: 90px × 90px (base size + 20px padding)
- **Max dimension sum**: 140px (CSS variable `--drink-svg-max-dimension-sum`)

## Interaction Systems

### 1. Touch Navigation

#### Screen-Based Navigation
```pseudocode
handleScreenTouch(touchEvent) {
  screenWidth = window.innerWidth
  touchX = touch.clientX
  
  leftZone = screenWidth * 0.33
  rightZone = screenWidth * 0.67
  
  if (touchX < leftZone) {
    // Move to previous drink (left drink in carousel)
    handleDrinkChange('right')
  } else if (touchX > rightZone) {
    // Move to next drink (right drink in carousel)  
    handleDrinkChange('left')
  }
  // Center zone does nothing
}
```

#### Swipe Gestures
- **Swipe detection**: Minimum movement threshold to distinguish from taps
- **Direction mapping**: 
  - Swipe left → Move to next drink
  - Swipe right → Move to previous drink

#### Drink-Specific Interactions
```pseudocode
DrinkInteraction {
  onDrinkTap(drinkIndex) {
    if (drinkIndex === centerDrinkIndex) {
      togglePlayPause() // Center drink tap = play/pause
    } else {
      switchToDrink(drinkIndex) // Adjacent drink tap = switch
    }
  }
  
  onBackgroundTap() {
    togglePlayPause() // Background tap = play/pause
  }
}
```

### 2. Audio Management

#### Stream Lifecycle
```pseudocode
StreamLifecycle {
  1. CREATE: getOrCreateStream(drinkIndex)
     - New Audio() element
     - Set to muted, volume 0
     - Add to streams registry
  
  2. LOAD: loadStation(drinkIndex)
     - Fetch station config
     - Set audio source URL
     - Wait for 'canplay' event (10s timeout)
     - Keep muted during load
  
  3. ACTIVATE: makeStreamActive(stream)
     - Stop all other streams
     - Configure volume based on mute state
     - Play if paused
     - Update active stream reference
  
  4. CLEANUP: cleanupStream(stream)
     - Remove event handlers
     - Clear source, pause, reset
     - Add restart prevention blocker
}
```

#### Race-Proof Switching
```pseudocode
SwitchController {
  pendingSwitch: number | null
  isProcessing: boolean
  debounceTimeout: timeout | null
  
  requestSwitch(targetIndex) {
    if (isProcessing) {
      pendingSwitch = targetIndex // Queue latest request
      return
    }
    
    if (timeSinceLastSwitch < 150ms) {
      debounceTimeout = setTimeout(execute, 150ms - elapsed)
      return  
    }
    
    executeSwitch(targetIndex)
  }
  
  executeSwitch(targetIndex) {
    isProcessing = true
    await switchToDrinkInternal(targetIndex)
    
    if (pendingSwitch !== null) {
      processQueuedSwitch() // Handle pending request
    } else {
      isProcessing = false
    }
  }
}
```

#### Mute-Based Pause System
```pseudocode
MutePauseSystem {
  // Instead of pausing streams, mute them for faster switching
  
  togglePlayPause() {
    newMutedState = !currentState.isMuted
    
    if (newMutedState) {
      audio.muted = true
      audio.volume = 0
      startMuteTimeout(4_minutes) // Mark for reload after 4min
    } else {
      clearMuteTimeout()
      
      if (wasMutedLongTime) {
        reloadStreamAfterLongMute() // Refresh stale stream
      } else {
        audio.muted = false
        audio.volume = targetVolume
        if (audio.paused) audio.play()
      }
    }
  }
}
```

### 3. Resource Management

#### Stream Limits
- **Maximum concurrent streams**: 5
- **Protected streams**: Center, left adjacent, right adjacent, active, target
- **Cleanup strategy**: Remove oldest unprotected streams when limit exceeded

#### Memory Management
```pseudocode
StreamCleanup {
  protectedIndices = Set([
    centerDrinkIndex,
    leftAdjacentIndex, 
    rightAdjacentIndex,
    activeStream?.drinkIndex,
    targetStream?.drinkIndex
  ])
  
  unprotectedStreams = allStreams.filter(index => 
    !protectedIndices.has(index)
  )
  
  if (streamCount > MAX_CONCURRENT_STREAMS) {
    oldestStreams = unprotectedStreams.sortByLastUsed().take(excess)
    oldestStreams.forEach(cleanupStream)
  }
}
```

## Special Features

### 1. Sleep Timer (Night Star Drink)
```pseudocode
SleepTimer {
  duration: 33_minutes (1980 seconds)
  fadeStart: last_30_seconds
  
  activation {
    when: switchToDrink(nightStarIndex)
    display: 2_second_delay
    position: center_top_-128px
  }
  
  fadeOut {
    startTime: 30_seconds_remaining
    duration: 30_seconds
    method: gradual_volume_reduction
  }
  
  completion {
    action: pause_and_mute_stream
    state: set_isMuted_true
  }
}
```

### 2. PWA Features

#### Status Bar Management
```pseudocode
StatusBarUpdater {
  colors: {
    light: '#F1F1F1'
    dark: '#9C9C9C'
  }
  
  updateStatusBar() {
    if (isPWA || isMobileSafari) {
      currentColor = getComputedStyle('--status-bar-color')
      updateMetaTags(currentColor)
      updateAppleStyle(isDarkMode ? 'black-translucent' : 'default')
    }
  }
  
  frequency: every_1000ms
}
```

#### Safe Area Handling
```css
.safe-area-top { padding-top: env(safe-area-inset-top); }
.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
.safe-area-left { padding-left: env(safe-area-inset-left); }
.safe-area-right { padding-right: env(safe-area-inset-right); }
```

### 3. Start Screen Flow
```pseudocode
StartScreenFlow {
  initial: showStartScreen = true
  
  onFirstSwipe() {
    setIsFirstStationLoading(true)
    switchToDrink(0) // Load first station
  }
  
  onComplete() {
    setShowStartScreen(false)
    setStartScreenCompleted(true)
    
    if (!isPlaying && userInteracted) {
      togglePlayPause() // Ensure first station plays
    }
  }
}
```

## Data Structure

### Drink Configuration
```typescript
interface DrinkCategory {
  id: string            // 'juicebox', 'martini', etc.
  displayName: string   // 'Juicebox', 'Martini', etc.  
  stationName: string   // 'Groove Salad', 'FIP', etc.
}

interface DrinkRegistry {
  id: string
  displayName: string
  sleepTimer?: {
    enabled: boolean
    durationMinutes: number
  }
}
```

### Audio Stream Structure
```typescript
interface AudioStream {
  audio: HTMLAudioElement
  station: RadioStation | null
  isLoaded: boolean
  isLoading: boolean
  drinkId: string
  drinkIndex: number
}
```

### Core State Structure  
```typescript
interface CoreAudioState {
  // Positions
  centerDrinkIndex: number
  leftAdjacentIndex: number
  rightAdjacentIndex: number
  
  // Audio state  
  activeStream: AudioStream | null
  targetStream: AudioStream | null
  isMuted: boolean
  wasMutedLongTime: boolean
  
  // Loading states
  isTargetLoading: boolean
  isActiveBuffering: boolean
  
  // Sleep timer
  sleepTimer: {
    active: boolean
    remainingSeconds: number
    drinkIndex: number | null
    fadingOut: boolean
    paused: boolean
  }
  
  // System state
  systemInitialized: boolean
  userHasInteracted: boolean
  globalVolumeOverride: number | null
}
```

## Performance Optimizations

### 1. Audio Preloading
- **Adjacent streams**: Preload left and right adjacent drinks with 1-second delay
- **Background loading**: Load streams while muted for instant switching
- **Timeout handling**: 10-second load timeout with fallback

### 2. Touch Optimization
```css
/* Touch optimizations */
-webkit-touch-callout: none;
-webkit-text-size-adjust: 100%;  
-webkit-tap-highlight-color: transparent;
user-select: none;
overscroll-behavior: none;
touch-action: manipulation;
```

### 3. Memory Management
- **Stream limits**: Maximum 5 concurrent streams
- **Aggressive cleanup**: Remove unused streams beyond limits
- **Event handler cleanup**: Prevent memory leaks on stream disposal

## Debugging Features

### 1. Adjacent Stream Status Dots
```pseudocode
AdjacentStatusDots {
  leftDot: indicates_left_adjacent_stream_status
  rightDot: indicates_right_adjacent_stream_status
  
  opacity_levels: {
    0%: unknown (not loaded)
    50%: loaded but stopped  
    70%: loading (with pulse animation)
    100%: loaded and playing in background
  }
}
```

### 2. Console Logging
- **State changes**: Audio/visual sync, switching operations
- **Stream lifecycle**: Load, activate, cleanup events
- **User interactions**: Touch zones, gesture detection
- **Error handling**: Load failures, timeout events

## Theme System

### Color Variables
```css
:root {
  --background: #F1F1F1;
  --foreground: oklch(0.145 0 0);
  --status-bar-color: #F1F1F1;
  /* ... additional variables */
}

.dark {
  --background: #9C9C9C;
  --foreground: oklch(0.985 0 0);
  --status-bar-color: #9C9C9C;
  /* ... dark theme overrides */
}
```

### Typography
```css
/* Base font size */
html { font-size: 14px; }

/* Component-specific sizes */
.info-panel { font-size: 10px; }
.sleep-timer { font-size: 10px; }
```

## Mobile & PWA Considerations

### 1. Viewport Handling
```css
height: 100vh; /* Fallback */
height: 100dvh; /* Dynamic viewport height */
height: -webkit-fill-available; /* iOS Safari support */
```

### 2. Touch Event Handling
- **Touch manipulation**: Prevent zoom, enable smooth scrolling
- **Gesture detection**: Distinguish between taps and swipes
- **Zone-based navigation**: Screen divided into interaction zones

### 3. Status Bar Integration
- **Dynamic colors**: Update based on theme changes
- **PWA detection**: Different handling for standalone mode
- **iOS optimization**: Apple-specific status bar styles

## Error Handling

### 1. Audio Loading Failures
```pseudocode
AudioErrorHandling {
  timeout: 10_seconds_per_stream
  
  onLoadError(stream) {
    cleanup(stream)
    markAsFailedToLoad()
    // Do not auto-skip, user interaction required
  }
  
  onPlayError(stream) {
    if (error.name === 'NotAllowedError') {
      // Autoplay blocked, wait for user interaction
      showWaitingState()
    } else {
      // Other playback error
      handlePlaybackFailure()
    }
  }
}
```

### 2. State Recovery
- **Race condition prevention**: Switch controller serialization
- **Stream recovery**: Reload after long mute periods
- **UI consistency**: Visual/audio state synchronization

This documentation covers the complete Juicebox app architecture, providing a comprehensive reference for rebuilding or understanding the system. The app combines complex audio management with intuitive 3D visual interface, optimized for mobile PWA usage.