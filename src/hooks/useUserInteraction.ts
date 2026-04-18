import { useState, useEffect, useRef } from 'react';
import { initializeAudioContext } from '../utils/audio';

export const useUserInteraction = (initialAudioRef?: React.RefObject<HTMLAudioElement> | null) => {
  const [userInteracted, setUserInteracted] = useState(false);
  const userInteractedRef = useRef(false); // ✅ Synchronous flag for race condition fix
  const [hasAudioContext, setHasAudioContext] = useState(false);

  // Enhanced user interaction detection for PWA with audio context initialization
  useEffect(() => {
    const handleUserInteraction = async (event: Event) => {
      console.log('👆 User interaction detected:', event.type);
      
      userInteractedRef.current = true; // ✅ SYNC - set immediately
      setUserInteracted(true);          // ASYNC - for React re-renders
      
      // Initialize audio context for PWA with retry logic
      try {
        const contextInitialized = await initializeAudioContext();
        setHasAudioContext(contextInitialized);
        
        if (!contextInitialized) {
          // Retry once after a short delay
          console.log('🔊 Retrying audio context initialization...');
          setTimeout(async () => {
            const retryResult = await initializeAudioContext();
            setHasAudioContext(retryResult);
            console.log(`🔊 Audio context retry result: ${retryResult}`);
          }, 100);
        }
      } catch (error) {
        console.error('🔊 Audio context initialization error:', error);
        setHasAudioContext(false);
      }
      
      // Remove all event listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('pointerdown', handleUserInteraction);
    };

    // Listen for multiple types of user interaction including pointer events
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('touchend', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('pointerdown', handleUserInteraction);

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('touchend', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('pointerdown', handleUserInteraction);
    };
  }, []);

  // Prevent default touch behaviors for PWA
  useEffect(() => {
    const preventPullToRefresh = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const touch = e.touches[0];
      if (touch.clientY > 100) return;
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventPullToRefresh, { passive: false });
    return () => document.removeEventListener('touchmove', preventPullToRefresh);
  }, []);

  // Custom setter that updates both ref and state
  const setUserInteractedBoth = (value: boolean) => {
    userInteractedRef.current = value;
    setUserInteracted(value);
  };

  return { 
    userInteracted, 
    userInteractedRef,        // ✅ Expose ref for synchronous checks
    hasAudioContext, 
    setUserInteracted: setUserInteractedBoth 
  };
};