import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * PHYSICAL CAROUSEL HOOK V3 - SIMPLIFIED CONTINUOUS
 * 
 * MODE 1: TAP MODE
 * - Immediate centerIndex changes on each tap
 * - Spring animation in component handles smooth motion
 * - No complex timing logic needed!
 * 
 * MODE 2: SWIPE MODE
 * - iOS-style wheel physics
 * - Momentum and deceleration
 * - Snaps to discrete positions
 */

interface UsePhysicalCarouselProps {
  totalDrinks: number;
  onCenterDrinkStable?: (index: number) => void;
}

export const usePhysicalCarousel = ({ totalDrinks, onCenterDrinkStable }: UsePhysicalCarouselProps) => {
  const [centerIndex, setCenterIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const centerIndexRef = useRef(0);
  const stableTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animatingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sync state with ref
  centerIndexRef.current = centerIndex;
  
  /**
   * TAP MODE: Navigate one step
   * Simple and immediate - let spring handle smoothness
   */
  const navigate = useCallback((direction: 'left' | 'right') => {
    // Calculate new index immediately
    const currentIdx = centerIndexRef.current;
    const newIndex = direction === 'left' 
      ? (currentIdx + 1) % totalDrinks
      : (currentIdx - 1 + totalDrinks) % totalDrinks;
    
    console.log(`👆 Tap ${direction}: ${currentIdx}→${newIndex}`);
    
    // Update immediately - spring will follow smoothly
    setCenterIndex(newIndex);
    centerIndexRef.current = newIndex;
    setIsAnimating(true);
    
    // Clear existing timers
    if (stableTimeoutRef.current) clearTimeout(stableTimeoutRef.current);
    if (animatingTimeoutRef.current) clearTimeout(animatingTimeoutRef.current);
    
    // Mark animation as done after spring settles (~500ms for our config)
    animatingTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      
      // Notify stable after animation
      stableTimeoutRef.current = setTimeout(() => {
        onCenterDrinkStable?.(newIndex);
      }, 100);
    }, 500);
    
  }, [totalDrinks, onCenterDrinkStable]);
  
  /**
   * Public API: Navigate left (next drink)
   */
  const swipeLeft = useCallback(() => {
    navigate('left');
  }, [navigate]);
  
  /**
   * Public API: Navigate right (previous drink)
   */
  const swipeRight = useCallback(() => {
    navigate('right');
  }, [navigate]);
  
  /**
   * SWIPE MODE: Handle momentum-based navigation
   * Called from component after drag ends
   */
  const handleSwipeEnd = useCallback((velocity: number, offset: number) => {
    // Determine how many drinks to skip based on velocity and offset
    const VELOCITY_THRESHOLD = 500; // px/s
    const OFFSET_THRESHOLD = 50; // px
    
    let drinksToSkip = 0;
    
    // Fast swipe: use velocity
    if (Math.abs(velocity) > VELOCITY_THRESHOLD) {
      drinksToSkip = Math.round(Math.abs(velocity) / 800);
      drinksToSkip = Math.max(1, Math.min(5, drinksToSkip)); // Clamp 1-5
    } 
    // Slow drag: use offset
    else if (Math.abs(offset) > OFFSET_THRESHOLD) {
      drinksToSkip = 1;
    }
    
    if (drinksToSkip === 0) {
      console.log('⤴️ Swipe: snap back to center');
      setIsAnimating(false);
      return; // Snap back
    }
    
    // Calculate new index
    const direction = velocity > 0 || offset > 0 ? 'right' : 'left';
    let newIndex = centerIndexRef.current;
    
    for (let i = 0; i < drinksToSkip; i++) {
      if (direction === 'left') {
        newIndex = (newIndex + 1) % totalDrinks;
      } else {
        newIndex = newIndex === 0 ? totalDrinks - 1 : newIndex - 1;
      }
    }
    
    console.log(`🌀 Swipe: ${direction}, skip ${drinksToSkip}, ${centerIndexRef.current}→${newIndex}, velocity: ${velocity.toFixed(0)}px/s`);
    
    // Animate to new position
    setIsAnimating(true);
    setCenterIndex(newIndex);
    centerIndexRef.current = newIndex;
    
    // Clear existing timers
    if (stableTimeoutRef.current) clearTimeout(stableTimeoutRef.current);
    if (animatingTimeoutRef.current) clearTimeout(animatingTimeoutRef.current);
    
    // Mark as done after animation (physics-based duration)
    const duration = 400 + (drinksToSkip * 100); // Base + distance factor
    animatingTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      
      // Notify stable
      stableTimeoutRef.current = setTimeout(() => {
        onCenterDrinkStable?.(newIndex);
      }, 100);
    }, duration);
    
  }, [totalDrinks, onCenterDrinkStable]);
  
  /**
   * Public API: Navigate to specific index (direct jump)
   */
  const navigateTo = useCallback((newIndex: number) => {
    if (newIndex === centerIndexRef.current) return;
    
    console.log(`🎯 Navigate to: ${centerIndexRef.current}→${newIndex}`);
    
    setIsAnimating(true);
    setCenterIndex(newIndex);
    centerIndexRef.current = newIndex;
    
    // Clear existing timers
    if (stableTimeoutRef.current) clearTimeout(stableTimeoutRef.current);
    if (animatingTimeoutRef.current) clearTimeout(animatingTimeoutRef.current);
    
    animatingTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      
      // Notify stable
      stableTimeoutRef.current = setTimeout(() => {
        onCenterDrinkStable?.(newIndex);
      }, 100);
    }, 600);
  }, [onCenterDrinkStable]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stableTimeoutRef.current) {
        clearTimeout(stableTimeoutRef.current);
      }
      if (animatingTimeoutRef.current) {
        clearTimeout(animatingTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    centerIndex,
    centerIndexRef, // ✅ FIX: Export ref for synchronous access in event handlers
    isAnimating,
    swipeLeft,
    swipeRight,
    navigateTo,
    handleSwipeEnd
  };
};
