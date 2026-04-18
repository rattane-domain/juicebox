import React, { useRef } from 'react';
import { motion, PanInfo } from 'motion/react';
import DrinkIcon from './DrinkIcon';
import { DRINK_REGISTRY } from '../constants/drinks';

/**
 * DRINK CAROUSEL V2 - PHYSICAL INTERACTIONS
 * 
 * TWO MODES:
 * 1. TAP MODE: Click/tap left/right zones with dynamic timing
 * 2. SWIPE MODE: iOS-style wheel with physics and momentum
 * 
 * Visuals: Identical to SimpleCarousel (unchanged)
 * Mechanics: Completely rebuilt for better feel
 */

interface DrinkCarouselV2Props {
  centerIndex: number;
  isAnimating: boolean;
  activeDrinkIndex: number | null;
  loadingDrinkIndex: number | null;
  isMuted: boolean;
  totalDrinks: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeEnd: (velocity: number, offset: number) => void; // For physics-based swipe
  onNavigateTo: (index: number) => void;
  onCenterTap: () => void;
}

export default function DrinkCarouselV2({
  centerIndex,
  isAnimating,
  activeDrinkIndex,
  loadingDrinkIndex,
  isMuted,
  onSwipeLeft,
  onSwipeRight,
  onSwipeEnd,
  onCenterTap
}: DrinkCarouselV2Props) {
  
  // ========================================
  // CONFIGURATION
  // ========================================
  
  // iOS 16 FIX: Larger base size to prevent pixelation
  // Base size now matches final display size (no upscaling for center drink)
  // SPACING stays the same - it's screen position, not container size
  const DRINK_SPACING = 98; // px between drink centers on screen
  const CENTER_PADDING = 20; // px extra padding around center
  
  // ========================================
  // STATE
  // ========================================
  
  const isDraggingRef = useRef(false);
  
  // ========================================
  // DRAG HANDLERS (SWIPE MODE)
  // ========================================
  
  const handleDragStart = (_event: MouseEvent | TouchEvent | PointerEvent, _info: PanInfo) => {
    isDraggingRef.current = true;
    console.log('🖐️ Drag started');
  };
  
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragDistance = info.offset.x;
    const velocity = info.velocity.x; // Motion provides velocity in px/s
    
    console.log('🖐️ Drag end:', {
      distance: dragDistance.toFixed(0),
      velocity: velocity.toFixed(0)
    });
    
    // Reset drag state (delayed to prevent false tap detection)
    setTimeout(() => {
      isDraggingRef.current = false;
    }, 100);
    
    // Pass to physics handler
    onSwipeEnd(velocity, dragDistance);
  };
  
  // ========================================
  // TAP HANDLERS (TAP MODE)
  // ========================================
  
  const handleClick = (event: React.MouseEvent) => {
    if (isDraggingRef.current) {
      console.log('⚠️ Click ignored (was dragging)');
      return;
    }
    
    const clickX = event.clientX;
    const screenWidth = window.innerWidth;
    const screenCenter = screenWidth / 2;
    // On mobile ~17% of screen (~127px), capped at 90px on wider screens
    const centerHalf = Math.min(screenWidth * 0.17, 90);
    const leftZone = screenCenter - centerHalf;
    const rightZone = screenCenter + centerHalf;

    if (clickX < leftZone) {
      console.log('👈 Tap left zone');
      onSwipeRight();
    } else if (clickX > rightZone) {
      console.log('👉 Tap right zone');
      onSwipeLeft();
    } else {
      console.log('👆 Tap center zone');
      onCenterTap();
    }
  };
  
  // ========================================
  // RENDER TRANSFORM (Unchanged from SimpleCarousel)
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

    // iOS 16 FIX: Reduced scale factors (base size is now 162x270px)
    // No upscaling for center drink = sharp rendering on older iOS
    if (absIndex === 0) {
      opacity = 1;
      scale = 1.0; // Center: no scaling (was 2.16)
      zIndex = 10;
    } else if (absIndex === 1) {
      opacity = 1;
      scale = 0.51; // Neighbors: ~82px wide (was 1.1)
      zIndex = 5;
    } else if (absIndex === 2) {
      opacity = 1;
      scale = 0.46; // Next: ~75px wide (was 1.0)
      zIndex = 3;
    } else if (absIndex === 3) {
      opacity = 0.8;
      scale = 0.42; // Further: ~68px wide (was 0.9)
      zIndex = 2;
    }

    return {
      transform: `translate3d(${baseX}px, 0, 0) scale(${scale})`,
      opacity,
      zIndex
    };
  };
  
  // ========================================
  // ANIMATION CONFIG
  // ========================================
  
  // Continuous smooth animation with spring physics
  // Tuned for responsive yet smooth transitions
  const ANIMATION_CONFIG = {
    type: "spring" as const,
    stiffness: 400,  // High stiffness = quick response
    damping: 35,     // Balanced damping = no overshoot, but still smooth
    mass: 0.6        // Low mass = faster acceleration
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
        dragElastic={0.2} // More elastic for better feel
        dragMomentum={false} // We handle momentum ourselves
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
                width: '162px',  // iOS 16 FIX: Larger base size (was 75px)
                height: '270px', // 3:5 Portrait ratio maintained
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                ...transform
              }}
              animate={transform}
              transition={ANIMATION_CONFIG}
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
