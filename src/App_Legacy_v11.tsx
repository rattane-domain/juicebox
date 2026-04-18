import React, { useEffect, useState } from 'react';
import DrinkCarousel from './components/DrinkCarousel';
import AnimatedShaker from './components/AnimatedShaker';
import StartScreen from './components/StartScreen';
import { useUserInteraction } from './hooks/useUserInteraction';
import { useCoreAudioManager } from './hooks/useCoreAudioManager';
import { useVisualCarousel } from './hooks/useVisualCarousel';
import { useTheme } from './hooks/useTheme';
import { APP_VERSION, drinkCategories } from './constants/app';
import { createCoreEventHandlers } from './utils/coreEventHandlers';
import { initMobileDebugging } from './utils/mobileDebug';

/**
 * LEGACY v11.1.3 - BACKED UP FOR REFERENCE
 * This version had complex preloading, separate visual/audio indices, etc.
 * Replaced with ultra-simple version for rock-solid mechanics.
 */

export default function App_Legacy() {
  const { userInteracted, hasAudioContext, setUserInteracted } = useUserInteraction(null);
  const { isDarkMode } = useTheme();
  
  // Start screen state
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [startScreenCompleted, setStartScreenCompleted] = useState(false);
  const [isFirstStationLoading, setIsFirstStationLoading] = useState(false);
  
  // Sleep timer display delay state
  const [sleepTimerVisible, setSleepTimerVisible] = useState(false);
  
  // Core audio management system - NEW ARCHITECTURE: separated center/active indices
  const {
    centerDrinkIndex, // Visual center (what carousel shows)
    activeDrinkIndex, // Audio active (what's playing) - can be different!
    isPlaying,
    isLoading, // TRUE when loading a drink activation
    currentStation,
    activeDrinkIndices, // Array with activeDrinkIndex (or empty if none)
    countdownActive,
    countdownSeconds,
    sleepTimerActive,
    sleepTimerSeconds,
    sleepTimerDrinkIndex,
    moveToDrink, // NEW: Move carousel (visual only, triggers preload)
    activateCenteredDrink, // NEW: Tap to activate centered drink
    togglePlayPause, // Mute/unmute active drink
    setVolume,
    getStreamStatus,
    coreState
  } = useCoreAudioManager(userInteracted, hasAudioContext);

  // Visual carousel system (separate from audio)
  const {
    visualIndex,
    isAnimating,
    transitionToIndex,
    handleSwipeLeft,
    handleSwipeRight,
    handleAdjacentTap
  } = useVisualCarousel(drinkCategories.length);

  // Core event handlers that bridge audio and visual systems - NEW ARCHITECTURE
  const {
    handleDrinkChange, // Swipe/navigation only (doesn't change audio)
    handleCenteredDrinkTap, // NEW: Tap centered drink to activate
    syncVisualToAudio,
    isSwitching
  } = createCoreEventHandlers({
    moveToDrink, // NEW: Visual movement
    activateCenteredDrink, // NEW: Tap to activate
    togglePlayPause,
    centerDrinkIndex,
    activeDrinkIndex, // NEW: Separate audio active index
    isPlaying,
    visualIndex,
    handleSwipeLeft,
    handleSwipeRight,
    transitionToIndex,
    setUserInteracted,
    totalDrinks: drinkCategories.length
  });

  // ... rest of legacy code omitted for brevity ...
  
  return <div>Legacy v11.1.3</div>;
}
