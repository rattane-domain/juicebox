import { useState, useEffect, useRef } from 'react';
import { DRINK_REGISTRY } from '../constants/drinks';

interface UseSleepTimerProps {
  activeDrinkIndex: number | null;
  isPlaying: boolean;
  onSleepTimerComplete: () => void;
}

interface SleepTimerState {
  isActive: boolean;
  remainingSeconds: number;
  totalSeconds: number;
}

/**
 * Sleep Timer Hook
 * 
 * Manages sleep timer for drinks with sleepTimer property.
 * - Starts after 3 seconds of active playback
 * - Counts down from configured duration
 * - Triggers audio stop at completion (future: volume fade)
 */
export function useSleepTimer({
  activeDrinkIndex,
  isPlaying,
  onSleepTimerComplete
}: UseSleepTimerProps): SleepTimerState {
  const [isActive, setIsActive] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  
  const startDelayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get current drink config
  const currentDrink = activeDrinkIndex !== null ? DRINK_REGISTRY[activeDrinkIndex] : null;
  const sleepConfig = currentDrink?.sleepTimer;

  useEffect(() => {
    console.log('🌙 Sleep Timer State:', {
      activeDrink: currentDrink?.displayName,
      isPlaying,
      hasSleepTimer: !!sleepConfig?.enabled,
      isActive,
      remainingSeconds
    });
  }, [activeDrinkIndex, isPlaying, isActive, remainingSeconds]);

  // Cleanup function
  const cleanup = () => {
    if (startDelayTimerRef.current) {
      clearTimeout(startDelayTimerRef.current);
      startDelayTimerRef.current = null;
    }
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setIsActive(false);
    setRemainingSeconds(0);
    setTotalSeconds(0);
  };

  // Main effect: Manage sleep timer lifecycle
  useEffect(() => {
    cleanup();

    // Don't start timer if:
    // 1. No active drink
    // 2. Not playing
    // 3. Drink doesn't have sleep timer enabled
    if (!currentDrink || !isPlaying || !sleepConfig?.enabled) {
      return;
    }

    console.log(`🌙 Sleep timer enabled for ${currentDrink.displayName}`);
    
    // Use configured duration from drink config
    const timerDurationSeconds = sleepConfig.durationMinutes * 60;
    console.log(`⏰ Will start ${sleepConfig.durationMinutes} minute timer after 3 seconds`);
    
    setTotalSeconds(timerDurationSeconds);

    // Wait 3 seconds before starting countdown
    startDelayTimerRef.current = setTimeout(() => {
      console.log(`🌙 Starting sleep timer countdown: ${timerDurationSeconds}s`);
      setIsActive(true);
      setRemainingSeconds(timerDurationSeconds);

      // Start countdown
      countdownTimerRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          const newValue = prev - 1;
          
          if (newValue <= 0) {
            console.log('🌙 Sleep timer complete! Stopping audio...');
            
            // Clear interval
            if (countdownTimerRef.current) {
              clearInterval(countdownTimerRef.current);
              countdownTimerRef.current = null;
            }
            
            // Complete immediately
            // TODO: Implement audio volume fade-out here
            onSleepTimerComplete();
            
            return 0;
          }
          
          // Log every 60 seconds (1 minute)
          if (newValue % 60 === 0) {
            const minutesRemaining = Math.floor(newValue / 60);
            console.log(`🌙 Sleep timer: ${minutesRemaining} minutes remaining`);
          }
          
          return newValue;
        });
      }, 1000);
    }, 3000); // 3 second delay before starting

    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [activeDrinkIndex, isPlaying, sleepConfig?.enabled]);

  return {
    isActive,
    remainingSeconds,
    totalSeconds
  };
}
