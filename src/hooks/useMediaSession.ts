import { useEffect, useCallback } from 'react';
import { RadioStation } from '../types/radio';
import { DRINK_REGISTRY } from '../constants/drinks';

interface UseMediaSessionProps {
  currentStation: RadioStation | null;
  activeDrinkIndex: number | null;
  isPlaying: boolean;
  isMuted: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
}

/**
 * Hook to manage Media Session API for iOS Lock Screen controls
 * Provides station info and skip controls (not seek controls)
 */
export const useMediaSession = ({
  currentStation,
  activeDrinkIndex,
  isPlaying,
  isMuted,
  onPlay,
  onPause,
  onNextTrack,
  onPreviousTrack
}: UseMediaSessionProps) => {
  
  // Update Media Session metadata when station changes
  useEffect(() => {
    if (!('mediaSession' in navigator)) {
      console.log('📱 Media Session API not supported');
      return;
    }

    if (currentStation && activeDrinkIndex !== null) {
      const drink = DRINK_REGISTRY[activeDrinkIndex];

      // useSimplePlayer already sets metadata synchronously before audio.play()
      // so the Lock Screen captures the correct artwork at initialization.
      // We set it again here to keep it fresh on station changes via swipe.
      const origin = window.location.origin;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: drink.displayName,
        artist: currentStation.name,
        album: 'Juicebox Radio',
        artwork: [
          { src: `${origin}/artwork.png`, sizes: '192x192', type: 'image/png' },
          { src: `${origin}/icon-512x512.png`, sizes: '512x512', type: 'image/png' }
        ]
      });
      console.log(`📱 Media Session: Updated metadata for ${drink.displayName} - ${currentStation.name}`);
    } else {
      // Clear metadata when nothing is playing
      navigator.mediaSession.metadata = null;
      console.log('📱 Media Session: Cleared metadata');
    }
  }, [currentStation, activeDrinkIndex]);

  // Update Media Session playback state
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    // Update playback state
    if (activeDrinkIndex !== null) {
      if (isPlaying && !isMuted) {
        navigator.mediaSession.playbackState = 'playing';
        console.log('📱 Media Session: State = playing');
      } else {
        navigator.mediaSession.playbackState = 'paused';
        console.log('📱 Media Session: State = paused');
      }
    } else {
      navigator.mediaSession.playbackState = 'none';
      console.log('📱 Media Session: State = none');
    }
  }, [isPlaying, isMuted, activeDrinkIndex]);

  // Register action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    // Play/Pause handlers
    navigator.mediaSession.setActionHandler('play', () => {
      console.log('📱 Media Session: Play button pressed');
      onPlay();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      console.log('📱 Media Session: Pause button pressed');
      onPause();
    });

    // Station skip handlers (NOT seek handlers!)
    navigator.mediaSession.setActionHandler('previoustrack', () => {
      console.log('📱 Media Session: Previous track (station) button pressed');
      onPreviousTrack();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      console.log('📱 Media Session: Next track (station) button pressed');
      onNextTrack();
    });

    // Explicitly disable seek handlers to remove skip seconds buttons
    try {
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('seekto', null);
      console.log('📱 Media Session: Disabled seek handlers');
    } catch (error) {
      console.log('📱 Media Session: Could not disable seek handlers (may not be supported)');
    }

    console.log('📱 Media Session: Registered all action handlers');

    // Cleanup on unmount
    return () => {
      if ('mediaSession' in navigator) {
        try {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('previoustrack', null);
          navigator.mediaSession.setActionHandler('nexttrack', null);
          navigator.mediaSession.setActionHandler('seekbackward', null);
          navigator.mediaSession.setActionHandler('seekforward', null);
          navigator.mediaSession.setActionHandler('seekto', null);
          console.log('📱 Media Session: Cleaned up action handlers');
        } catch (error) {
          console.warn('📱 Media Session: Error cleaning up handlers:', error);
        }
      }
    };
  }, [onPlay, onPause, onNextTrack, onPreviousTrack]);
};
