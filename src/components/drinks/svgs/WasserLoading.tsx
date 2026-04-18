import React from 'react';
export default function ConvertedSVG() {
  return (
    <svg width="150" height="250" viewBox="0 0 150 250" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" preserveAspectRatio="xMidYMid meet">
      <defs>
        <clipPath id="waterSurfaceMask">
          {/* Diese Ellipse maskiert die Animation, damit sie nicht über den Rand läuft. */}
          <ellipse cx="75.5" cy="76.5" rx="34" ry="14" />
        </clipPath>
      </defs>
      {/* GRUPPE 1: Statische Zeichnung des Glases und des Wassers */}
      <g id="glass-and-water">
        <path d="M75.5508 61C95.1569 61 111.051 67.9396 111.051 76.5C111.051 76.8361 111.024 77.1693 110.976 77.5H111.599L111.549 78.0459L102.549 176.546L102.545 176.592L102.531 176.638L101.531 180.138L101.496 180.262L98.8691 182.889L94.293 185.939L94.2539 185.957L89.7539 187.957L89.6992 187.981L89.6406 187.992L84.1406 188.992L84.1133 188.996L80.082 189.5H72.5195L68.4883 188.996L68.4785 188.995L68.4688 188.993L62.4688 187.993L62.415 187.984L62.3652 187.964L57.3652 185.964L57.3164 185.945L57.2734 185.916L52.7324 182.889L50.0791 180.235L50.0557 180.07L49.5557 176.57L49.5537 176.56L49.5527 176.548L40.0527 78.0479L40 77.5H40.126C40.0777 77.1693 40.0508 76.8361 40.0508 76.5C40.0508 67.9396 55.9447 61 75.5508 61Z" fill="white" />
        <path d="M50 177.5L53.2756 174L56.9606 171.5L60.6457 169.5L65.1496 168.5L70.4724 167.5L74.9764 167L80.7087 167.5L86.8504 168.5L91.3543 169.5L95.8583 171.5L99.1339 174L100.772 176.5L102 178" stroke="black" />
        <path d="M40.5 78L50 176.5L50.5 180L53 182.5L57.5 185.5L62.5 187.5L68.5 188.5L72.5 189H80L84 188.5L89.5 187.5L94 185.5L98.5 182.5L101 180L102 176.5L111 78" stroke="black" />
        <path d="M53 178.5L44 83.5L48 78.5L52 76L57 74L63.5 73L71.5 72H78.5L86.5 73L94 74L99 76L103.5 78.5L106.5 82.5L99 175L96.5 180L90 183.5L84.5 185L78 185.5H70L59.5 183.5L53 178.5Z" fill="#BED6ED" fillOpacity="0.6" stroke="black" />
        <path d="M75.5 61.5C85.2509 61.5 94.0549 63.2266 100.402 65.998C103.577 67.3841 106.115 69.0215 107.852 70.8145C109.586 72.605 110.5 74.5257 110.5 76.5C110.5 78.4743 109.586 80.395 107.852 82.1855C106.115 83.9785 103.577 85.6159 100.402 87.002C94.0549 89.7734 85.2509 91.5 75.5 91.5C65.7491 91.5 56.9451 89.7734 50.5977 87.002C47.4232 85.6159 44.8853 83.9785 43.1484 82.1855C41.414 80.395 40.5 78.4743 40.5 76.5C40.5 74.5257 41.414 72.605 43.1484 70.8145C44.8853 69.0215 47.4232 67.3841 50.5977 65.998C56.9451 63.2266 65.7491 61.5 75.5 61.5Z" stroke="black" />
      </g>
      {/* GRUPPE 2: Animierte Wasser-Ringe */}
      <g id="ripples-animation" clipPath="url(#waterSurfaceMask)">
        {/* 
          HIER DIE KORREKTUR: 
          Der cy-Wert (vertikales Zentrum) wurde nur leicht nach unten verschoben (auf 79),
          damit die Animation innerhalb der sichtbaren Maske bleibt.
        */}
        {/* Ring 1 */}
        <ellipse cx="75.5" cy="79" rx="0" ry="0" fill="none" stroke="white" strokeWidth="1">
        </ellipse>
        {/* Ring 2 (startet mit 0.5s Verzögerung) */}
        <ellipse cx="75.5" cy="79" rx="0" ry="0" fill="none" stroke="white" strokeWidth="1">
        </ellipse>
        {/* Unsichtbarer "Taktgeber" für die Animation */}
      </g>
    </svg>
  );
}