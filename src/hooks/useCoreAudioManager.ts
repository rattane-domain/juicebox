import { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner@2.0.3';
import { RadioStation } from '../types/radio';
import { getBestAudioUrl } from '../utils/audio';
import { DRINK_REGISTRY, getDrinkStationConfig } from '../constants/drinks';

interface AudioStream {
  audio: HTMLAudioElement;
  station: RadioStation | null;
  isLoaded: boolean;
  isLoading: boolean;
  drinkId: string;
  drinkIndex: number;
}

interface CoreAudioState {
  // SEPARATED INDICES - KEY CHANGE
  centerDrinkIndex: number; // Visual center (what user sees)
  activeDrinkIndex: number | null; // Audio active (what's playing)
  centerPreloadIndex: number | null; // What we're currently preloading
  
  // Audio state
  activeStream: AudioStream | null; // Currently playing stream
  
  // Loading states
  isLoadingDrink: boolean; // TRUE when activating a new drink
  loadingAnimationStartTime: number | null; // Track minimum animation duration
  
  // Countdown system (60 seconds after mute)
  countdownActive: boolean;
  countdownSeconds: number;
  userHasInteracted: boolean;
  
  // Sleep timer system
  sleepTimer: {
    active: boolean;
    remainingSeconds: number;
    drinkIndex: number | null;
    fadingOut: boolean;
    paused: boolean;
  };
  
  // System state
  systemInitialized: boolean;
  userHasPaused: boolean;
  globalVolumeOverride: number | null;
  
  // Mute-based pause system
  isMuted: boolean;
  wasMutedLongTime: boolean;
}

const COUNTDOWN_DURATION = 60;
const MUTE_TIMEOUT_MS = 60 * 1000; // 60 seconds (changed from 4 minutes per requirements)
const MIN_LOADING_ANIMATION_MS = 1000; // Minimum 1 second loading animation (one loop)

export const useCoreAudioManager = (userInteracted: boolean, hasAudioContext: boolean) => {
  const [coreState, setCoreState] = useState<CoreAudioState>({
    centerDrinkIndex: 0,
    activeDrinkIndex: null, // No active drink initially
    centerPreloadIndex: null,
    activeStream: null,
    isLoadingDrink: false,
    loadingAnimationStartTime: null,
    countdownActive: false,
    countdownSeconds: COUNTDOWN_DURATION,
    userHasInteracted: false,
    sleepTimer: {
      active: false,
      remainingSeconds: 0,
      drinkIndex: null,
      fadingOut: false,
      paused: false
    },
    systemInitialized: false,
    userHasPaused: false,
    globalVolumeOverride: null,
    isMuted: false,
    wasMutedLongTime: false
  });

  // Stream registry
  const streamsRef = useRef<Map<number, AudioStream>>(new Map());
  const allAudioElementsRef = useRef<Set<HTMLAudioElement>>(new Set());
  
  // Latest state ref for callbacks
  const latestStateRef = useRef(coreState);
  latestStateRef.current = coreState;
  
  // Timers
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sleepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sleepFadeRef = useRef<NodeJS.Timeout | null>(null);
  const muteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const muteStartTimeRef = useRef<number | null>(null);
  const preloadAbortRef = useRef<(() => void) | null>(null);

  // Helper: Create or get stream for drink index
  const getOrCreateStream = useCallback((drinkIndex: number): AudioStream => {
    const existing = streamsRef.current.get(drinkIndex);
    if (existing) {
      return existing;
    }

    const drink = DRINK_REGISTRY[drinkIndex];
    const audio = new Audio();
    audio.preload = 'auto';
    audio.muted = true;
    audio.playsInline = true;
    audio.volume = 0;
    
    allAudioElementsRef.current.add(audio);
    
    const stream: AudioStream = {
      audio,
      station: null,
      isLoaded: false,
      isLoading: false,
      drinkId: drink.id,
      drinkIndex
    };

    streamsRef.current.set(drinkIndex, stream);
    
    console.log(`🎵 Created stream for ${drink.displayName} (index ${drinkIndex})`);
    return stream;
  }, []);

  // Core: Load station into stream
  const loadStation = useCallback(async (drinkIndex: number, abortSignal?: { aborted: boolean }): Promise<boolean> => {
    const stream = getOrCreateStream(drinkIndex);
    const drink = DRINK_REGISTRY[drinkIndex];
    const stationConfig = getDrinkStationConfig(drink.id);
    
    if (!stationConfig) {
      console.log(`❌ No station config for ${drink.displayName}`);
      return false;
    }

    if (stream.isLoaded || stream.isLoading) {
      return stream.isLoaded;
    }

    console.log(`📡 Loading ${drink.displayName} → ${stationConfig.name}`);
    stream.isLoading = true;
    
    const actualStreamUrl = stationConfig.primaryUrl;

    const currentTime = new Date().toISOString();
    const station: RadioStation = {
      stationuuid: `direct-${drink.id}`,
      name: stationConfig.name,
      url: stationConfig.primaryUrl,
      url_resolved: actualStreamUrl,
      homepage: '', favicon: '', tags: stationConfig.description,
      country: '', countrycode: '', state: '', language: '', languagecodes: '',
      votes: 1000, lastchangetime: currentTime, lastchangetime_iso8601: currentTime,
      lastcheckok: 1, lastchecktime: currentTime, lastchecktime_iso8601: currentTime,
      lastcheckoktime: currentTime, lastcheckoktime_iso8601: currentTime,
      lastlocalchecktime: currentTime, clicktimestamp: currentTime,
      clickcount: 1000, clicktrend: 0, ssl_error: 0, geo_lat: 0, geo_long: 0,
      has_extended_info: false, bitrate: 256,
      codec: actualStreamUrl.includes('.aac') ? 'AAC' : 'MP3',
      hls: 0
    };

    stream.station = station;
    
    try {
      // Check abort signal before starting
      if (abortSignal?.aborted) {
        console.log(`⚠️ Load aborted for ${drink.displayName} (before start)`);
        stream.isLoading = false;
        return false;
      }

      stream.audio.pause();
      stream.audio.currentTime = 0;
      stream.audio.removeAttribute('src');
      stream.audio.crossOrigin = 'anonymous';
      stream.audio.volume = 0;
      stream.audio.muted = true;
      stream.audio.load();
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Check abort signal after delay
      if (abortSignal?.aborted) {
        console.log(`⚠️ Load aborted for ${drink.displayName} (after delay)`);
        stream.isLoading = false;
        return false;
      }
      
      stream.audio.src = actualStreamUrl;
      stream.audio.load();
      
      // Wait for load
      const loadResult = await new Promise<boolean>((resolve) => {
        let resolved = false;
        
        const cleanup = () => {
          stream.audio.removeEventListener('canplay', handleCanPlay);
          stream.audio.removeEventListener('error', handleError);
          stream.audio.removeEventListener('loadstart', handleLoadStart);
        };
        
        const handleLoadStart = () => {
          if (abortSignal?.aborted) {
            resolved = true;
            cleanup();
            resolve(false);
            return;
          }
          stream.audio.volume = 0;
          stream.audio.muted = true;
        };
        
        const handleCanPlay = () => {
          if (resolved || abortSignal?.aborted) return;
          resolved = true;
          cleanup();
          
          stream.audio.volume = 0;
          stream.audio.muted = true;
          
          resolve(true);
        };
        
        const handleError = (event: Event) => {
          if (resolved) return;
          resolved = true;
          cleanup();
          console.error(`❌ Audio load error for ${station.name}`);
          resolve(false);
        };
        
        stream.audio.addEventListener('loadstart', handleLoadStart);
        stream.audio.addEventListener('canplay', handleCanPlay, { once: true });
        stream.audio.addEventListener('error', handleError, { once: true });
        
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            cleanup();
            console.log(`⏰ Load timeout for ${station.name} after 15s`);
            resolve(false);
          }
        }, 15000);
      });
      
      stream.isLoading = false;
      stream.isLoaded = loadResult;
      
      if (loadResult) {
        console.log(`✅ Loaded: ${station.name} for ${drink.displayName}`);
        
        if (!stream.audio.muted || stream.audio.volume > 0) {
          console.log(`🔇 ENFORCING: Muting ${station.name} after load`);
          stream.audio.volume = 0;
          stream.audio.muted = true;
        }
      } else {
        console.log(`❌ Failed to load: ${station.name} for ${drink.displayName}`);
        
        stream.station = null;
        stream.audio.pause();
        stream.audio.removeAttribute('src');
        stream.audio.load();
      }
      
      return loadResult;
      
    } catch (error) {
      console.error(`❌ Load error for ${station.name}:`, error);
      stream.isLoading = false;
      stream.isLoaded = false;
      
      stream.audio.pause();
      stream.audio.removeAttribute('src');
      stream.audio.load();
      
      return false;
    }
  }, [getOrCreateStream]);

  // Core: Make stream active (playing with volume)
  const makeStreamActive = useCallback(async (stream: AudioStream): Promise<boolean> => {
    if (!stream?.isLoaded) return false;
    
    try {
      // Stop any currently active stream first
      const currentActiveStream = latestStateRef.current.activeStream;
      if (currentActiveStream && currentActiveStream !== stream) {
        currentActiveStream.audio.pause();
        currentActiveStream.audio.volume = 0;
        currentActiveStream.audio.muted = true;
        console.log(`🛑 Stopped previous active: ${currentActiveStream.station?.name}`);
      }
      
      // Configure new active stream
      const currentState = latestStateRef.current;
      const targetVolume = currentState.globalVolumeOverride !== null ? currentState.globalVolumeOverride : 1.0;
      const shouldBeMuted = currentState.isMuted || targetVolume === 0;
      
      stream.audio.muted = shouldBeMuted;
      stream.audio.volume = shouldBeMuted ? 0 : targetVolume;
      
      console.log(`🎵 Setting active stream volume: ${Math.round(targetVolume * 100)}% (muted: ${stream.audio.muted})`);
      
      if (stream.audio.paused) {
        console.log(`🔄 Starting paused stream: ${stream.station?.name}`);
        await stream.audio.play();
      }
      
      console.log(`🎵 ACTIVE: ${stream.station?.name} (${DRINK_REGISTRY[stream.drinkIndex].displayName}) - ${shouldBeMuted ? 'MUTED' : 'PLAYING'}`);
      return !stream.audio.paused;
      
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        console.log(`🔇 Autoplay blocked by browser - waiting for user interaction`);
      } else {
        console.error(`❌ Failed to activate stream:`, error);
      }
      return false;
    }
  }, []);

  // NEW: Activate centered drink (called by tap handler)
  const activateCenteredDrink = useCallback(async () => {
    // Get fresh state
    const currentState = latestStateRef.current;
    const { centerDrinkIndex, activeDrinkIndex, isMuted, activeStream } = currentState;
    
    console.log(`🎯 Activate centered drink called - center: ${centerDrinkIndex}, active: ${activeDrinkIndex}, muted: ${isMuted}`);
    
    // Case 1: Centered drink is already active and not muted → mute it
    if (activeDrinkIndex === centerDrinkIndex && !isMuted && activeStream) {
      console.log(`🔇 Muting active centered drink`);
      
      // Mute the stream directly (same logic as togglePlayPause)
      muteStartTimeRef.current = Date.now();
      
      // Clear any existing timeout
      if (muteTimeoutRef.current) {
        clearTimeout(muteTimeoutRef.current);
      }
      
      // Set timeout to stop stream after 60 seconds
      muteTimeoutRef.current = setTimeout(() => {
        console.log(`⏰ Stream has been muted for 60s - stopping playback`);
        
        const currentStream = latestStateRef.current.activeStream;
        if (currentStream) {
          currentStream.audio.pause();
          currentStream.audio.volume = 0;
          currentStream.audio.muted = true;
        }
        
        setCoreState(prev => ({ ...prev, wasMutedLongTime: true }));
      }, MUTE_TIMEOUT_MS);
      
      // Update state and mute audio
      setCoreState(prev => {
        if (prev.activeStream) {
          prev.activeStream.audio.muted = true;
          prev.activeStream.audio.volume = 0;
        }
        
        return {
          ...prev,
          isMuted: true,
          userHasPaused: true
        };
      });
      
      return;
    }
    
    // Case 2: Centered drink is active but muted → reload/unmute it
    // Case 3: Centered drink is inactive → load and activate it
    // Both cases: show loading animation and load/activate
    
    console.log(`🔄 Starting loading animation for drink ${centerDrinkIndex}`);
    
    // Check if stream is already loaded or loading
    const existingStream = streamsRef.current.get(centerDrinkIndex);
    const isAlreadyLoaded = existingStream?.isLoaded === true;
    const isCurrentlyLoading = existingStream?.isLoading === true;
    
    // Start loading animation
    const loadStartTime = Date.now();
    setCoreState(prev => ({
      ...prev,
      isLoadingDrink: true,
      loadingAnimationStartTime: loadStartTime,
      isMuted: false, // Unmute when activating
      wasMutedLongTime: false // Reset long mute flag
    }));
    
    // Clear mute timeout if it exists
    if (muteTimeoutRef.current) {
      clearTimeout(muteTimeoutRef.current);
      muteTimeoutRef.current = null;
    }
    muteStartTimeRef.current = null;
    
    // Handle different states
    let success = false;
    
    if (isAlreadyLoaded) {
      console.log(`✨ Stream ${centerDrinkIndex} already loaded, activating directly`);
      success = true;
    } else if (isCurrentlyLoading) {
      console.log(`⏳ Stream ${centerDrinkIndex} is currently loading, waiting...`);
      // Wait for the stream to finish loading (with timeout)
      const maxWaitTime = 10000; // 10 seconds
      const startWait = Date.now();
      
      while (Date.now() - startWait < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const stream = streamsRef.current.get(centerDrinkIndex);
        if (stream?.isLoaded) {
          console.log(`✅ Stream ${centerDrinkIndex} finished loading`);
          success = true;
          break;
        }
        if (!stream?.isLoading) {
          console.log(`⚠️ Stream ${centerDrinkIndex} stopped loading without success`);
          break;
        }
      }
      
      if (!success) {
        console.log(`⏰ Timeout waiting for stream ${centerDrinkIndex} to load`);
      }
    } else {
      // Load the station
      console.log(`📡 Loading stream ${centerDrinkIndex} from scratch`);
      success = await loadStation(centerDrinkIndex);
    }
    
    if (success) {
      const stream = streamsRef.current.get(centerDrinkIndex);
      if (stream && stream.isLoaded) {
        // Ensure minimum loading animation duration
        const elapsed = Date.now() - loadStartTime;
        const remainingTime = Math.max(0, MIN_LOADING_ANIMATION_MS - elapsed);
        
        if (remainingTime > 0) {
          console.log(`⏳ Waiting ${remainingTime}ms for minimum loading animation`);
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        // Activate the stream
        const activated = await makeStreamActive(stream);
        
        setCoreState(prev => ({
          ...prev,
          activeStream: stream,
          activeDrinkIndex: centerDrinkIndex,
          isLoadingDrink: false,
          loadingAnimationStartTime: null,
          systemInitialized: true,
          userHasPaused: false
        }));
        
        console.log(`✅ Successfully activated drink ${centerDrinkIndex}`);
      } else {
        // Stream loaded but not actually ready
        console.log(`⚠️ Stream ${centerDrinkIndex} reported loaded but not ready`);
        setCoreState(prev => ({
          ...prev,
          isLoadingDrink: false,
          loadingAnimationStartTime: null
        }));
      }
    } else {
      // Failed to load
      setCoreState(prev => ({
        ...prev,
        isLoadingDrink: false,
        loadingAnimationStartTime: null
      }));
      console.log(`❌ Failed to activate drink ${centerDrinkIndex}`);
    }
  }, [loadStation, makeStreamActive]);

  // NEW: Move carousel (visual only, doesn't affect audio)
  const moveToDrink = useCallback((targetIndex: number) => {
    console.log(`🎠 Moving carousel to drink ${targetIndex} (${DRINK_REGISTRY[targetIndex]?.displayName})`);
    
    setCoreState(prev => {
      // If we were preloading something else, abort it
      if (prev.centerPreloadIndex !== null && prev.centerPreloadIndex !== targetIndex) {
        console.log(`⚠️ Aborting preload of drink ${prev.centerPreloadIndex}`);
        if (preloadAbortRef.current) {
          preloadAbortRef.current();
          preloadAbortRef.current = null;
        }
      }
      
      return {
        ...prev,
        centerDrinkIndex: targetIndex,
        centerPreloadIndex: targetIndex // Start preloading this drink
      };
    });
  }, []);

  // Preload center drink effect
  useEffect(() => {
    const { centerPreloadIndex, activeDrinkIndex, isLoadingDrink } = coreState;
    
    // Only preload if:
    // 1. We have a center preload index
    // 2. It's not already the active drink
    // 3. We're not currently loading a drink activation
    if (centerPreloadIndex === null || 
        centerPreloadIndex === activeDrinkIndex || 
        isLoadingDrink) {
      return;
    }
    
    const stream = streamsRef.current.get(centerPreloadIndex);
    if (stream?.isLoaded || stream?.isLoading) {
      console.log(`⏭️ Drink ${centerPreloadIndex} already loaded/loading, skipping preload`);
      return;
    }
    
    console.log(`⚡ Preloading centered drink ${centerPreloadIndex}`);
    
    // Create abort signal
    const abortSignal = { aborted: false };
    preloadAbortRef.current = () => {
      abortSignal.aborted = true;
    };
    
    // Start preload
    loadStation(centerPreloadIndex, abortSignal).then(success => {
      if (success && !abortSignal.aborted) {
        console.log(`✅ Preload complete for drink ${centerPreloadIndex}`);
      } else if (abortSignal.aborted) {
        console.log(`⚠️ Preload aborted for drink ${centerPreloadIndex}`);
      }
    });
    
    // Cleanup
    return () => {
      if (preloadAbortRef.current) {
        preloadAbortRef.current();
        preloadAbortRef.current = null;
      }
    };
  }, [coreState.centerPreloadIndex, coreState.activeDrinkIndex, coreState.isLoadingDrink]);

  // Toggle play/pause with mute-based system
  const togglePlayPause = useCallback(() => {
    console.log(`🎵 Toggle Play/Pause called - current muted: ${latestStateRef.current.isMuted}`);
    
    setCoreState(prev => {
      const newMuted = !prev.isMuted;
      
      // Handle mute timeout tracking
      if (newMuted) {
        // User is muting - start timeout tracking
        muteStartTimeRef.current = Date.now();
        
        // Clear any existing timeout
        if (muteTimeoutRef.current) {
          clearTimeout(muteTimeoutRef.current);
        }
        
        // Set timeout to stop stream after 60 seconds
        muteTimeoutRef.current = setTimeout(() => {
          console.log(`⏰ Stream has been muted for 60s - stopping playback`);
          
          const currentStream = latestStateRef.current.activeStream;
          if (currentStream) {
            currentStream.audio.pause();
            currentStream.audio.volume = 0;
            currentStream.audio.muted = true;
          }
          
          setCoreState(prev => ({ ...prev, wasMutedLongTime: true }));
        }, MUTE_TIMEOUT_MS);
        
        console.log(`🔇 MUTING audio (user pause)`);
      } else {
        // User is unmuting - clear timeout tracking
        muteStartTimeRef.current = null;
        
        if (muteTimeoutRef.current) {
          clearTimeout(muteTimeoutRef.current);
          muteTimeoutRef.current = null;
        }
        
        console.log(`🔊 UNMUTING audio (user play)`);
      }
      
      // Update active stream immediately if we have one
      if (prev.activeStream) {
        const targetVolume = prev.globalVolumeOverride !== null ? prev.globalVolumeOverride : 1.0;
        const shouldBeMuted = newMuted || targetVolume === 0;
        
        prev.activeStream.audio.muted = shouldBeMuted;
        prev.activeStream.audio.volume = shouldBeMuted ? 0 : targetVolume;
        
        console.log(`🎵 Updated active stream mute state: ${shouldBeMuted} (volume: ${prev.activeStream.audio.volume})`);
      }
      
      return {
        ...prev,
        isMuted: newMuted,
        systemInitialized: true,
        userHasPaused: newMuted
      };
    });
  }, []);

  // Volume control
  const setVolume = useCallback((volume: number) => {
    setCoreState(prev => ({
      ...prev,
      globalVolumeOverride: volume
    }));
    
    // Update active stream volume immediately
    const currentState = latestStateRef.current;
    if (currentState.activeStream && !currentState.isMuted) {
      currentState.activeStream.audio.volume = volume;
      console.log(`🔊 Volume set to ${Math.round(volume * 100)}%`);
    }
  }, []);

  // Stream status helpers
  const getStreamStatus = useCallback((drinkIndex: number) => {
    const stream = streamsRef.current.get(drinkIndex);
    if (!stream) return { status: 'unknown' };
    if (stream.isLoading) return { status: 'loading' };
    if (stream.isLoaded) return { status: 'loaded' };
    return { status: 'error' };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up all timers
      if (muteTimeoutRef.current) {
        clearTimeout(muteTimeoutRef.current);
      }
      if (countdownTimerRef.current) {
        clearTimeout(countdownTimerRef.current);
      }
      if (sleepTimerRef.current) {
        clearTimeout(sleepTimerRef.current);
      }
      if (sleepFadeRef.current) {
        clearTimeout(sleepFadeRef.current);
      }
      if (preloadAbortRef.current) {
        preloadAbortRef.current();
      }
      
      // Stop and clean up all audio elements
      allAudioElementsRef.current.forEach(audio => {
        try {
          audio.pause();
          audio.volume = 0;
          audio.muted = true;
          audio.removeAttribute('src');
          audio.load();
        } catch (error) {
          console.warn('Error cleaning up audio element:', error);
        }
      });
      
      allAudioElementsRef.current.clear();
      streamsRef.current.clear();
    };
  }, []);

  // Return the hook interface
  return {
    // State
    centerDrinkIndex: coreState.centerDrinkIndex,
    activeDrinkIndex: coreState.activeDrinkIndex,
    isPlaying: coreState.activeStream !== null && !coreState.activeStream.audio.paused && !coreState.isMuted,
    isLoading: coreState.isLoadingDrink,
    currentStation: coreState.activeStream?.station || null,
    activeDrinkIndices: coreState.activeDrinkIndex !== null ? [coreState.activeDrinkIndex] : [],
    countdownActive: coreState.countdownActive,
    countdownSeconds: coreState.countdownSeconds,
    sleepTimerActive: coreState.sleepTimer.active,
    sleepTimerSeconds: coreState.sleepTimer.remainingSeconds,
    sleepTimerDrinkIndex: coreState.sleepTimer.drinkIndex,
    coreState,
    
    // Actions
    moveToDrink, // NEW: Carousel movement (visual only)
    activateCenteredDrink, // NEW: Tap-to-activate centered drink
    togglePlayPause, // Mute/unmute active drink
    setVolume,
    getStreamStatus
  };
};
