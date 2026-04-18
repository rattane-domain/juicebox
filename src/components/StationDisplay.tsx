import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * STATION DISPLAY - Right-Aligned Radio Station UI
 * 
 * Startup: Shows first station immediately, no upcoming
 * Browsing: Shows [Upcoming →] Active when different
 * Replace Animation: New station appears at 100%, old deletes letter-by-letter with arrow
 */

interface StationDisplayProps {
  activeStation: string | null;
  upcomingStation: string | null;
  isPlaying: boolean;
  isLoading: boolean;
  upcomingIsLoading: boolean;
}

export default function StationDisplay({
  activeStation,
  upcomingStation,
  isPlaying,
  isLoading,
  upcomingIsLoading
}: StationDisplayProps) {
  
  // Track startup - only show active station initially, no upcoming
  const [hasUserBrowsed, setHasUserBrowsed] = useState(false);
  const isInitialMount = useRef(true);
  
  // Typing animation for upcoming station (normal browsing)
  const [displayedUpcoming, setDisplayedUpcoming] = useState('');
  const [isUpcomingDeleting, setIsUpcomingDeleting] = useState(false);
  const previousUpcomingRef = useRef(upcomingStation);
  const upcomingTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Replace animation - show old station being deleted while new is visible
  const [oldStationText, setOldStationText] = useState('');
  const [showOldStation, setShowOldStation] = useState(false);
  const previousActiveRef = useRef(activeStation);
  const deleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // ========================================
  // STARTUP DETECTION
  // On mount, wait for first active station, then mark as initialized
  // Only show upcoming after user actually browses (upcoming changes)
  // ========================================
  
  useEffect(() => {
    // After initial mount, track if user browses
    if (isInitialMount.current && activeStation) {
      isInitialMount.current = false;
      return;
    }
    
    // User has browsed if upcoming is different from active AND not initial mount
    if (!isInitialMount.current && upcomingStation && upcomingStation !== activeStation) {
      setHasUserBrowsed(true);
    }
  }, [upcomingStation, activeStation]);
  
  // ========================================
  // TYPING ANIMATION FOR UPCOMING STATION
  // ========================================
  
  useEffect(() => {
    const currentUpcoming = upcomingStation || '';
    const previousUpcoming = previousUpcomingRef.current || '';
    
    if (currentUpcoming !== previousUpcoming) {
      console.log('📝 Upcoming changed:', { from: previousUpcoming, to: currentUpcoming });
      
      if (upcomingTypingTimeoutRef.current) {
        clearTimeout(upcomingTypingTimeoutRef.current);
      }
      
      if (displayedUpcoming.length > 0) {
        setIsUpcomingDeleting(true);
        deleteUpcomingText(displayedUpcoming, currentUpcoming);
      } else {
        setIsUpcomingDeleting(false);
        typeUpcomingText('', currentUpcoming);
      }
      
      previousUpcomingRef.current = currentUpcoming;
    }
  }, [upcomingStation]);
  
  const deleteUpcomingText = (current: string, target: string) => {
    if (current.length === 0) {
      setIsUpcomingDeleting(false);
      typeUpcomingText('', target);
      return;
    }
    
    const delay = 30 + Math.random() * 50;
    upcomingTypingTimeoutRef.current = setTimeout(() => {
      const newText = current.slice(0, -1);
      setDisplayedUpcoming(newText);
      deleteUpcomingText(newText, target);
    }, delay);
  };
  
  const typeUpcomingText = (current: string, target: string) => {
    if (current.length === target.length) return;
    
    const delay = 40 + Math.random() * 60;
    upcomingTypingTimeoutRef.current = setTimeout(() => {
      const newText = target.slice(0, current.length + 1);
      setDisplayedUpcoming(newText);
      typeUpcomingText(newText, target);
    }, delay);
  };
  
  useEffect(() => {
    if (upcomingStation && displayedUpcoming === '' && !previousUpcomingRef.current) {
      setDisplayedUpcoming(upcomingStation);
      previousUpcomingRef.current = upcomingStation;
    }
  }, [upcomingStation]);
  
  // ========================================
  // REPLACE ANIMATION
  // Layout: [New Station + Arrow] [Old Station being deleted]
  // Opacity: New goes 100%, old stays 50% during deletion
  // ========================================
  
  useEffect(() => {
    const currentActive = activeStation || '';
    const previousActive = previousActiveRef.current || '';
    
    if (currentActive !== previousActive && previousActive !== null && previousActive !== '') {
      console.log('🔄 Replace:', { from: previousActive, to: currentActive });
      
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
      
      // Show old station for deletion
      setOldStationText(previousActive);
      setShowOldStation(true);
      
      // Small delay before starting deletion
      deleteTimeoutRef.current = setTimeout(() => {
        deleteOldStationLetters(previousActive);
      }, 200);
    }
    
    previousActiveRef.current = currentActive;
  }, [activeStation]);
  
  const deleteOldStationLetters = (current: string) => {
    if (current.length === 0) {
      // All letters deleted, arrow stays briefly then disappears
      deleteTimeoutRef.current = setTimeout(() => {
        setShowOldStation(false);
        setOldStationText('');
      }, 150);
      return;
    }
    
    const delay = 30 + Math.random() * 50;
    deleteTimeoutRef.current = setTimeout(() => {
      const newText = current.slice(0, -1);
      setOldStationText(newText);
      deleteOldStationLetters(newText);
    }, delay);
  };
  
  // ========================================
  // RENDER HELPERS
  // ========================================
  
  // Show upcoming only if user has browsed and it's different from active
  const showUpcoming = hasUserBrowsed && upcomingStation && upcomingStation !== activeStation;
  
  const activeOpacity = isPlaying ? 1 : 0.5;
  
  // Cleanup
  useEffect(() => {
    return () => {
      if (upcomingTypingTimeoutRef.current) clearTimeout(upcomingTypingTimeoutRef.current);
      if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
    };
  }, []);
  
  // ========================================
  // RENDER
  // During replace: [New + Arrow] positioned left, [Old] positioned right, both absolute
  // ========================================
  
  return (
    <div className="fixed right-6 top-[32px] flex items-center justify-end pointer-events-none">
      
      {/* NORMAL BROWSING: Upcoming → Active */}
      {!showOldStation && (
        <div className="relative flex items-center gap-1">
          {/* UPCOMING STATION */}
          <AnimatePresence mode="wait">
            {showUpcoming && (
              <motion.div
                key="upcoming"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-1"
              >
                <motion.p
                  className="font-['Pathway_Extreme',sans-serif] text-[14px] text-nowrap text-[#9c9c9c] dark:text-[#CBCBCB]"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                  animate={upcomingIsLoading ? {
                    opacity: [0.5, 0.8, 0.5]
                  } : {
                    opacity: 0.5
                  }}
                  transition={upcomingIsLoading ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : undefined}
                >
                  {displayedUpcoming}
                  {(isUpcomingDeleting || (displayedUpcoming.length < (upcomingStation?.length || 0))) && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      |
                    </motion.span>
                  )}
                </motion.p>
                
                <motion.span
                  className="text-[14px] text-[#9c9c9c] dark:text-[#CBCBCB]"
                  animate={{ opacity: upcomingIsLoading ? [0.5, 0.8, 0.5] : 0.5 }}
                  transition={upcomingIsLoading ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : undefined}
                >
                  →
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* ACTIVE STATION */}
          {activeStation && (
            <motion.p
              className="font-['Pathway_Extreme',sans-serif] text-[14px] text-nowrap text-[#585858] dark:text-[#EBEBEB]"
              style={{ fontVariationSettings: "'wdth' 100" }}
              animate={isLoading ? {
                opacity: [activeOpacity * 0.6, activeOpacity, activeOpacity * 0.6]
              } : {
                opacity: activeOpacity
              }}
              transition={isLoading ? {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              } : {
                duration: 0.3
              }}
            >
              {activeStation}
            </motion.p>
          )}
        </div>
      )}
      
      {/* REPLACE ANIMATION: New + Arrow (left), Old being deleted (right) */}
      {showOldStation && activeStation && (
        <div className="relative">
          {/* New station + arrow on the left */}
          <div className="flex items-center gap-1">
            <motion.p
              className="font-['Pathway_Extreme',sans-serif] text-[14px] text-nowrap text-[#585858] dark:text-[#EBEBEB]"
              style={{ fontVariationSettings: "'wdth' 100" }}
              animate={{ opacity: activeOpacity }}
              transition={{ duration: 0.3 }}
            >
              {activeStation}
            </motion.p>
            
            <span className="text-[14px] text-[#9c9c9c] dark:text-[#CBCBCB]" style={{ opacity: 0.5 }}>
              →
            </span>
            
            {/* Old station being deleted */}
            <p
              className="font-['Pathway_Extreme',sans-serif] text-[14px] text-nowrap text-[#9c9c9c] dark:text-[#CBCBCB]"
              style={{ fontVariationSettings: "'wdth' 100", opacity: 0.5 }}
            >
              {oldStationText}
              {oldStationText.length > 0 && (
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  |
                </motion.span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
