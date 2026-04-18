import svgPaths from "./svg-uihq47rr7y";

function JuiceboxPassive() {
  return (
    <div className="absolute h-[98.057px] left-1/2 top-[calc(50%-0.172px)] translate-x-[-50%] translate-y-[-50%] w-[66px]" data-name="juicebox_passive">
      <div className="absolute bottom-[-0.61%] left-[-0.57%] right-0 top-0">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 67 99">
          <g id="juicebox_passive">
            <path d={svgPaths.p205d9480} fill="var(--fill-0, white)" id="Vector 159" stroke="var(--stroke-0, black)" strokeWidth="0.754286" />
            <path d={svgPaths.p24845a40} id="Vector 161" stroke="var(--stroke-0, black)" strokeWidth="0.754286" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="absolute h-[15px] left-[290.75px] top-[32px] w-[79.75px]">
      <p className="absolute font-['Pathway_Extreme:Regular',sans-serif] font-normal leading-[normal] left-[79.75px] text-[#9c9c9c] text-[11px] text-nowrap text-right top-0 translate-x-[-100%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>
        {" "}
        <span className="text-[#585858]">Lusophonica</span>
      </p>
    </div>
  );
}

export default function JuiceboxMain() {
  return (
    <div className="bg-[#f1f1f1] relative size-full" data-name="Juicebox main">
      <p className="absolute font-['Pathway_Extreme:Regular',sans-serif] font-normal leading-[normal] left-[289px] text-[#9c9c9c] text-[11px] text-nowrap text-right top-[32px] translate-x-[-100%] whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>{`Gri Balkon → `}</p>
      <div className="absolute h-[250px] left-[126px] overflow-clip top-[312px] w-[150px]" data-name="Drinks" />
      <div className="absolute h-[150px] left-[-54px] overflow-clip top-[362px] w-[90px]" data-name="Drinks">
        <JuiceboxPassive />
      </div>
      <Frame33 />
    </div>
  );
}