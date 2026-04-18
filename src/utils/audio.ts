import { RadioStation } from '../types/radio';

// More lenient URL validation for radio streams
export const isValidAudioUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    const parsedUrl = new URL(url);
    
    // Must be HTTP or HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    
    // Must have a valid hostname
    if (!parsedUrl.hostname || parsedUrl.hostname.length < 3) {
      return false;
    }
    
    // Reject localhost and private IPs for security
    if (parsedUrl.hostname === 'localhost' || 
        parsedUrl.hostname.startsWith('127.') ||
        parsedUrl.hostname.startsWith('192.168.') ||
        parsedUrl.hostname.startsWith('10.') ||
        parsedUrl.hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
};

// Get best audio URL from station
export const getBestAudioUrl = (station: RadioStation): string | null => {
  const urls = [
    station.url_resolved,
    station.url
  ].filter(url => url && isValidAudioUrl(url));
  
  return urls[0] || null;
};

// Initialize audio context for PWA with enhanced debugging
export const initializeAudioContext = async (): Promise<boolean> => {
  const isPWA = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
  
  try {
    console.log(`🔊 Audio Context Init ${isPWA ? '(PWA)' : '(Browser)'}:`);
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) {
      console.warn('🔊 No AudioContext available');
      return false;
    }
    
    const audioContext = new AudioContext();
    console.log(`🔊 Created AudioContext, state: ${audioContext.state}`);
    
    if (audioContext.state === 'suspended') {
      console.log('🔊 Resuming suspended AudioContext...');
      await audioContext.resume();
      console.log(`🔊 AudioContext resumed, new state: ${audioContext.state}`);
    }
    
    // Test audio capability with a minimal sound
    if (isPWA) {
      try {
        console.log('🔊 Testing PWA audio capability...');
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime); // Silent test
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.001); // Very brief
        
        console.log('🔊 PWA audio test successful');
      } catch (testError) {
        console.warn('🔊 PWA audio test failed:', testError);
      }
    }
    
    audioContext.close();
    console.log('🔊 AudioContext initialization successful');
    return true;
    
  } catch (error) {
    console.error(`🔊 Audio context initialization failed ${isPWA ? '(PWA)' : '(Browser)'}:`, error);
    return false;
  }
};