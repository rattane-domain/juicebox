import React, { useState, useEffect, useRef } from 'react';
// NEW V2: Physical carousel with iOS-style wheel and improved tap timing
import DrinkCarouselV2 from './components/DrinkCarouselV2';
import DrinkGridView from './components/DrinkGridView';
// LEGACY: Old carousel (can be deleted once V2 is stable)
// import SimpleCarousel from './components/SimpleCarousel';
import StartScreen from './components/StartScreen';
import PasswordGate from './components/PasswordGate';
import StationDisplay from './components/StationDisplay';
import PwaInstallToast from './components/PwaInstallToast';
import { usePhysicalCarousel } from './hooks/usePhysicalCarousel';
// LEGACY: Old carousel hook (can be deleted once V2 is stable)
// import { useSimpleCarousel } from './hooks/useSimpleCarousel';
import { useSimplePlayer } from './hooks/useSimplePlayer';
import { useUserInteraction } from './hooks/useUserInteraction';
import { useTheme } from './hooks/useTheme';
import { useSleepTimer } from './hooks/useSleepTimer';
import { useMediaSession } from './hooks/useMediaSession';
import { DRINK_REGISTRY, getDrinkStationConfig } from './constants/drinks';
import { APP_VERSION } from './constants/app';
import { initMobileDebugging } from './utils/mobileDebug';

/**
 * JUICEBOX APP v16.1 - RACE CONDITION FIX
 * 
 * Core Mechanics:
 * 1. Carousel V2: Two modes
 *    - SWIPE: iOS-style wheel with physics and momentum
 *    - TAP: Immediate state changes with smooth spring animations
 * 2. Player: Tap active center = mute, Tap passive center = activate
 * 3. Station Display: Smart animations for active/upcoming stations
 * 
 * v16.1 Changes (Critical Bug Fix):
 * - Fixed startup loading race condition using ref instead of state
 * - userInteractedRef provides synchronous access (no closure issues)
 * - activateDrink no longer has userInteracted in dependency array
 * - First drink now reliably loads on startup screen swipe
 * 
 * v12.6 Changes:
 * - New StationDisplay component with smart animations
 * - Typing animation for upcoming station changes
 * - Snap-in animation for active station changes
 * - Pulsing for loading states
 * - Opacity states for playing/paused
 */

