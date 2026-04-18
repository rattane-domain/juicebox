import React from 'react';
export default function ConvertedSVG() {
  return (
    <svg width="150" height="250" viewBox="0 0 150 250" fill="none" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" preserveAspectRatio="xMidYMid meet">
    <defs>
        <linearGradient id="paint0_linear_481_262" x1="75.5" y1="156" x2="93.5" y2="172.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFF9D0" />
            <stop offset="1" stopColor="#F9ED00" stopOpacity="0.88" />
        </linearGradient>
        {/* Clip-Pfad, der der Form der Flüssigkeit entspricht, um die Bläschen darin zu begrenzen */}
        <clipPath id="liquidAreaClip">
            <path d="M53 178.5L44 83.5L48 78.5L52 76L57 74L63.5 73L71.5 72H78.5L86.5 73L94 74L99 76L103.5 78.5L106.5 82.5L99 175L96.5 180L90 183.5L84.5 185L78 185.5H70L59.5 183.5L53 178.5Z" />
        </clipPath>
    </defs>
    {/* Statische Elemente (Glas, Flüssigkeit, Zitrone etc.) */}
    <path d="M75.5508 61C95.1569 61 111.051 67.9396 111.051 76.5C111.051 76.8361 111.024 77.1693 110.976 77.5H111.599L111.549 78.0459L102.549 176.546L102.545 176.592L102.531 176.638L101.531 180.138L101.496 180.262L98.8691 182.889L94.293 185.939L94.2539 185.957L89.7539 187.957L89.6992 187.981L89.6406 187.992L84.1406 188.992L84.1133 188.996L80.082 189.5H72.5195L68.4883 188.996L68.4785 188.995L68.4688 188.993L62.4688 187.993L62.415 187.984L62.3652 187.964L57.3652 185.964L57.3164 185.945L57.2734 185.916L52.7324 182.889L50.0791 180.235L50.0557 180.07L49.5557 176.57L49.5537 176.56L49.5527 176.548L40.0527 78.0479L40 77.5H40.126C40.0777 77.1693 40.0508 76.8361 40.0508 76.5C40.0508 67.9396 55.9447 61 75.5508 61Z" fill="white" />
    <path d="M50 177.5L53.2756 174L56.9606 171.5L60.6457 169.5L65.1496 168.5L70.4724 167.5L74.9764 167L80.7087 167.5L86.8504 168.5L91.3543 169.5L95.8583 171.5L99.1339 174L100.772 176.5L102 178" stroke="black" />
    <path d="M53 178.5L44 83.5L48 78.5L52 76L57 74L63.5 73L71.5 72H78.5L86.5 73L94 74L99 76L103.5 78.5L106.5 82.5L99 175L96.5 180L90 183.5L84.5 185L78 185.5H70L59.5 183.5L53 178.5Z" fill="#BED6ED" fillOpacity="0.6" stroke="black" />
    <path d="M91 140.5L58.5 173.5L63 177L68 179.5L74.5 180.5L81.5 179.5L87 177L91 174.5L94.5 170L97 165.5L98.5 161.5V157V152L97 148L94.5 144L91 140.5Z" fill="url(#paint0_linear_481_262)" stroke="black" />
    <path d="M61 172L64.5 174L69.5 176L74 176.5H79.5L84.5 174.5L89 171.5L92 168L93.5 165L95 162V158.5V154.5V150.5L92.5 146.5L89 143" stroke="black" />
    <path d="M75 157L89.5 171" stroke="black" />
    <path d="M75 157L95 162" stroke="black" />
    <path d="M94.5 151L75.5 157" stroke="black" />
    <path d="M75.5 157.5L79.5 176.5" stroke="black" />
    <path d="M75.5 157.5L70 176.5" stroke="black" />
    <path d="M75.5 61.5C85.2509 61.5 94.0549 63.2266 100.402 65.998C103.577 67.3841 106.115 69.0215 107.852 70.8145C109.586 72.605 110.5 74.5257 110.5 76.5C110.5 78.4743 109.586 80.395 107.852 82.1855C106.115 83.9785 103.577 85.6159 100.402 87.002C94.0549 89.7734 85.2509 91.5 75.5 91.5C65.7491 91.5 56.9451 89.7734 50.5977 87.002C47.4232 85.6159 44.8853 83.9785 43.1484 82.1855C41.414 80.395 40.5 78.4743 40.5 76.5C40.5 74.5257 41.414 72.605 43.1484 70.8145C44.8853 69.0215 47.4232 67.3841 50.5977 65.998C56.9451 63.2266 65.7491 61.5 75.5 61.5Z" stroke="black" />
    <path d="M40.5 78L50 176.5L50.5 180L53 182.5L57.5 185.5L62.5 187.5L68.5 188.5L72.5 189H80L84 188.5L89.5 187.5L94 185.5L98.5 182.5L101 180L102 176.5L111 78" stroke="black" />
    {/* Gruppe für animierte Bläschen, die auf der Zitrone entstehen */}
    <g clipPath="url(#liquidAreaClip)">
        <circle cx="85" cy="160" r="2" fill="white" stroke="black" strokeWidth="0.5">
        </circle>
        <circle cx="65" cy="172" r="2.5" fill="white" stroke="black" strokeWidth="0.5">
        </circle>
        <circle cx="92" cy="155" r="2.5" fill="white" stroke="black" strokeWidth="0.5">
        </circle>
        <circle cx="78" cy="178" r="2" fill="white" stroke="black" strokeWidth="0.5">
        </circle>
        <circle cx="70" cy="150" r="1.5" fill="white" stroke="black" strokeWidth="0.5">
        </circle>
        <circle cx="90" cy="168" r="2" fill="white" stroke="black" strokeWidth="0.5">
        </circle>
        <circle cx="75" cy="157" r="2.5" fill="white" stroke="black" strokeWidth="0.5">
        </circle>
    </g>
    </svg>
  );
}