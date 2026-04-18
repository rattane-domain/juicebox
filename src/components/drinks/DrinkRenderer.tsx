import React from 'react';
import { motion } from 'motion/react';

interface DrinkRendererProps {
  isActive: boolean;
  isLoading?: boolean;
  activeSvg: React.ReactNode;
  passiveSvg: React.ReactNode;
  loadingSvg?: React.ReactNode;
}

export function DrinkRenderer({ 
  isActive, 
  isLoading = false,
  activeSvg, 
  passiveSvg, 
  loadingSvg
}: DrinkRendererProps) {
  // Priority: loading > active > passive
  const svgToRender = isLoading && loadingSvg ? loadingSvg : (isActive ? activeSvg : passiveSvg);
  const renderState = isLoading ? 'loading' : (isActive ? 'active' : 'passive');
  
  return (
    <motion.div 
      data-drink-svg
      data-drink-state={renderState}
      // Pulsing animation for loading state
      animate={isLoading ? { opacity: [0.5, 1, 0.5] } : { opacity: 1 }}
      transition={isLoading ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
      style={{
        width: '100%',
        height: '100%'
      }}
    >
      {/* 
        CRITICAL FIX: Override SVG width/height with "100%" strings!
        - SVG has width="150" height="250" hardcoded
        - We pass width="100%" height="100%" as string attributes (NOT CSS)
        - This forces SVG to scale to container size
        - preserveAspectRatio controls how it scales
      */}
      {React.cloneElement(svgToRender as React.ReactElement, {
        width: '100%',
        height: '100%',
        preserveAspectRatio: 'xMidYMid meet', // Center and fit, maintain aspect ratio
        style: { 
          display: 'block'
        }
      })}
    </motion.div>
  );
}
