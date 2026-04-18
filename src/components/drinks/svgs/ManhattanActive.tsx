import React from 'react';

export default function ConvertedSVG() {
  return (
    <svg width="150" height="249" viewBox="0 0 150 249" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" preserveAspectRatio="xMidYMid meet">
      {/* 1. Dies ist der neue, korrekte Rahmen für das Glas */}
      <path d="M117.764 56.6328H31.1472L70.7272 113.995V172.505V174.799L69.58 178.241L67.8591 180.535L63.8437 182.256L59.2547 183.403L48.9295 187.419V190.287H100.556V187.419L87.9359 183.403L83.3469 182.256L80.4788 180.535L78.7579 178.241L77.6107 174.799V172.505V112.848L117.764 56.6328Z" fill="#CFDAEB" fillOpacity="0.44" stroke="black" strokeWidth="1.14725" />
    
      {/* 
        2. Die animierten Elemente werden gruppiert und transformiert,
           um sie an den neuen Rahmen anzupassen (scale + translate).
      */}
      <g transform="translate(29.5, 56) scale(1.14725)">
    
        {/* Die Flüssigkeit */}
        <path d="M37.5 49.5L13.5 14.5H64L39 49.5H37.5Z" fill="url(#paint0_linear_318_2024)" stroke="black" />
    
        {/* Die Kirsche (Kreis und Stiel) wird gruppiert, um sie gemeinsam zu animieren */}
        <g id="cherry">
          <circle cx="38.2758" cy="37.4084" r="6.53745" transform="rotate(-88.0254 38.2758 37.4084)" fill="#FF0404" stroke="black" />
          <path d="M41 35.0208C41.0302 34.799 41.1579 34.1071 41.5599 32.7693C41.7931 31.9934 42.3135 31.084 42.9265 30.0935C43.5396 29.1031 44.2879 28.0754 44.9045 27.3374C45.5212 26.5994 45.9837 26.1822 46.5954 25.7075C47.207 25.2327 47.954 24.713 48.6843 24.2664C49.4146 23.8197 50.1057 23.4619 50.9184 23.1068" stroke="black" strokeLinecap="round" />
    
          {/* Animation 1: Kontinuierliches und sanftes Hin- und Herschaukeln (Pendel) */}
          <animateTransform
              attributeName="transform"
              type="rotate"
              values="-3 50 23; 3 50 23; -3 50 23"
              keyTimes="0; 0.5; 1"
              keySplines="0.42 0 0.58 1; 0.42 0 0.58 1"
              dur="7s"
              repeatCount="indefinite"
              additive="sum" />
    
          {/* Animation 2: Deutliches Auf- und Absteigen (Schweben) */}
          <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0; 0 0; 0 -4; 0 0"
              keyTimes="0; 0.7; 0.85; 1"
              dur="9s"
              repeatCount="indefinite"
              additive="sum" />
    
          {/* Animation 3: Langsames Neigen um die eigene Achse */}
          <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 38.2758 37.4084; -20 38.2758 37.4084; -45 38.2758 37.4084; -15 38.2758 37.4084; 0 38.2758 37.4084"
              keyTimes="0; 0.3; 0.5; 0.8; 1"
              dur="11s"
              repeatCount="indefinite"
              additive="sum" />
        </g>
      </g>
    
      <defs>
        <linearGradient id="paint0_linear_318_2024" x1="38.75" y1="14.5" x2="38.75" y2="49.5" gradientUnits="userSpaceOnUse">
          <stop offset="0.0913462" stopColor="#FF8DD5" />
          <stop offset="0.610577" stopColor="#720020" />
        </linearGradient>
      </defs>
    </svg>
  );
}