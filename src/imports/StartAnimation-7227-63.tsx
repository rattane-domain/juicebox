import svgPaths from "./svg-6qyyvjjcfq";

function JuiceboxBack() {
  return (
    <div className="absolute h-[130px] left-[calc(50%+9.75px)] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[87.5px]" data-name="juicebox back">
      <div className="absolute bottom-[-0.61%] left-[-1.71%] right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 89 131">
          <g id="juicebox back">
            <path d={svgPaths.p24470d80} fill="var(--fill-0, white)" id="Vector 163" />
            <path d={svgPaths.p3a8b500} fill="var(--fill-0, black)" id="Union" />
            <path d={svgPaths.p19e3b100} fill="var(--fill-0, black)" id="Union_2" />
            <path d={svgPaths.p29adad80} fill="var(--fill-0, black)" id="Union_3" />
            <path d={svgPaths.p1ef44800} fill="var(--fill-0, black)" id="Ellipse 318" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Straw({ swipeOffset = 0 }: { swipeOffset?: number }) {
  return (
    <div 
      className="absolute h-[75.841px] left-[76px] top-0 w-[64.464px]" 
      data-name="straw"
      style={{
        transform: `translateY(${swipeOffset}px)`,
        transition: swipeOffset === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 65 76">
        <g id="straw">
          <path d={svgPaths.p2fa5bf80} fill="var(--fill-0, white)" id="Vector 164" />
          <path d={svgPaths.p36730af0} fill="var(--fill-0, black)" id="Union" />
        </g>
      </svg>
    </div>
  );
}

function JuiceboxFront() {
  return (
    <div className="absolute h-[96px] left-[calc(50%+9.5px)] top-[calc(50%+17px)] translate-x-[-50%] translate-y-[-50%] w-[87px]" data-name="juicebox front">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 87 96">
        <g clipPath="url(#clip0_7227_95)" id="juicebox front">
          <path d={svgPaths.p3aeebf00} fill="var(--fill-0, white)" id="Vector 163" />
          <path d={svgPaths.p965c880} fill="var(--fill-0, white)" id="Vector 159" />
          <path d={svgPaths.p33fa0100} fill="var(--fill-0, white)" id="Vector 160" />
          <path d={svgPaths.p3bad100} fill="var(--fill-0, black)" id="Union" />
          <g id="Group 87">
            <path d={svgPaths.p5747500} fill="var(--fill-0, white)" id="Vector 183" />
            <path d={svgPaths.p39e40b00} fill="var(--fill-0, black)" id="Union_2" />
          </g>
          <g id="Group 88">
            <path d={svgPaths.p1c5bc000} fill="var(--fill-0, white)" id="Vector 185" />
            <path d={svgPaths.p25f269f0} fill="var(--fill-0, black)" id="Union_3" />
          </g>
          <path d={svgPaths.p282fe880} fill="var(--fill-0, black)" id="Ellipse 318" />
        </g>
        <defs>
          <clipPath id="clip0_7227_95">
            <rect fill="white" height="96" width="87" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function StartAnimation({ swipeOffset = 0 }: { swipeOffset?: number }) {
  return (
    <div className="relative size-full" data-name="start animation">
      <JuiceboxBack />
      <Straw swipeOffset={swipeOffset} />
      <JuiceboxFront />
    </div>
  );
}