export default function App() {
  const { userInteracted, userInteractedRef, setUserInteracted } = useUserInteraction(null);
  const { isDarkMode } = useTheme();
  
  // Password gate (disabled if no VITE_PASSWORD env var set)
  const [unlocked, setUnlocked] = useState(!import.meta.env.VITE_PASSWORD);

  // Start screen
  const [showStartScreen, setShowStartScreen] = useState(true);

  // Prevent accidental center tap immediately after startup swipe
  const justLaunchedRef = useRef(false);

  // Track which drink is loading
  const [loadingDrinkIndex, setLoadingDrinkIndex] = useState<number | null>(null);
  
  // Hint for passive drinks
  const [showTapHint, setShowTapHint] = useState(false);

  // View mode: carousel (default) or grid
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');

  // Prevent re-triggering shuffle during slot animation
  const isShufflingRef = useRef(false);

  // Player (one audio element, simple)
  // ✅ v16.1: Pass ref instead of state to fix race condition
  const {
    activeDrinkIndex,
    isLoading,
    isMuted,
    isPlaying,
    currentStation,
    activateDrink,
    toggleMute
  } = useSimplePlayer(userInteractedRef);

  // Carousel V2 (physical interactions with continuous animation)
  const {
    centerIndex,
    centerIndexRef, // ✅ FIX: Get ref for synchronous access
    isAnimating,
    swipeLeft,
    swipeRight,
    navigateTo,
    handleSwipeEnd
  } = usePhysicalCarousel({
    totalDrinks: DRINK_REGISTRY.length,
    onCenterDrinkStable: (index) => {
      console.log(`🎠 Carousel stable at drink ${index}`);
      // Could trigger preloading here if needed
    }
  });

  // Sleep Timer (for drinks with sleep functionality)
  const sleepTimer = useSleepTimer({
    activeDrinkIndex,
    isPlaying: isPlaying && !isMuted,
    onSleepTimerComplete: () => {
      console.log('🌙 Sleep timer completed, fading out and stopping...');
      toggleMute(); // Mute the drink (which shows it as paused/grayed out)
    }
  });

  // Media Session API for iOS Lock Screen controls
  useMediaSession({
    currentStation,
    activeDrinkIndex,
    isPlaying,
    isMuted,
    onPlay: () => {
      // Only unmute if we have an active drink
      if (activeDrinkIndex !== null && isMuted) {
        toggleMute();
      }
    },
    onPause: () => {
      // Only mute if we have an active drink
      if (activeDrinkIndex !== null && !isMuted) {
        toggleMute();
      }
    },
    onNextTrack: async () => {
      // Skip to next station
      const totalDrinks = DRINK_REGISTRY.length;
      const nextIndex = (centerIndex + 1) % totalDrinks;
      
      console.log(`📱 Media Session: Skipping to next station (${nextIndex})`);
      
      // Swipe right (which centers the next drink)
      swipeRight();
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Activate the new centered drink
      if (userInteracted) {
        setLoadingDrinkIndex(nextIndex);
        await activateDrink(nextIndex);
        setLoadingDrinkIndex(null);
      }
    },
    onPreviousTrack: async () => {
      // Skip to previous station
      const totalDrinks = DRINK_REGISTRY.length;
      const prevIndex = (centerIndex - 1 + totalDrinks) % totalDrinks;
      
      console.log(`📱 Media Session: Skipping to previous station (${prevIndex})`);
      
      // Swipe left (which centers the previous drink)
      swipeLeft();
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Activate the new centered drink
      if (userInteracted) {
        setLoadingDrinkIndex(prevIndex);
        await activateDrink(prevIndex);
        setLoadingDrinkIndex(null);
      }
    }
  });

  // iOS Audio Preparation - called during user gesture
  const handleFirstSwipe = async () => {
    console.log('📱 iOS: First swipe - preparing audio context');
    // ✅ v16.1: setUserInteracted now updates both ref (sync) and state (async)
    setUserInteracted(true);
    
    // iOS FIX: Start loading first drink IMMEDIATELY during user gesture
    // This is critical for iOS Safari - audio must start during user interaction
    setLoadingDrinkIndex(0);
    
    // Start loading the first drink in the background
    // This happens during the swipe gesture, so iOS allows it
    // ✅ v16.1: activateDrink now checks userInteractedRef.current (always current!)
    try {
      await activateDrink(0);
      // Clear loading state after successful activation
      setLoadingDrinkIndex(null);
      console.log('✅ First drink loaded and loading state cleared');
    } catch (error) {
      console.error('❌ iOS: Failed to preload first drink:', error);
      setLoadingDrinkIndex(null);
    }
  };

  // Handle start screen completion
  const handleStartScreenComplete = async () => {
    console.log('🚀 Start screen completed');
    setShowStartScreen(false);

    // Block center taps for 600ms to prevent the startup swipe's
    // pointer-up from accidentally triggering mute on the main app
    justLaunchedRef.current = true;
    setTimeout(() => { justLaunchedRef.current = false; }, 600);

    // Note: First drink is already loading from handleFirstSwipe
    // Just clear loading state if it's done
    if (activeDrinkIndex === 0) {
      setLoadingDrinkIndex(null);
    }
  };

  // Handle center drink tap
  const handleCenterTap = async () => {
    // Don't allow center tap during shuffle animation
    if (isShufflingRef.current) return;

    // Don't allow center tap during animation (swipes should work, but not center tap)
    if (isAnimating) {
      console.log('⚠️ Center tap ignored (carousel animating)');
      return;
    }

    // Don't allow tap in the first 600ms after startup (prevents swipe bleed-through)
    if (justLaunchedRef.current) {
      console.log('⚠️ Center tap ignored (just launched)');
      return;
    }
    
    // Hide hint immediately on tap
    setShowTapHint(false);
    
    // ✅ FIX: Use ref instead of state to avoid race condition on Windows
    // The ref is updated synchronously, while state updates are batched
    // This fixes the bug where clicking fast shows music from previous glass
    const currentCenterIndex = centerIndexRef.current;
    
    // Case 1: Active drink is centered → Toggle mute
    if (currentCenterIndex === activeDrinkIndex) {
      console.log('👆 Tapped active center drink → Toggle mute');
      toggleMute();
      return;
    }

    // Case 2: Passive drink is centered → Activate it
    if (currentCenterIndex !== activeDrinkIndex && userInteracted) {
      console.log(`👆 Tapped passive center drink ${currentCenterIndex} → Activate`);
      setLoadingDrinkIndex(currentCenterIndex);
      await activateDrink(currentCenterIndex);
      setLoadingDrinkIndex(null);
      return;
    }

    console.log('⚠️ Center tap ignored (not ready)');
  };

  const handleShuffle = () => {
    if (isShufflingRef.current) return;
    isShufflingRef.current = true;

    const total = DRINK_REGISTRY.length;
    const startIndex = centerIndexRef.current;
    let target;
    do { target = Math.floor(Math.random() * total); } while (target === startIndex && total > 1);

    // Half rotation as base, plus steps to target (max ~1.5 rotations)
    const half = Math.ceil(total / 2);
    let stepsToTarget = ((target - startIndex + total) % total) || half;
    if (stepsToTarget < 3) stepsToTarget += half;
    const totalSteps = half + stepsToTarget;

    // The carousel advances totalSteps positions from startIndex — that's what actually plays
    const landingIndex = (startIndex + totalSteps) % total;

    // All steps at 60ms except last 3 which slow down like a slot machine
    const delays = Array.from({ length: totalSteps }, (_, i) => {
      if (i === totalSteps - 3) return 140;
      if (i === totalSteps - 2) return 290;
      if (i === totalSteps - 1) return 480;
      return 60;
    });

    let step = 0;
    const tick = () => {
      navigateTo((centerIndexRef.current + 1) % total);
      step++;
      if (step < totalSteps) {
        setTimeout(tick, delays[step]);
      } else {
        // Landed — load and play (keep isShufflingRef true until done to block handleCenterTap)
        if (userInteracted) {
          setLoadingDrinkIndex(landingIndex);
          activateDrink(landingIndex)
            .then(() => setLoadingDrinkIndex(null))
            .finally(() => { isShufflingRef.current = false; });
        } else {
          isShufflingRef.current = false;
        }
      }
    };
    setTimeout(tick, delays[0]);
  };

  const handleGridTap = async (index: number) => {
    if (index === activeDrinkIndex) {
      toggleMute();
      return;
    }
    navigateTo(index);
    if (userInteracted) {
      setLoadingDrinkIndex(index);
      await activateDrink(index);
      setLoadingDrinkIndex(null);
    }
  };

  // Initialize mobile debugging
  useEffect(() => {
    initMobileDebugging();
  }, []);

  // PWA status bar color - Update theme-color meta tag dynamically
  useEffect(() => {
    const statusBarColor = isDarkMode ? '#9C9C9C' : '#F1F1F1';
    
    // Update theme-color meta tag (Android and some iOS contexts)
    const themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (themeColorMeta) {
      themeColorMeta.content = statusBarColor;
    }
    
    // For iOS, also update the status bar style dynamically
    // Note: This only works in Safari, not in installed PWAs (they cache the initial value)
    const appleStatusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]') as HTMLMetaElement;
    if (appleStatusBarMeta) {
      // Use 'default' which shows content color behind status bar
      appleStatusBarMeta.content = 'default';
    }
    
    console.log(`📱 PWA: Updated theme-color to ${statusBarColor} (${isDarkMode ? 'dark' : 'light'} mode)`);
  }, [isDarkMode]);

  // Show "tap to play" hint for passive centered drinks after 3 seconds
  useEffect(() => {
    // Reset hint immediately when conditions change
    setShowTapHint(false);
    
    // Don't show hint if:
    // - Start screen is visible
    // - Currently animating
    // - Drink is loading
    // - Center drink is already active
    if (showStartScreen || isAnimating || isLoading || centerIndex === activeDrinkIndex) {
      return;
    }
    
    // Center drink is passive → Start 3-second timer
    const timer = setTimeout(() => {
      console.log('💡 Showing tap hint for passive centered drink');
      setShowTapHint(true);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      setShowTapHint(false);
    };
  }, [centerIndex, activeDrinkIndex, isAnimating, isLoading, showStartScreen]);

  // Debug logging
  useEffect(() => {
    console.log('🎛️ STATE:', {
      center: centerIndex,
      active: activeDrinkIndex,
      animating: isAnimating,
      loading: isLoading,
      playing: isPlaying,
      muted: isMuted,
      tapHint: showTapHint
    });
  }, [centerIndex, activeDrinkIndex, isAnimating, isLoading, isPlaying, isMuted, showTapHint]);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <div className={`w-screen h-screen overflow-hidden relative ${isDarkMode ? 'dark' : ''}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-background transition-colors duration-300" />

      {/* Start Screen */}
      {showStartScreen && (
        <StartScreen
          onComplete={handleStartScreenComplete}
          onFirstSwipe={handleFirstSwipe}
          userInteracted={userInteracted}
          isFirstStationLoading={isLoading && loadingDrinkIndex === 0}
        />
      )}

      {/* PWA Install Toast */}
      <PwaInstallToast show={!showStartScreen} />

      {/* Shuffle Button */}
      {!showStartScreen && (
        <button
          className="fixed left-6 top-[32px] z-50 text-[#9c9c9c] dark:text-[#CBCBCB] pointer-events-auto"
          style={{ lineHeight: 0, padding: '4px' }}
          onClick={handleShuffle}
          aria-label="Shuffle"
        >
          <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.635254 10.7524H2.93817C3.74327 10.7524 4.51254 10.4196 5.06369 9.83269L11.2091 3.28901C11.7602 2.70214 12.5295 2.36926 13.3346 2.36926H15.9437" stroke="currentColor" strokeWidth="1.09346" strokeLinecap="round"/>
            <path d="M14.3035 0.546875L16.2303 1.75114C16.6871 2.03665 16.6871 2.70196 16.2303 2.98747L14.3035 4.19174" stroke="currentColor" strokeWidth="1.09346" strokeLinecap="round"/>
            <path d="M0.552246 1.95361H2.87819C3.69134 1.95361 4.46831 2.28982 5.02497 2.88256L11.2318 9.49168C11.7885 10.0844 12.5654 10.4206 13.3786 10.4206H16.0137" stroke="currentColor" strokeWidth="1.10439" strokeLinecap="round"/>
            <path d="M14.3572 12.2615L16.3033 11.0452C16.7647 10.7568 16.7647 10.0848 16.3033 9.79647L14.3572 8.58016" stroke="currentColor" strokeWidth="1.10439" strokeLinecap="round"/>
          </svg>
        </button>
      )}

      {/* View Toggle Button — disabled, see DrinkGridView.tsx to re-enable */}

      {/* Main App */}
      {!showStartScreen && (
        <div className="relative w-full h-full flex flex-col">
          {/* Station Display - Centered at top */}
          <StationDisplay
            activeStation={
              activeDrinkIndex !== null 
                ? getDrinkStationConfig(DRINK_REGISTRY[activeDrinkIndex].id)?.name || null
                : null
            }
            upcomingStation={
              centerIndex !== activeDrinkIndex
                ? getDrinkStationConfig(DRINK_REGISTRY[centerIndex].id)?.name || null
                : null
            }
            isPlaying={isPlaying && !isMuted}
            isLoading={isLoading && loadingDrinkIndex === activeDrinkIndex}
            upcomingIsLoading={isLoading && loadingDrinkIndex === centerIndex}
          />

          {/* Grid View — disabled, re-enable by restoring toggle button and this block */}
          {/* {viewMode === 'grid' && (
            <DrinkGridView
              activeDrinkIndex={activeDrinkIndex}
              isMuted={isMuted}
              onDrinkTap={handleGridTap}
            />
          )} */}

          {/* Carousel V2 - Absolutely centered, independent of header/footer */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ display: viewMode === 'grid' ? 'none' : 'flex' }}>
            <div className="w-full h-full flex items-center justify-center pointer-events-auto">
              <DrinkCarouselV2
                centerIndex={centerIndex}
                isAnimating={isAnimating}
                activeDrinkIndex={activeDrinkIndex}
                loadingDrinkIndex={loadingDrinkIndex}
                isMuted={isMuted}
                totalDrinks={DRINK_REGISTRY.length}
                onSwipeLeft={swipeLeft}
                onSwipeRight={swipeRight}
                onSwipeEnd={handleSwipeEnd}
                onNavigateTo={navigateTo}
                onCenterTap={handleCenterTap}
              />
            </div>
          </div>

          {/* Hints below carousel (Tap Hint / Sleep Timer) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ display: viewMode === 'grid' ? 'none' : 'flex' }}>
            <div className="flex flex-col items-center justify-center">
              {/* Spacer for carousel height + 140px distance */}
              <div style={{ height: '90px' }} />
              
              {/* Hint Area - 140px below drink */}
              <div className="h-[30px] flex items-center justify-center" style={{ marginTop: '140px' }}>
                {/* Sleep Timer */}
                {sleepTimer.isActive && (
                  <div 
                    className="font-['Pathway_Extreme',sans-serif] text-[11px] text-nowrap text-[#9c9c9c] dark:text-[#CBCBCB] tabular-nums"
                    style={{ fontVariationSettings: "'wdth' 100", opacity: 0.5 }}
                  >
                    {Math.floor(sleepTimer.remainingSeconds / 60)}:{String(sleepTimer.remainingSeconds % 60).padStart(2, '0')}
                  </div>
                )}
                
                {/* Tap Hint - strong pulse from 0% to 40% */}
                {showTapHint && (
                  <div 
                    className="font-['Pathway_Extreme',sans-serif] text-[11px] text-nowrap text-[#9c9c9c] dark:text-[#CBCBCB]"
                    style={{
                      fontVariationSettings: "'wdth' 100",
                      opacity: 0.5,
                      animation: 'strongPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                  >
                    tap drink to play
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
