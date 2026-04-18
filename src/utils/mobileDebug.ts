// Mobile autoplay debugging utilities

export const logMobileAutoplayState = (context: string) => {
  const isMobile = navigator.userAgent.includes('Mobile') || 'ontouchstart' in window;
  const autoplayIntent = sessionStorage.getItem('mobile-autoplay-intent');
  const lastInteraction = sessionStorage.getItem('last-user-interaction');
  const timeSinceInteraction = lastInteraction ? Date.now() - parseInt(lastInteraction, 10) : null;
  
  console.log(`📱 Mobile Autoplay Debug [${context}]:`, {
    isMobile,
    autoplayIntent,
    lastInteraction: lastInteraction ? new Date(parseInt(lastInteraction, 10)).toISOString() : null,
    timeSinceInteraction: timeSinceInteraction ? `${timeSinceInteraction}ms` : null,
    timeUntilTimeout: timeSinceInteraction ? `${5000 - timeSinceInteraction}ms` : null,
    userAgent: navigator.userAgent,
    touchSupport: 'ontouchstart' in window,
    audioContext: (window as any).AudioContext ? 'available' : 'not available',
    webAudio: (window as any).webkitAudioContext ? 'webkit available' : 'webkit not available'
  });
};

export const checkMobileAutoplayCompatibility = () => {
  const isPWA = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  const results = {
    isMobile: navigator.userAgent.includes('Mobile') || 'ontouchstart' in window,
    hasAudioContext: !!(window as any).AudioContext || !!(window as any).webkitAudioContext,
    hasTouch: 'ontouchstart' in window,
    userAgent: navigator.userAgent,
    vendor: navigator.vendor,
    platform: navigator.platform,
    maxTouchPoints: navigator.maxTouchPoints || 0,
    standalone: (window.navigator as any).standalone,
    displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser',
    isPWA,
    isIOSSafari,
    isIOSPWA: isPWA && isIOSSafari,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio
    },
    permissions: {
      // Check if we can access audio
      audioPermission: 'unknown'
    }
  };
  
  console.log('📱 Mobile Autoplay Compatibility Check:', results);
  
  // PWA-specific audio debugging
  if (isPWA) {
    console.log('🔊 PWA Audio Context State:');
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const tempContext = new AudioContext();
        console.log('🔊 Audio Context State:', tempContext.state);
        tempContext.close();
      }
    } catch (error) {
      console.error('🔊 Audio Context Error:', error);
    }
  }
  
  return results;
};

// Call on app initialization
export const initMobileDebugging = () => {
  if (process.env.NODE_ENV === 'development') {
    checkMobileAutoplayCompatibility();
    logMobileAutoplayState('App Init');
  }
};