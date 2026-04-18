import React, { useState, useEffect } from 'react';
import SimpleCarousel from './components/SimpleCarousel';
import StartScreen from './components/StartScreen';
import AnimatedShaker from './components/AnimatedShaker';
import { useSimpleCarousel } from './hooks/useSimpleCarousel';
import { useSimplePlayer } from './hooks/useSimplePlayer';
import { useUserInteraction } from './hooks/useUserInteraction';
import { useTheme } from './hooks/useTheme';
import { DRINK_REGISTRY } from './constants/drinks';
import { APP_VERSION } from './constants/app';

/**
 * ULTRA-SIMPLE JUICEBOX APP
 * 
 * Core Mechanics:
 * 1. Carousel: Swipe left/right, always snaps to center
 * 2. Player: Tap active center = mute, Tap passive center = activate
 * 
 * No complexity, no workarounds, rock solid.
 */

export default function App() {
  const { userInteracted, setUserInteracted } = useUserInteraction(null);
  const { isDarkMode } = useTheme();
  
  // Start screen
  const [showStartScreen, setShowStartScreen] = useState(true);

  // Player (one audio element, simple)
  const {
    activeDrinkIndex,
    isLoading,
    isMuted,
    isPlaying,
    activateDrink,
    toggleMute
  } = useSimplePlayer(userInteracted);

  // Carousel (visual only)
  const {
    centerIndex,
    isAnimating,
    swipeLeft,
    swipeRight
  } = useSimpleCarousel({
    totalDrinks: DRINK_REGISTRY.length,
    onCenterDrinkStable: (index) => {
      console.log(`🎠 Carousel stable at drink ${index}`);
      // Could trigger preloading here if needed
    }
  });

  // Handle start screen completion
  const handleStartScreenComplete = () => {
    console.log('🚀 Start screen completed');
    setShowStartScreen(false);
    setUserInteracted(true);
    
    // Activate first drink
    activateDrink(0);
  };

  // Handle center drink tap
  const handleCenterTap = () => {
    // Case 1: Active drink is centered and playing → Toggle mute
    if (centerIndex === activeDrinkIndex && isPlaying) {
      console.log('👆 Tapped active center drink → Toggle mute');
      toggleMute();
      return;
    }

    // Case 2: Passive drink is centered → Activate it
    if (centerIndex !== activeDrinkIndex && userInteracted) {
      console.log(`👆 Tapped passive center drink ${centerIndex} → Activate`);
      activateDrink(centerIndex);
      return;
    }

    console.log('⚠️ Center tap ignored (not ready)');
  };

  // Active drink indices (for visual state)
  const activeDrinkIndices = activeDrinkIndex !== null ? [activeDrinkIndex] : [];
  const loadingDrinkIndex = isLoading ? centerIndex : null;

  // PWA status bar color
  useEffect(() => {
    const statusBarColor = isDarkMode ? '#9C9C9C' : '#F1F1F1';
    const meta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (meta) {
      meta.content = statusBarColor;
    }
  }, [isDarkMode]);

  return (
    <div className={`w-screen h-screen overflow-hidden relative ${isDarkMode ? 'dark' : ''}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-background transition-colors duration-300" />

      {/* Start Screen */}
      {showStartScreen && (
        <StartScreen
          onComplete={handleStartScreenComplete}
          onFirstSwipe={() => console.log('First swipe detected')}
          userInteracted={userInteracted}
          isFirstStationLoading={false}
        />
      )}

      {/* Main App */}
      {!showStartScreen && (
        <div className="relative w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex-none h-[60px] flex items-center justify-between px-6 pt-safe">
            <button
              onClick={() => {/* Theme toggle */}}
              className="p-2 rounded-full hover:bg-black/5 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            
            <div className="text-sm opacity-50">
              {APP_VERSION}
            </div>
          </div>

          {/* Carousel (full screen) */}
          <div className="flex-1 relative">
            <SimpleCarousel
              centerIndex={centerIndex}
              isAnimating={isAnimating}
              activeDrinkIndex={activeDrinkIndex}
              loadingDrinkIndex={loadingDrinkIndex}
              onSwipeLeft={swipeLeft}
              onSwipeRight={swipeRight}
              onCenterTap={handleCenterTap}
            />
          </div>

          {/* Footer Controls */}
          <div className="flex-none h-[140px] flex flex-col items-center justify-center pb-safe">
            {/* Station Name */}
            {activeDrinkIndex !== null && (
              <div className="text-center mb-4">
                <div className="text-sm opacity-70">
                  {DRINK_REGISTRY[activeDrinkIndex].displayName}
                </div>
              </div>
            )}

            {/* Play/Pause Button */}
            <AnimatedShaker
              isActive={isPlaying && !isMuted}
              onClick={handleCenterTap}
              className="cursor-pointer"
            />

            {/* Status */}
            <div className="text-xs opacity-50 mt-4">
              {isLoading && 'Loading...'}
              {isPlaying && isMuted && 'Paused'}
              {isPlaying && !isMuted && 'Playing'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
