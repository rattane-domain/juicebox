import React from 'react';
import { motion, PanInfo } from 'motion/react';
import DrinkIcon from './DrinkIcon';
import { DRINK_REGISTRY } from '../constants/drinks';

/**
 * SIMPLE CAROUSEL - LEGACY VERSION
 * 
 * ⚠️ DEPRECATED: This is the old carousel implementation.
 * Use DrinkCarouselV2 instead for better physics and timing.
 * 
 * This file can be deleted once DrinkCarouselV2 is stable.
 * 
 * Core Principles:
 * 1. Tap left/right zones to navigate
 * 2. Tap center to activate
 * 3. Drag left/right to navigate
 * 4. Simple threshold-based navigation (no complex physics)
 */

interface SimpleCarouselProps {
  centerIndex: number;
  isAnimating: boolean;
  animationDuration: number; // NEW: Duration in seconds (from hook)
  activeDrinkIndex: number | null;
  loadingDrinkIndex: number | null;
  isMuted: boolean;
  totalDrinks: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onNavigateTo: (index: number) => void;
  onCenterTap: () => void;
}

export default function SimpleCarousel({
  centerIndex,
  isAnimating,
  animationDuration,
  activeDrinkIndex,
  loadingDrinkIndex,
  isMuted,
  onSwipeLeft,
  onSwipeRight,
  onCenterTap
}: SimpleCarouselProps) {
  
  // ========================================
  // CONFIGURATION
  // ========================================
  
  const DRINK_SPACING = 98; // px between drinks (85 * 1.15 = 97.75, rounded to 98)
  const CENTER_PADDING = 20; // px extra padding on left/right of center drink
  const SWIPE_THRESHOLD = 50; // px to trigger navigation
  
  // ========================================
  // STATE
  // ========================================
  
  const isDraggingRef = React.useRef(false);
  
  // ========================================
  // GESTURE HANDLERS
  // ========================================
  
  const handleDragStart = () => {
    isDraggingRef.current = true;
  };
  
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDraggingRef.current = false;
    
    const dragDistance = info.offset.x;
    
    console.log('🎯 Drag end:', {
      distance: dragDistance.toFixed(0),
      threshold: SWIPE_THRESHOLD
    });
    
    // Simple threshold-based navigation
    if (dragDistance > SWIPE_THRESHOLD) {
      console.log('👉 Swipe right - go to previous');
      onSwipeRight();
    } else if (dragDistance < -SWIPE_THRESHOLD) {
      console.log('👈 Swipe left - go to next');
      onSwipeLeft();
    } else {
      console.log('⤴️ Snap back to center');
    }
  };
  
  // ========================================
  // TAP HANDLERS
  // ========================================
  
  const handleClick = (event: React.MouseEvent) => {
    if (isDraggingRef.current) return;
    
    const clickX = event.clientX;
    const screenWidth = window.innerWidth;
    
    const leftZone = screenWidth * 0.33;
    const rightZone = screenWidth * 0.67;
    
    if (clickX < leftZone) {
      console.log('👈 Left tap zone');
      onSwipeRight();
    } else if (clickX > rightZone) {
      console.log('👉 Right tap zone');
      onSwipeLeft();
    } else {
      console.log('👆 Center tap zone');
      onCenterTap();
    }
  };
  
  // ========================================
  // RENDER TRANSFORM
  // ========================================
  
  const getTransform = (index: number) => {
    const diff = index - centerIndex;
    let normalizedDiff = diff;

    // Handle wrap-around (shortest path)
    if (diff > DRINK_REGISTRY.length / 2) {
      normalizedDiff = diff - DRINK_REGISTRY.length;
    } else if (diff < -DRINK_REGISTRY.length / 2) {
      normalizedDiff = diff + DRINK_REGISTRY.length;
    }

    // Calculate base position with extra padding around center drink
    let baseX = normalizedDiff * DRINK_SPACING;
    
    // Add extra padding for drinks immediately left/right of center
    if (normalizedDiff === -1) {
      baseX -= CENTER_PADDING; // Left side: push further left
    } else if (normalizedDiff === 1) {
      baseX += CENTER_PADDING; // Right side: push further right
    }

    // Visibility and scale based on distance from center
    const absIndex = Math.abs(normalizedDiff);
    let opacity = 0;
    let scale = 0.7;
    let zIndex = 1;

    if (absIndex === 0) {
      opacity = 1;
      scale = 2.16;
      zIndex = 10;
    } else if (absIndex === 1) {
      opacity = 1;
      scale = 1.1;
      zIndex = 5;
    } else if (absIndex === 2) {
      opacity = 1;
      scale = 1;
      zIndex = 3;
    } else if (absIndex === 3) {
      opacity = 0.8;
      scale = 0.9;
      zIndex = 2;
    }

    return {
      transform: `translate3d(${baseX}px, 0, 0) scale(${scale})`,
      opacity,
      zIndex
    };
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      onClick={handleClick}
    >
      <motion.div
        className="relative flex items-center justify-center"
        style={{
          width: '200vw',
          height: '100%'
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {DRINK_REGISTRY.map((drink, index) => {
          const transform = getTransform(index);
          const isThisActiveDrink = index === activeDrinkIndex;
          const isLoading = index === loadingDrinkIndex;
          const isActive = isThisActiveDrink && !isMuted;

          return (
            <motion.div
              key={`${drink.id}-${index}`}
              style={{
                position: 'absolute',
                width: '75px',  // 3:5 Portrait ratio
                height: '125px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                ...transform
              }}
              animate={transform}
              transition={{
                duration: animationDuration,
                ease: animationDuration < 0.3 
                  ? [0.32, 0, 0, 1] // Fast mode: Ultra-snappy (instant start, smooth end)
                  : [0.25, 0.1, 0.25, 1] // Normal mode: smooth ease-in-out
              }}
            >
              <DrinkIcon
                drinkId={drink.id}
                isActive={isActive}
                isLoading={isLoading}
                isPlaying={isActive}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
