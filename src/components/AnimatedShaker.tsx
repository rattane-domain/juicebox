import React from 'react';
import svgPaths from '../imports/svg-rxs06bj1gj';

interface AnimatedShakerProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

/**
 * Enhanced animated cocktail shaker component for React.
 * Uses the new Shaker2 design with dynamic shaking animation to indicate loading states.
 */
const AnimatedShaker: React.FC<AnimatedShakerProps> = ({ size = 32, ...props }) => {
  // Enhanced CSS animation with more pronounced shake pattern
  const animationStyles = `
    .shaker-container {
      overflow: visible;
    }
    
    .shaker-group {
      animation: shake 0.6s infinite;
      transform-origin: center;
    }

    @keyframes shake {
      0% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
      10% { transform: translate(-3px, -5px) rotate(-2deg) scale(1.02); }
      20% { transform: translate(-5px, 2px) rotate(2deg) scale(0.98); }
      30% { transform: translate(5px, 5px) rotate(-1deg) scale(1.01); }
      40% { transform: translate(3px, -3px) rotate(2deg) scale(0.99); }
      50% { transform: translate(-2px, 5px) rotate(-2deg) scale(1.02); }
      60% { transform: translate(-5px, 3px) rotate(1deg) scale(0.98); }
      70% { transform: translate(5px, -4px) rotate(-2deg) scale(1.01); }
      80% { transform: translate(-3px, -5px) rotate(2deg) scale(0.99); }
      90% { transform: translate(2px, 5px) rotate(-1deg) scale(1.01); }
      100% { transform: translate(0px, 0px) rotate(0deg) scale(1); }
    }
  `;

  return (
    <div className="shaker-container" style={{ width: size, height: size }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="-8 -8 124 281"
        fill="none"
        className="opacity-90"
        style={{ overflow: 'visible' }}
        {...props} // Pass through any other props like style, className, etc.
      >
        <style>{animationStyles}</style>
        
        {/* The enhanced animated shaker group - Now using new Shaker2 design */}
        <g className="shaker-group">
          <path
            d={svgPaths.p285a8c00}
            fill="#B4B4B4"
            stroke="black"
            strokeWidth="3"
          />
          <path
            d={svgPaths.p249dd700}
            fill="#F3F3F3"
          />
          <path
            d={svgPaths.p34e31700}
            fill="#0B0B0B"
          />
          <path
            d={svgPaths.p20c33280}
            fill="#F3F3F3"
          />
          <path
            d={svgPaths.p364b1500}
            fill="#0B0B0B"
          />
          <path
            d={svgPaths.p292defc0}
            stroke="black"
            strokeWidth="3"
            fill="none"
          />
          <path
            d={svgPaths.p3c1e7b00}
            fill="white"
          />
          <path
            d={svgPaths.p1ed3d180}
            stroke="black"
            strokeWidth="3"
            fill="none"
          />
          <path
            d={svgPaths.p1e0f5780}
            fill="#B4B4B4"
            stroke="black"
            strokeWidth="3"
          />
          <path
            d={svgPaths.p5151cc0}
            stroke="black"
            strokeWidth="3"
            fill="none"
          />
          <path
            d={svgPaths.p14f5c200}
            stroke="black"
            strokeWidth="3"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
};

export default AnimatedShaker;