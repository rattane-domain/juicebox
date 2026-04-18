import { RefObject } from 'react';

interface CoreEventHandlerProps {
  // Core audio manager - NEW FUNCTIONS
  moveToDrink: (index: number) => void; // Visual carousel movement
  activateCenteredDrink: () => Promise<void>; // Tap to activate centered drink
  togglePlayPause: () => void; // Mute/unmute
  centerDrinkIndex: number; // Visual center
  activeDrinkIndex: number | null; // Audio active
  isPlaying: boolean;
  
  // Visual carousel
  visualIndex: number;
  handleSwipeLeft: () => number;
  handleSwipeRight: () => number;
  transitionToIndex: (index: number, immediate?: boolean) => void;
  
  // User interaction
  setUserInteracted: (value: boolean) => void;
  
  // App state
  totalDrinks: number;
}

export const createCoreEventHandlers = ({
  moveToDrink,
  activateCenteredDrink,
  togglePlayPause,
  centerDrinkIndex,
  activeDrinkIndex,
  isPlaying,
  visualIndex,
  handleSwipeLeft,
  handleSwipeRight,
  transitionToIndex,
  setUserInteracted,
  totalDrinks
}: CoreEventHandlerProps) => {

  // Handle drink change (swipe/navigation gestures)
  const handleDrinkChange = async (direction: 'left' | 'right') => {
    console.log(`👆 Carousel navigation: ${direction}`);
    setUserInteracted(true);
    
    let newVisualIndex: number;
    
    // Update visual immediately
    if (direction === 'left') {
      newVisualIndex = handleSwipeLeft();
    } else {
      newVisualIndex = handleSwipeRight();
    }
    
    // Update audio manager's center drink (for preloading)
    moveToDrink(newVisualIndex);
  };

  // Handle centered drink tap - NEW: Tap to activate
  const handleCenteredDrinkTap = async () => {
    console.log(`👆 Centered drink tap - activating`);
    setUserInteracted(true);
    
    // Activate the centered drink (handles all logic internally)
    await activateCenteredDrink();
  };

  // Sync visual to audio (when audio system changes position)
  const syncVisualToAudio = (audioIndex: number, immediate: boolean = false) => {
    if (audioIndex !== visualIndex) {
      console.log(`🔄 Syncing visual to audio: ${visualIndex} → ${audioIndex}`);
      transitionToIndex(audioIndex, immediate);
    }
  };

  // Mock switching state function for compatibility
  const isSwitching = () => false;

  return {
    handleDrinkChange, // Swipe/navigation
    handleCenteredDrinkTap, // NEW: Tap centered drink to activate
    syncVisualToAudio,
    isSwitching
  };
};
