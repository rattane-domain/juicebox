import { useState, useRef, useCallback } from 'react';

/**
 * SIMPLE CAROUSEL HOOK - LEGACY VERSION
 * 
 * ⚠️ DEPRECATED: This is the old carousel hook.
 * Use usePhysicalCarousel instead for better physics and timing.
 * 
 * This file can be deleted once usePhysicalCarousel is stable.
 * 
 * ULTRA-SIMPLE CAROUSEL WITH QUEUE
 * - Swipe left/right to navigate
 * - Always snaps to a center position
 * - Queue system for rapid clicks
 * - Faster animation when queued
 */

interface UseSimpleCarouselProps {
  totalDrinks: number;
  onCenterDrinkStable: (index: number) => void; // Called when carousel settles on a drink
}

export const useSimpleCarousel = ({ totalDrinks, onCenterDrinkStable }: UseSimpleCarouselProps) => {
  const [centerIndex, setCenterIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [queueLength, setQueueLength] = useState(0);
  
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stableTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const queueRef = useRef<Array<'left' | 'right'>>([]);
  const isProcessingRef = useRef(false);
  const currentIndexRef = useRef(0); // Track current index outside state

  // Sync ref with state
  currentIndexRef.current = centerIndex;
  
  // REACTIVE DURATION - Updates immediately when queue changes (like shadcn/Embla)
  // Motion will automatically adjust ongoing animations when this changes!
  const animationDuration = queueLength > 0 ? 0.1 : 0.6; // 100ms when queued, 600ms when idle

  // Process queue - Duration is now REACTIVE, not set here!
  const processQueue = useCallback(() => {
    if (isProcessingRef.current || queueRef.current.length === 0) return;
    
    isProcessingRef.current = true;
    
    // Get direction and update queue
    const direction = queueRef.current.shift()!;
    setQueueLength(queueRef.current.length); // This triggers reactive duration update!
    
    // Calculate new index using ref (always current)
    const currentIdx = currentIndexRef.current;
    const newIndex = direction === 'left' 
      ? (currentIdx + 1) % totalDrinks
      : currentIdx === 0 ? totalDrinks - 1 : currentIdx - 1;
    
    // Use reactive duration (100ms if more queued, 600ms if last)
    const hasMoreInQueue = queueRef.current.length > 0;
    const duration = hasMoreInQueue ? 100 : 600;
    const nextItemDelay = hasMoreInQueue ? 50 : duration;
    
    console.log(`🎠 Queue: ${direction}, ${currentIdx}→${newIndex}, queueLen: ${queueRef.current.length}, speed: ${duration}ms`);
    
    setIsAnimating(true);
    setCenterIndex(newIndex);
    currentIndexRef.current = newIndex; // Update ref immediately
    
    // Start next animation early (overlapping for speed!)
    const nextAnimationTimer = setTimeout(() => {
      isProcessingRef.current = false;
      
      // Process next item or notify stable
      if (queueRef.current.length > 0) {
        // Immediately process next (overlapping!)
        processQueue();
      } else {
        // Only wait when queue is empty
        stableTimeoutRef.current = setTimeout(() => {
          onCenterDrinkStable(newIndex);
        }, 100);
      }
    }, nextItemDelay);
    
    // Clean up animation state after full duration
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, duration);
  }, [totalDrinks, onCenterDrinkStable]);

  // Navigate to specific index
  const navigateTo = useCallback((newIndex: number) => {
    if (newIndex === currentIndexRef.current) return;
    
    // Clear existing timers
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    if (stableTimeoutRef.current) clearTimeout(stableTimeoutRef.current);
    
    // Start animation
    setIsAnimating(true);
    setCenterIndex(newIndex);
    currentIndexRef.current = newIndex;
    
    // Animation ends after 600ms
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
      
      // Notify stable after animation completes
      stableTimeoutRef.current = setTimeout(() => {
        onCenterDrinkStable(newIndex);
      }, 100);
    }, 600);
  }, [onCenterDrinkStable]);

  // Swipe left (next drink) - add to queue
  const swipeLeft = useCallback(() => {
    queueRef.current.push('left');
    setQueueLength(queueRef.current.length);
    console.log(`📥 Added LEFT to queue, total: ${queueRef.current.length}`);
    
    // Only start processing if not already processing
    if (!isProcessingRef.current) {
      processQueue();
    }
  }, [processQueue]);

  // Swipe right (previous drink) - add to queue
  const swipeRight = useCallback(() => {
    queueRef.current.push('right');
    setQueueLength(queueRef.current.length);
    console.log(`📥 Added RIGHT to queue, total: ${queueRef.current.length}`);
    
    // Only start processing if not already processing
    if (!isProcessingRef.current) {
      processQueue();
    }
  }, [processQueue]);

  return {
    centerIndex,
    isAnimating,
    queueLength,
    animationDuration, // REACTIVE: Updates immediately when queueLength changes!
    swipeLeft,
    swipeRight,
    navigateTo
  };
};
