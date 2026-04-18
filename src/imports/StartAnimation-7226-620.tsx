import svgPaths from "./svg-vhcnf7fhhv";

function JuiceboxBack() {
  return (
    <div className="absolute h-[130px] left-[calc(50%+9.75px)] top-1/2 translate-x-[-50%] translate-y-[-50%] w-[87.5px]" data-name="juicebox back">
      <div className="absolute bottom-[-0.61%] left-[-1.71%] right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 89 131">
          <g id="juicebox back">
            <path d={svgPaths.p3c26f770} fill="var(--fill-0, white)" id="Vector 163" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p3ad75c00} fill="var(--fill-0, white)" id="Vector 159" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p3f17f300} fill="var(--fill-0, white)" id="Vector 160" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.pc21d7f0} id="Vector 161" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p2a3a5200} id="Vector 162" stroke="var(--stroke-0, black)" />
            <g id="Group 87">
              <path d={svgPaths.p257c8a00} fill="var(--fill-0, white)" id="Vector 183" stroke="var(--stroke-0, black)" />
              <path d={svgPaths.p3a63f200} id="Vector 184" stroke="var(--stroke-0, black)" />
            </g>
            <g id="Group 88">
              <g id="Vector 185">
                <path d={svgPaths.p327dde00} fill="var(--fill-0, white)" />
                <path d={svgPaths.p29ba4980} stroke="var(--stroke-0, black)" />
              </g>
              <path d={svgPaths.pb007700} id="Vector 186" stroke="var(--stroke-0, black)" />
            </g>
            <ellipse cx="50.9961" cy="34.5" fill="var(--fill-0, black)" id="Ellipse 318" rx="3.5" ry="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Straw() {
  return (
    <div className="absolute h-[74.499px] left-[71px] top-0 w-[64.464px]" data-name="straw">
      <div className="absolute bottom-[-1.8%] left-0 right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 65 76">
          <g id="straw">
            <path d={svgPaths.p31226300} fill="var(--fill-0, white)" id="Vector 164" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p24224100} id="Vector 165" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p14cbff80} id="Vector 170" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p18ed07e0} id="Vector 166" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p207969a0} id="Vector 167" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p3e8ae100} id="Vector 168" stroke="var(--stroke-0, black)" />
            <path d={svgPaths.p130a6f80} id="Vector 169" stroke="var(--stroke-0, black)" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function JuiceboxFront() {
  return (
    <div className="absolute h-[96px] left-[calc(50%+9.5px)] top-[calc(50%+17px)] translate-x-[-50%] translate-y-[-50%] w-[87px]" data-name="juicebox front">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 87 96">
        <g clipPath="url(#clip0_7225_370)" id="juicebox front">
          <path d={svgPaths.p3aeebf00} fill="var(--fill-0, white)" id="Vector 163" />
          <path d={svgPaths.p154ca980} fill="var(--fill-0, black)" id="Vector 163 (Stroke)" />
          <path d={svgPaths.p965c880} fill="var(--fill-0, white)" id="Vector 159" />
          <path d={svgPaths.p1da226f0} fill="var(--fill-0, black)" id="Vector 159 (Stroke)" />
          <path d={svgPaths.p33fa0100} fill="var(--fill-0, white)" id="Vector 160" />
          <path d={svgPaths.p3c697480} fill="var(--fill-0, black)" id="Vector 160 (Stroke)" />
          <path d={svgPaths.p6343b00} fill="var(--fill-0, black)" id="Vector 161 (Stroke)" />
          <path d={svgPaths.p33a22000} fill="var(--fill-0, black)" id="Vector 162 (Stroke)" />
          <g id="Group 87">
            <path d={svgPaths.p5747500} fill="var(--fill-0, white)" id="Vector 183" />
            <path d={svgPaths.p3c429880} fill="var(--fill-0, black)" id="Vector 183 (Stroke)" />
            <path d={svgPaths.p1ce49900} fill="var(--fill-0, black)" id="Vector 184 (Stroke)" />
          </g>
          <g id="Group 88">
            <path d={svgPaths.p1c5bc000} fill="var(--fill-0, white)" id="Vector 185" />
            <path d={svgPaths.p2d9b0300} fill="var(--fill-0, black)" id="Vector 185 (Stroke)" />
            <path d={svgPaths.p6d01480} fill="var(--fill-0, black)" id="Vector 186 (Stroke)" />
          </g>
          <path d={svgPaths.p282fe880} fill="var(--fill-0, black)" id="Ellipse 318" />
        </g>
        <defs>
          <clipPath id="clip0_7225_370">
            <rect fill="white" height="96" width="87" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export default function StartAnimation() {
  return (
    <div className="relative size-full" data-name="start animation">
      <JuiceboxBack />
      <Straw />
      <JuiceboxFront />
    </div>
  );
}