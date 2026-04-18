import { useState, useRef, useCallback } from 'react';
import { RadioStation } from '../types/radio';
import { DRINK_REGISTRY, getDrinkStationConfig } from '../constants/drinks';

/**
 * ULTRA-SIMPLE PLAYER WITH SMOOTH TRANSITIONS
 * - Only 2 inputs: tap active center (mute), tap passive center (activate)
 * - Smooth crossfade: old drink plays until new one is ready
 * - No abrupt stops
 * 
 * v16.1: Race condition fix - uses ref instead of state for userInteracted check
 */

interface PlayerState {
  activeDrinkIndex: number | null;
  isLoading: boolean;
  isMuted: boolean;
  isPlaying: boolean;
}

export const useSimplePlayer = (userInteractedRef: React.RefObject<boolean>) => {
  const [playerState, setPlayerState] = useState<PlayerState>({
    activeDrinkIndex: null,
    isLoading: false,
    isMuted: false,
    isPlaying: false
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentStationRef = useRef<RadioStation | null>(null);
  const loadingAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendingLoadRef = useRef<number | null>(null); // Track which drink is being loaded
  const abortControllerRef = useRef<AbortController | null>(null); // Abort controller for cancellation

  // Initialize audio element
  if (!audioRef.current) {
    audioRef.current = new Audio();
    audioRef.current.crossOrigin = 'anonymous';
    audioRef.current.preload = 'none';
  }

  // Load and play a drink
  const activateDrink = useCallback(async (drinkIndex: number) => {
    // ✅ FIX: Use ref.current for synchronous check (no race condition)
    if (!userInteractedRef.current) {
      console.warn('⚠️ activateDrink called before user interaction');
      return;
    }

    const drink = DRINK_REGISTRY[drinkIndex];
    const stationConfig = getDrinkStationConfig(drink.id);
    
    if (!stationConfig) {
      console.error(`❌ No station for ${drink.displayName}`);
      return;
    }

    // ABORT PREVIOUS LOAD if user clicked a new drink
    if (pendingLoadRef.current !== null && pendingLoadRef.current !== drinkIndex) {
      console.log(`⚠️ ABORT: User clicked drink ${drinkIndex}, canceling previous load ${pendingLoadRef.current}`);
      
      // Abort previous load
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Clean up loading audio
      if (loadingAudioRef.current) {
        loadingAudioRef.current.pause();
        loadingAudioRef.current.removeAttribute('src');
        loadingAudioRef.current.load();
        loadingAudioRef.current = null;
      }
    }
    
    // Mark this drink as pending
    pendingLoadRef.current = drinkIndex;
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    console.log(`🎵 Activating ${drink.displayName} → ${stationConfig.name}`);
    
    // Show loading (but keep old drink playing)
    setPlayerState(prev => ({
      ...prev,
      isLoading: true
    }));

    // Create new audio element for loading
    const newAudio = new Audio();
    newAudio.crossOrigin = 'anonymous';
    newAudio.preload = 'none';
    loadingAudioRef.current = newAudio;

    // Load new station
    try {
      // Check if aborted before starting
      if (signal.aborted) {
        console.log(`⚠️ Load aborted before start for ${drink.displayName}`);
        return;
      }
      
      newAudio.src = stationConfig.primaryUrl;
      newAudio.load();

      // Wait for canplay (with abort support)
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Timeout')), 15000);
        
        const handleAbort = () => {
          clearTimeout(timeout);
          newAudio.removeEventListener('canplay', handleCanPlay);
          newAudio.removeEventListener('error', handleError);
          reject(new Error('Aborted'));
        };
        
        const handleCanPlay = () => {
          if (signal.aborted) {
            console.log(`⚠️ Load aborted during canplay for ${drink.displayName}`);
            handleAbort();
            return;
          }
          
          clearTimeout(timeout);
          newAudio.removeEventListener('canplay', handleCanPlay);
          newAudio.removeEventListener('error', handleError);
          signal.removeEventListener('abort', handleAbort);
          resolve();
        };
        
        const handleError = () => {
          clearTimeout(timeout);
          newAudio.removeEventListener('canplay', handleCanPlay);
          newAudio.removeEventListener('error', handleError);
          signal.removeEventListener('abort', handleAbort);
          reject(new Error('Load error'));
        };
        
        newAudio.addEventListener('canplay', handleCanPlay, { once: true });
        newAudio.addEventListener('error', handleError, { once: true });
        signal.addEventListener('abort', handleAbort, { once: true });
      });

      // Check if aborted before switching
      if (signal.aborted) {
        console.log(`⚠️ Load aborted before play for ${drink.displayName}`);
        newAudio.pause();
        newAudio.removeAttribute('src');
        newAudio.load();
        return;
      }
      
      // New audio is ready! Now switch from old to new
      const oldAudio = audioRef.current;
      
      // Stop old audio
      if (oldAudio) {
        oldAudio.pause();
        oldAudio.currentTime = 0;
        oldAudio.removeAttribute('src');
        oldAudio.load();
      }

      // Start new audio
      newAudio.volume = 1;
      newAudio.muted = false;
      
      // iOS FIX: Add detailed error logging
      try {
        await newAudio.play();
        console.log(`📱 iOS: Successfully started playback for ${drink.displayName}`);
      } catch (playError: any) {
        console.error(`📱 iOS: Play failed for ${drink.displayName}:`, playError.name, playError.message);
        throw playError;
      }

      // Replace audio reference
      audioRef.current = newAudio;
      loadingAudioRef.current = null;
      pendingLoadRef.current = null; // Clear pending load
      abortControllerRef.current = null; // Clear abort controller

      // Success
      setPlayerState({
        activeDrinkIndex: drinkIndex,
        isLoading: false,
        isMuted: false,
        isPlaying: true
      });

      console.log(`✅ Playing ${drink.displayName}`);
      
    } catch (error: any) {
      // Check if error is due to abort
      if (error.message === 'Aborted') {
        console.log(`⚠️ Load aborted for ${drink.displayName}`);
        // Don't update state if aborted - new load is already in progress
        return;
      }
      
      console.error(`❌ Failed to activate ${drink.displayName}:`, error);
      
      // Clean up loading audio
      if (loadingAudioRef.current) {
        loadingAudioRef.current.pause();
        loadingAudioRef.current.removeAttribute('src');
        loadingAudioRef.current = null;
      }
      
      // Clear pending load
      if (pendingLoadRef.current === drinkIndex) {
        pendingLoadRef.current = null;
      }
      
      setPlayerState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  }, []); // ✅ FIX: No dependencies - ref is stable and .current is always up-to-date

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current || playerState.activeDrinkIndex === null) return;

    const newMuted = !playerState.isMuted;
    audioRef.current.muted = newMuted;
    
    setPlayerState(prev => ({
      ...prev,
      isMuted: newMuted
    }));

    console.log(`🔇 ${newMuted ? 'Muted' : 'Unmuted'}`);
  }, [playerState.isMuted, playerState.activeDrinkIndex]);

  // Cleanup
  const cleanup = useCallback(() => {
    // Abort any pending loads
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
    if (loadingAudioRef.current) {
      loadingAudioRef.current.pause();
      loadingAudioRef.current.removeAttribute('src');
      loadingAudioRef.current.load();
    }
    
    pendingLoadRef.current = null;
  }, []);

  return {
    activeDrinkIndex: playerState.activeDrinkIndex,
    isLoading: playerState.isLoading,
    isMuted: playerState.isMuted,
    isPlaying: playerState.isPlaying,
    currentStation: currentStationRef.current,
    activateDrink,
    toggleMute,
    cleanup
  };
};
