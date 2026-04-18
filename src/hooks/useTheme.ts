import { useState, useEffect } from 'react';

export function useTheme() {
  // Initialize theme from system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Update PWA meta tags for proper status bar theming
  const updatePWATheme = (isDark: boolean) => {
    // Update theme-color meta tag for PWA status bar
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const statusBarMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', isDark ? '#000000' : '#ffffff');
    }
    
    if (statusBarMeta) {
      statusBarMeta.setAttribute('content', isDark ? 'black-translucent' : 'light-content');
    }
    
    // Also update manifest theme_color if needed
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (manifestLink) {
      // Note: Dynamic manifest updates are limited, but we set the meta tag above
      console.log(`🎨 PWA theme updated to ${isDark ? 'dark' : 'light'} mode`);
    }
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Update PWA theming
    updatePWATheme(isDarkMode);
    
    console.log(`🎨 Theme applied: ${isDarkMode ? 'dark' : 'light'} mode (system preference)`);
  }, [isDarkMode]);

  // Listen for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
      console.log(`🎨 System theme changed to: ${e.matches ? 'dark' : 'light'} mode`);
    };
    
    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return {
    isDarkMode
  };
}