import { useState, useEffect, useRef } from 'react';

export const useVisualCarousel = (totalDrinks: number) => {
  const [visualIndex, setVisualIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth visual transition
  const transitionToIndex = (newIndex: number, immediate: boolean = false) => {
    if (newIndex === visualIndex && !immediate) return;
    
    console.log(`🎨 Visual transition: ${visualIndex} → ${newIndex} ${immediate ? '(immediate)' : '(animated)'}`);
    
    if (immediate) {
      setVisualIndex(newIndex);
      setIsAnimating(false);
      return;
    }
    
    setIsAnimating(true);
    setVisualIndex(newIndex);
    
    // Clear existing animation timeout
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    
    // Animation duration matches CSS transition
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  // Handle swipe/drag gestures
  const handleSwipeLeft = () => {
    const newIndex = visualIndex < totalDrinks - 1 ? visualIndex + 1 : 0;
    transitionToIndex(newIndex);
    return newIndex;
  };

  const handleSwipeRight = () => {
    const newIndex = visualIndex > 0 ? visualIndex - 1 : totalDrinks - 1;
    transitionToIndex(newIndex);
    return newIndex;
  };

  // Handle tap on adjacent drinks
  const handleAdjacentTap = (targetIndex: number) => {
    if (targetIndex === visualIndex) return visualIndex;
    
    transitionToIndex(targetIndex);
    return targetIndex;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  return {
    visualIndex,
    isAnimating,
    transitionToIndex,
    handleSwipeLeft,
    handleSwipeRight,
    handleAdjacentTap
  };
};