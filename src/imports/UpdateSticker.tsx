import svgPaths from "./svg-pbekbeluo";

export default function UpdateSticker() {
  return (
    <svg width="337" height="140" viewBox="0 0 337 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-lg">
      {/* Ellipse background */}
      <path 
        d={svgPaths.p27d42c00} 
        fill="white" 
        stroke="#3D37AB" 
        strokeWidth="6" 
      />
      {/* Text */}
      <text
        x="50%"
        y="45%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#3D37AB"
        fontSize="30"
        fontFamily="'Konkhmer Sleokchher', sans-serif"
        fontWeight="400"
      >
        Update!
      </text>
      <text
        x="50%"
        y="70%"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#3D37AB"
        fontSize="30"
        fontFamily="'Konkhmer Sleokchher', sans-serif"
        fontWeight="400"
      >
        Now 2x smoother
      </text>
    </svg>
  );
}
