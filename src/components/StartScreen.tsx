import React, { useState, useRef } from 'react';
import UpdateStickerV16 from '../imports/UpdateStickerV16';
import StartAnimation from '../imports/StartAnimation-7227-63';
import { APP_VERSION } from '../constants/app';

/**
 * START SCREEN v16.1
 * 
 * Race condition fix:
 * - Removed local useUserInteraction instance (was causing dual state)
 * - userInteracted is now managed only in App.tsx
 * - onFirstSwipe callback handles all interaction tracking
 */

interface StartScreenProps {
  onComplete: () => void;
  onFirstSwipe?: () => void;
  onVolumeChange?: (volume: number) => void;
  userInteracted?: boolean;
  isFirstStationLoading?: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({ 
  onComplete, 
  onFirstSwipe,
}) => {
  // ✅ v16.1: Removed local useUserInteraction instance
  // userInteracted is managed in App.tsx via onFirstSwipe callback
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const hasSwiped = useRef(false);
  
  // Maximum distance the straw can travel (fully inserted)
  const MAX_INSERTION = 80;

  const handlePointerDown = (e: React.PointerEvent) => {
    touchStartY.current = e.clientY;
    hasSwiped.current = false;
    console.log('👇 Pointer down at Y:', e.clientY);

    // Start loading the first drink immediately on touch —
    // iOS audio context unlocks on pointerdown, so starting here
    // gives the stream maximum time to buffer before the swipe completes.
    if (onFirstSwipe) {
      onFirstSwipe();
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (touchStartY.current === null) return;
    
    const currentY = e.clientY;
    const deltaY = currentY - touchStartY.current;
    
    // Only allow downward swipes (positive deltaY)
    const clampedDeltaY = Math.max(0, Math.min(deltaY, MAX_INSERTION));
    
    // Mark as swipe if moved more than 5px
    if (Math.abs(deltaY) > 5) {
      hasSwiped.current = true;
    }
    
    // Update swipe offset for straw animation
    setSwipeOffset(clampedDeltaY);
    console.log('🥤 Straw insertion:', clampedDeltaY, '/', MAX_INSERTION);
  };

  const handlePointerUp = () => {
    console.log('👆 Pointer up, insertion:', swipeOffset, 'hasSwiped:', hasSwiped.current);
    
    // If straw is fully inserted, launch app
    if (swipeOffset >= MAX_INSERTION * 0.9) { // 90% threshold
      console.log('🚀 Straw fully inserted - launching app');
      // ✅ v16.1: Removed local setUserInteracted call
      // userInteracted is now set in App.tsx via onFirstSwipe callback
      
      // Complete (first drink is already loading from handlePointerDown)
      onComplete();
      return;
    }
    
    // Reset swipe offset (spring back)
    setSwipeOffset(0);
    touchStartY.current = null;
    hasSwiped.current = false;
  };

  return (
    <div 
      className="fixed inset-0 bg-background z-50 cursor-pointer touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Sticker - top left */}
      <div 
        className="absolute"
        style={{
          top: '20px',
          left: '-30px',
          width: '290px',
          height: '210px',
          transform: 'rotate(-12deg)',
          opacity: 0.95
        }}
      >
        <UpdateStickerV16 />
      </div>

      {/* Version - top right */}
      <div 
        className="absolute text-xs opacity-30"
        style={{
          top: '20px',
          right: '20px'
        }}
      >
        {APP_VERSION}
      </div>

      {/* StartAnimation - absolute center at 1.1 scale */}
      <div 
        className="absolute"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(1.1)',
          width: '162px',
          height: '270px',
        }}
      >
        <StartAnimation swipeOffset={swipeOffset} />
      </div>

      {/* App name - footer in lower quarter */}
      <div 
        className="absolute text-center text-foreground/70 dark:text-foreground/90"
        style={{
          bottom: 'calc(100vh / 4)',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="text-sm leading-tight">Juicebox</div>
        <div className="text-sm leading-tight">Radio</div>
      </div>
    </div>
  );
};

export default StartScreen;
