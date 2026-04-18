import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import DrinkIcon from './DrinkIcon';
import { DRINK_REGISTRY } from '../constants/drinks';
import type { DrinkDefinition } from '../constants/drinks';

interface DrinkCarouselProps {
  drinks: any[]; // Legacy compatibility
  currentIndex: number;
  isPlaying: boolean;
  isStationLoading?: boolean;
  isLoadingNewStation?: boolean;
  isCrossfading?: boolean;
  activeDrinkIndices?: number[]; // New: indices of drinks that should be in active state
  loadingDrinkIndex?: number | null; // NEW: index of drink showing loading animation
  onDrinkChange: (direction: 'left' | 'right') => Promise<void>;
  onCenteredDrinkTap?: () => Promise<void>; // NEW: Called when centered drink is tapped
}

export default function DrinkCarousel({
  drinks, // We'll ignore this and use DRINK_REGISTRY instead
  currentIndex,
  isPlaying,
  isStationLoading = false,
  isLoadingNewStation = false,
  isCrossfading = false,
  activeDrinkIndices = [],
  loadingDrinkIndex = null, // NEW
  onDrinkChange,
  onCenteredDrinkTap // NEW
}: DrinkCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartTimeRef = useRef(0);
  const hasDraggedRef = useRef(false);

  // Use the new drink registry
  const drinkList = DRINK_REGISTRY;
  const totalDrinks = drinkList.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let dragStartTime = 0;
    let hasDragged = false;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startXRef.current = startX;
      startYRef.current = startY;
      isDragging = false; // Don't set dragging immediately
      isDraggingRef.current = false;
      hasDragged = false;
      hasDraggedRef.current = false;
      dragStartTime = Date.now();
      dragStartTimeRef.current = dragStartTime;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Improved drag detection - start dragging with lower threshold and prioritize horizontal movement
      if (!isDragging && distance > 15) { // Reduced from implicit higher threshold
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY) * 1.5; // Must be more horizontal than vertical
        if (isHorizontal) {
          isDragging = true;
          isDraggingRef.current = true;
          hasDragged = true;
          hasDraggedRef.current = true;
          console.log('🖐️ Touch drag started - deltaX:', deltaX, 'distance:', distance);
          e.preventDefault(); // Prevent scrolling only when we detect horizontal drag
        }
      }
      
      if (isDragging) {
        e.preventDefault(); // Prevent any scrolling while dragging
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const dragDuration = Date.now() - dragStartTime;
      const threshold = 25; // Reduced threshold for easier swiping
      
      console.log('🖐️ Touch end:', {
        deltaX,
        deltaY,
        duration: dragDuration,
        hasDragged,
        threshold,
        wasQuickSwipe: dragDuration < 300 && Math.abs(deltaX) > threshold
      });

      // Detect swipe with lower threshold and consider quick movements
      if (hasDragged || (Math.abs(deltaX) > threshold)) {
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        
        if (isHorizontal && Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            // Swipe right - previous drink
            console.log('👈 Swiped right');
            onDrinkChange('right');
          } else {
            // Swipe left - next drink
            console.log('👉 Swiped left');
            onDrinkChange('left');
          }
        }
      }

      // Reset drag state (but keep hasDragged for a moment to prevent tap detection)
      isDragging = false;
      isDraggingRef.current = false;
      
      // Delay resetting hasDragged to prevent false tap detection after swipe
      if (hasDragged) {
        setTimeout(() => {
          hasDragged = false;
          hasDraggedRef.current = false;
        }, 100); // 100ms delay
      } else {
        hasDragged = false;
        hasDraggedRef.current = false;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      startX = e.clientX;
      startY = e.clientY;
      startXRef.current = startX;
      startYRef.current = startY;
      isDragging = false;
      isDraggingRef.current = false;
      hasDragged = false;
      hasDraggedRef.current = false;
      dragStartTime = Date.now();
      dragStartTimeRef.current = dragStartTime;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Improved drag detection for mouse
      if (!isDragging && distance > 10) {
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        if (isHorizontal) {
          isDragging = true;
          isDraggingRef.current = true;
          hasDragged = true;
          hasDraggedRef.current = true;
          e.preventDefault();
        }
      }
      
      if (isDragging) {
        e.preventDefault();
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      const endX = e.clientX;
      const endY = e.clientY;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const threshold = 30; // Slightly higher threshold for mouse

      console.log('🖱️ Mouse up:', {
        deltaX,
        deltaY,
        hasDragged,
        threshold
      });

      if (hasDragged || Math.abs(deltaX) > threshold) {
        const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);
        
        if (isHorizontal && Math.abs(deltaX) > threshold) {
          if (deltaX > 0) {
            // Swipe right - previous drink
            console.log('👈 Mouse swiped right');
            onDrinkChange('right');
          } else {
            // Swipe left - next drink
            console.log('👉 Mouse swiped left');
            onDrinkChange('left');
          }
        }
      }

      // Reset drag state (but keep hasDragged for a moment to prevent tap detection)
      isDragging = false;
      isDraggingRef.current = false;
      
      // Delay resetting hasDragged to prevent false tap detection after swipe
      if (hasDragged) {
        setTimeout(() => {
          hasDragged = false;
          hasDraggedRef.current = false;
        }, 100); // 100ms delay
      } else {
        hasDragged = false;
        hasDraggedRef.current = false;
      }
    };

    // Touch events
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Mouse events for desktop
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);

    // Prevent context menu on long press
    container.addEventListener('contextmenu', (e) => e.preventDefault());

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('contextmenu', (e) => e.preventDefault());
    };
  }, [currentIndex, totalDrinks, onDrinkChange]);

  // Calculate positions with variable spacing for natural focal clustering
  const getItemTransform = (index: number) => {
    // Calculate the shortest path difference (accounting for wrap-around)
    let diff = index - currentIndex;
    
    // Handle infinite wrapping - choose shortest path
    if (diff > totalDrinks / 2) {
      diff -= totalDrinks;
    } else if (diff < -totalDrinks / 2) {
      diff += totalDrinks;
    }
    
    // Variable spacing calculation for focal clustering
    let x = 0;
    const centerToAdjacentSpacing = 112; // Keep current spacing for center to adjacent
    const adjacentToEdgeSpacing = 90; // Reduced spacing (20% less) for adjacent to edge
    
    if (diff === 0) {
      // Center position
      x = 0;
    } else if (Math.abs(diff) === 1) {
      // Adjacent positions (±1)
      x = diff * centerToAdjacentSpacing;
    } else if (Math.abs(diff) === 2) {
      // Edge positions (±2) - accumulate spacing
      const adjacentX = (diff > 0 ? 1 : -1) * centerToAdjacentSpacing;
      const edgeOffset = (diff > 0 ? 1 : -1) * adjacentToEdgeSpacing;
      x = adjacentX + edgeOffset;
    } else {
      // Further positions - continue the pattern
      const sign = diff > 0 ? 1 : -1;
      const baseDistance = centerToAdjacentSpacing + adjacentToEdgeSpacing;
      const additionalSteps = Math.abs(diff) - 2;
      x = sign * (baseDistance + (additionalSteps * adjacentToEdgeSpacing));
    }
    
    // Determine visibility and scale
    const absIndex = Math.abs(diff);
    let opacity = 0;
    let scale = 0.8;
    let zIndex = 1;
    
    // Show center drink + 2 on each side (5 total visible)
    if (absIndex === 0) {
      // Center drink (active)
      opacity = 1;
      scale = 2.16;
      zIndex = 10;
    } else if (absIndex === 1) {
      // First drinks on each side - unchanged
      opacity = 1;
      scale = 1.1;
      zIndex = 5;
    } else if (absIndex === 2) {
      // Second drinks on each side (these will be partially cut off) - unchanged
      opacity = 1;
      scale = 1;
      zIndex = 3;
    } else {
      // All other drinks hidden - unchanged
      opacity = 0;
      scale = 0.7;
      zIndex = 1;
    }
    
    return {
      transform: `translate3d(${x}px, 0, 0) scale(${scale})`,
      opacity,
      zIndex
    };
  };

  // NEW: Handle centered drink tap
  const handleCenteredDrinkClick = (e: React.MouseEvent, drinkIndex: number) => {
    // Only handle if it's the centered drink and we didn't just drag
    if (drinkIndex === currentIndex && !hasDraggedRef.current && onCenteredDrinkTap) {
      e.stopPropagation(); // Prevent event bubbling
      console.log(`🎯 Centered drink tapped: ${drinkIndex}`);
      onCenteredDrinkTap();
    }
  };

  // NEW: Handle centered drink touch (mobile)
  const handleCenteredDrinkTouch = (e: React.TouchEvent, drinkIndex: number) => {
    // Only handle if it's the centered drink and we didn't just drag
    if (drinkIndex === currentIndex && !hasDraggedRef.current && onCenteredDrinkTap) {
      e.stopPropagation(); // Prevent event bubbling
      console.log(`🎯 Centered drink touched: ${drinkIndex}`);
      onCenteredDrinkTap();
    }
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center overflow-hidden drink-carousel"
    >
      {/* Expanded container that stretches well beyond screen for cutoff effect */}
      <div
        ref={containerRef}
        className="relative flex items-center justify-center touch-manipulation"
        style={{
          width: '200vw', // Even wider to ensure proper cutoff
          height: '100%',
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        {drinkList.map((drink, index) => {
          const transform = getItemTransform(index);
          const isCentered = index === currentIndex;
          // A drink is active if it's in the activeDrinkIndices array
          const isActive = activeDrinkIndices.includes(index);
          const isLoading = loadingDrinkIndex === index;

          return (
            <motion.div
              key={drink.id}
              className="absolute flex items-center justify-center"
              style={{
                width: '75px',   // 3:5 Portrait ratio
                height: '125px', // 3:5 Portrait ratio
                ...transform
              }}
              animate={transform}
              transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1]
              }}
              onClick={(e) => handleCenteredDrinkClick(e, index)}
              onTouchEnd={(e) => {
                // Only trigger tap if we didn't drag
                if (!hasDraggedRef.current) {
                  handleCenteredDrinkTouch(e, index);
                }
              }}
            >
              {/* Visual drink icon with tap interaction for centered drink */}
              <DrinkIcon
                drinkId={drink.id}
                isActive={isActive}
                isLoading={isLoading}
                isPlaying={isActive}
                className={`w-full h-full drink-icon ${isCentered ? 'cursor-pointer' : 'pointer-events-none'}`}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}