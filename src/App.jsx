
     
    import { useState, useEffect, useRef } from "react";

const CONSTELLATIONS = [
  {
    name: "Orion",
    stars: [
      { x: 0.28, y: 0.22, size: 14, label: "α" },
      { x: 0.72, y: 0.20, size: 11, label: "γ" },
      { x: 0.38, y: 0.50, size: 9,  label: "δ" },
      { x: 0.50, y: 0.53, size: 9,  label: "ε" },
      { x: 0.62, y: 0.56, size: 9,  label: "ζ" },
      { x: 0.30, y: 0.84, size: 10, label: "κ" },
      { x: 0.74, y: 0.82, size: 13, label: "β" },
    ],
    lines: [[0,2],[0,1],[1,4],[2,3],[3,4],[2,5],[4,6],[5,6]],
  },
  {
    name: "Scorpius",
    stars: [
      { x: 0.50, y: 0.12, size: 14, label: "α" },
      { x: 0.38, y: 0.24, size: 10, label: "σ" },
      { x: 0.62, y: 0.24, size: 10, label: "τ" },
      { x: 0.50, y: 0.40, size: 11, label: "ε" },
      { x: 0.45, y: 0.56, size: 9,  label: "μ" },
      { x: 0.38, y: 0.72, size: 10, label: "ζ" },
      { x: 0.28, y: 0.86, size: 12, label: "λ" },
    ],
    lines: [[0,1],[0,2],[1,3],[2,3],[3,4],[4,5],[5,6]],
  },
  {
    name: "Cassiopeia",
    stars: [
      { x: 0.10, y: 0.55, size: 11, label: "β" },
      { x: 0.28, y: 0.30, size: 13, label: "α" },
      { x: 0.50, y: 0.45, size: 12, label: "γ" },
      { x: 0.70, y: 0.25, size: 11, label: "δ" },
      { x: 0.88, y: 0.48, size: 10, label: "ε" },
      { x: 0.58, y: 0.70, size: 9,  label: "η" },
      { x: 0.36, y: 0.78, size: 9,  label: "θ" },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,1]],
  },
  {
    name: "Ursa Major",
    stars: [
      { x: 0.14, y: 0.72, size: 11, label: "α" },
      { x: 0.28, y: 0.60, size: 11, label: "β" },
      { x: 0.42, y: 0.52, size: 10, label: "γ" },
      { x: 0.58, y: 0.44, size: 12, label: "δ" },
      { x: 0.68, y: 0.28, size: 10, label: "ε" },
      { x: 0.82, y: 0.20, size: 9,  label: "ζ" },
      { x: 0.90, y: 0.36, size: 13, label: "η" },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]],
  },
  {
    name: "Leo",
    stars: [
      { x: 0.50, y: 0.14, size: 14, label: "α" },
      { x: 0.34, y: 0.26, size: 10, label: "η" },
      { x: 0.22, y: 0.42, size: 9,  label: "γ" },
      { x: 0.30, y: 0.60, size: 11, label: "δ" },
      { x: 0.52, y: 0.68, size: 9,  label: "θ" },
      { x: 0.72, y: 0.56, size: 12, label: "β" },
      { x: 0.80, y: 0.34, size: 10, label: "ζ" },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[5,0]],
  },
  {
    name: "Lyra",
    stars: [
      { x: 0.50, y: 0.10, size: 14, label: "α" },
      { x: 0.32, y: 0.38, size: 9,  label: "β" },
      { x: 0.68, y: 0.38, size: 9,  label: "γ" },
      { x: 0.28, y: 0.62, size: 10, label: "δ" },
      { x: 0.50, y: 0.70, size: 9,  label: "ε" },
      { x: 0.72, y: 0.62, size: 10, label: "ζ" },
      { x: 0.50, y: 0.88, size: 11, label: "η" },
    ],
    lines: [[0,1],[0,2],[1,2],[1,3],[2,5],[3,4],[4,5],[4,6],[5,6]],
  },
  {
    name: "Perseus",
    stars: [
      { x: 0.50, y: 0.10, size: 12, label: "α" },
      { x: 0.36, y: 0.24, size: 14, label: "β" },
      { x: 0.62, y: 0.28, size: 9,  label: "γ" },
      { x: 0.24, y: 0.44, size: 10, label: "δ" },
      { x: 0.50, y: 0.50, size: 9,  label: "ε" },
      { x: 0.70, y: 0.62, size: 11, label: "ζ" },
      { x: 0.40, y: 0.78, size: 10, label: "η" },
    ],
    lines: [[0,1],[0,2],[1,3],[1,4],[2,4],[4,5],[4,6],[5,6]],
  },
];

const FLAW_TAGS = [
  "too shy", "procrastinate", "can't say no", "too sensitive",
  "easily bored", "overthink", "no confidence", "too short",
  "frizzy hair", "no degree", "bad at studying", "can't rest",
  "compared to siblings", "people pleaser", "clumsy", "lonely",
  "too tall", "no skills", "bad memory", "always late",
];

const complexToSignature = (text) => {
  const t = text.toLowerCase();
  const patterns = [
    { match: /(introvert|shy|awkward|quiet|antisocial)/, sig: "Depth of Still Water" },
    { match: /(bored|give up|distracted|short attention|follow.through)/, sig: "Infinite Doorways" },
    { match: /(sensitive|easily hurt|feel too much|fragile)/, sig: "Precision Antenna" },
    { match: /(clumsy|failing|not good|fumble)/, sig: "Memory in the Hands" },
    { match: /(overthink|anxious|worry|spiral)/, sig: "The Thinking Forest" },
    { match: /(invisible|don't stand out|forgettable|blend in)/, sig: "Protagonist of Background" },
    { match: /(weird|strange|different|don't fit|odd)/, sig: "Language from Another Planet" },
    { match: /(lonely|no friends|alone|isolated)/, sig: "Your Own Gravity" },
    { match: /(no confidence|worthless|useless|not enough|hate myself)/, sig: "An Unnamed Talent" },
    { match: /(short|petite|small|not tall)/, sig: "Close to Gravity" },
    { match: /(tall|towering|lanky)/, sig: "First Sight of the Horizon" },
    { match: /(hair|curly|frizzy|bald|thinning)/, sig: "Fibers of Time" },
    { match: /(degree|dropout|school|education|studying|grades|memory)/, sig: "A Self-Taught Universe" },
    { match: /(procrastinat|put off|can't start|delayed|late)/, sig: "The Time of Aging" },
    { match: /(say no|people pleaser|can't refuse|doormat|pushover)/, sig: "A Vessel of the Room" },
    { match: /(rest|relax|switch off|workaholic)/, sig: "Permanently Open Antenna" },
    { match: /(sibling|brother|sister|compared|family)/, sig: "A Different Constellation" },
    { match: /(skill|talent|nothing special|no qualif)/, sig: "An Unnamed Specialist" },
  ];
  for (const p of patterns) {
    if (p.match.test(t)) return p.sig;
  }
  return "An Unknown Frequency";
};

const pickRandom = () => CONSTELLATIONS[Math.floor(Math.random() * CONSTELLATIONS.length)];

// localStorage helpers
const loadSaved = () => {
  try {
    const flaws = localStorage.getItem("hc-flaws");
    const constellation = localStorage.getItem("hc-constellation");
    return {
      flaws: flaws ? JSON.parse(flaws) : [],
      constellation: constellation ? JSON.parse(constellation) : pickRandom(),
    };
  } catch {
    return { flaws: [], constellation: pickRandom() };
  }
};

export default function HiddenConstellation() {
  const saved = loadSaved();
  const [constellation, setConstellation] = useState(saved.constellation);
  const [flaws, setFlaws] = useState(saved.flaws);
  const [input, setInput] = useState("");
  const [hoveredStar, setHoveredStar] = useState(null);
  const [phase, setPhase] = useState(saved.flaws.length === 7 ? "complete" : "building");
  const [showComplete, setShowComplete] = useState(saved.flaws.length === 7);
  const [newStarIdx, setNewStarIdx] = useState(null);
  const [lineKeys, setLineKeys] = useState(() => {
    // Rebuild lineKeys from saved flaws
    const keys = {};
    if (saved.flaws.length > 0) {
      saved.constellation.lines.forEach(([a, b]) => {
        const aOn = saved.flaws.some(f => f.starIdx === a);
        const bOn = saved.flaws.some(f => f.starIdx === b);
        if (aOn && bOn) keys[`${a}-${b}`] = Date.now();
      });
    }
    return keys;
  });
  const inputRef = useRef(null);

  const total = 7;
  const count = flaws.length;
  const svgW = 300;
  const svgH = 320;
  const pos = (star) => ({ x: star.x * svgW, y: star.y * svgH });

  // Save to localStorage whenever flaws or constellation changes
  useEffect(() => {
    try {
      localStorage.setItem("hc-flaws", JSON.stringify(flaws));
      localStorage.setItem("hc-constellation", JSON.stringify(constellation));
    } catch {}
  }, [flaws, constellation]);

  const addFlaw = (text) => {
    if (!text.trim() || count >= total) return;
    const sig = complexToSignature(text);
    const idx = count;
    const next = [...flaws, { text: text.trim(), sig, starIdx: idx }];
    setFlaws(next);
    setNewStarIdx(idx);
    setInput("");
    setTimeout(() => setNewStarIdx(null), 900);

    const newKeys = { ...lineKeys };
    constellation.lines.forEach(([a, b]) => {
      const key = `${a}-${b}`;
      if (!newKeys[key]) {
        const aOn = next.some(f => f.starIdx === a);
        const bOn = next.some(f => f.starIdx === b);
        if (aOn && bOn) newKeys[key] = Date.now();
      }
    });
    setLineKeys(newKeys);

    if (next.length === total) {
      setTimeout(() => { setPhase("complete"); setTimeout(() => setShowComplete(true), 600); }, 400);
    }
  };

  const reset = () => {
    // Clear localStorage
    try {
      localStorage.removeItem("hc-flaws");
      localStorage.removeItem("hc-constellation");
    } catch {}
    setFlaws([]); setInput(""); setPhase("building");
    setShowComplete(false); setHoveredStar(null);
    setLineKeys({}); setNewStarIdx(null);
    setConstellation(pickRandom());
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100vw", background: "#03020b",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "1.5rem 1rem", fontFamily: "'Georgia', serif",
      position: "relative", overflow: "hidden",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes starAppear {
          0%   { opacity: 0; transform: scale(0); filter: drop-shadow(0 0 24px #fff); }
          55%  { opacity: 1; transform: scale(1.6); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes starPulse {
          0%,100% { opacity:0.55; } 50% { opacity:1; }
        }
        @keyframes lineGrow {
          from { stroke-dashoffset: var(--len,200); opacity:0; }
          to   { stroke-dashoffset:0; opacity:1; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%  { background-position:-200% center; }
          100%{ background-position: 200% center; }
        }
        @keyframes twinkle {
          0%,100%{ opacity:.12; } 50%{ opacity:.45; }
        }
        @keyframes completeGlow {
          0%,100%{ opacity:.2; } 50%{ opacity:.5; }
        }
        * { box-sizing: border-box; }
        .flaw-tag:hover {
          background:rgba(100,140,220,0.28)!important;
          border-color:rgba(168,200,255,0.42)!important;
          color:rgba(215,228,255,0.95)!important;
        }
        input::placeholder{ color:rgba(200,225,255,0.85 ); }
        input:focus{ outline:none; }
      `}</style>

      {/* Star field */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0 }}>
        {Array.from({length:70}).map((_,i)=>(
          <div key={i} style={{
            position:"absolute",
            left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
            width:`${1+Math.random()*1.5}px`, height:`${1+Math.random()*1.5}px`,
            borderRadius:"50%", background:"white",
            animation:`twinkle ${3+Math.random()*5}s ease-in-out ${Math.random()*5}s infinite`,
          }}/>
        ))}
      </div>

      <div style={{ position:"relative", zIndex:2, width:"100%", maxWidth:"440px" }}>

        {/* Title */}
        <div style={{ textAlign:"center", marginBottom:"1.4rem" }}>
          <h1 style={{
            fontSize:"clamp(1.5rem,5vw,2.2rem)", fontWeight:400,
            color:"#c8d8f8", margin:"0 0 0.3rem", letterSpacing:"0.06em",
          }}>
            Hidden{" "}
            <span style={{
              background:"linear-gradient(90deg,#a8c8ff,#e0d0ff,#a8e4ff,#a8c8ff)",
              backgroundSize:"200% auto", WebkitBackgroundClip:"text",
              WebkitTextFillColor:"transparent", animation:"shimmer 5s linear infinite",
            }}>Constellation</span>
          </h1>
          <p style={{
            color:"rgba(160,185,230,0.38)", fontSize:"0.7rem",
            letterSpacing:"0.18em", textTransform:"uppercase", margin:0,
          }}>
            {constellation.name} · {count} / {total} stars
          </p>
        </div>

        {/* Saved notice */}
        {count > 0 && count < total && (
          <div style={{
            textAlign:"center", marginBottom:"0.8rem",
            fontSize:"0.65rem", letterSpacing:"0.12em",
            color:"rgba(140,180,220,0.4)",
          }}>
            ✦ your progress is saved · come back anytime
          </div>
        )}

        {/* SVG */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"1.2rem" }}>
          <div style={{
            background:"rgba(7,5,20,0.78)",
            border:"1px solid rgba(100,140,220,0.11)",
            borderRadius:"14px", padding:"0.9rem",
            backdropFilter:"blur(10px)",
          }}>
            <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}
              style={{ display:"block", overflow:"visible" }}>

              {/* Ghost positions */}
              {constellation.stars.map((star,i)=>{
                if(flaws.some(f=>f.starIdx===i)) return null;
                const p=pos(star);
                return <circle key={`g${i}`} cx={p.x} cy={p.y} r={3}
                  fill="rgba(140,170,220,0.07)" stroke="rgba(140,170,220,0.09)" strokeWidth="1"/>;
              })}

              {/* Lines */}
              {constellation.lines.map(([a,b])=>{
                const key=`${a}-${b}`;
                if(!lineKeys[key]) return null;
                const pa=pos(constellation.stars[a]);
                const pb=pos(constellation.stars[b]);
                const len=Math.hypot(pb.x-pa.x,pb.y-pa.y);
                return <line key={key}
                  x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                  stroke="rgba(168,200,255,0.28)" strokeWidth="1" strokeLinecap="round"
                  style={{strokeDasharray:len,strokeDashoffset:0,"--len":len}}/>;
              })}

              {/* Complete glow */}
              {phase==="complete" && (
                <circle cx={svgW/2} cy={svgH/2} r={85}
                  fill="none" stroke="rgba(168,200,255,0.07)" strokeWidth={80}
                  style={{animation:"completeGlow 3s ease-in-out infinite"}}/>
              )}

              {/* Active stars */}
              {constellation.stars.map((star,i)=>{
                const flaw=flaws.find(f=>f.starIdx===i);
                if(!flaw) return null;
                const p=pos(star); const r=star.size/2;
                const isNew=newStarIdx===i; const isHov=hoveredStar===i;
                return (
                  <g key={`s${i}`} style={{cursor:"pointer"}}
                    onMouseEnter={()=>setHoveredStar(i)}
                    onMouseLeave={()=>setHoveredStar(null)}>
                    <circle cx={p.x} cy={p.y} r={r+10}
                      fill="none"
                      stroke={isHov?"rgba(168,200,255,0.38)":"rgba(168,200,255,0.1)"}
                      strokeWidth="1"
                      style={{animation:`starPulse ${2+i*0.4}s ease-in-out infinite`}}/>
                    <circle cx={p.x} cy={p.y} r={r}
                      fill={isHov?"#fff":"#a8c8ff"}
                      style={{
                        filter:`drop-shadow(0 0 ${isHov?14:7}px ${isHov?"#fff":"#a8c8ff"})`,
                        transition:"fill 0.3s, filter 0.3s",
                        animation:isNew?"starAppear 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards":"none",
                      }}/>
                    <text x={p.x+r+5} y={p.y+4}
                      fill="rgba(168,200,255,0.4)" fontSize="8"
                      fontFamily="Georgia,serif"
                      style={{userSelect:"none",pointerEvents:"none"}}>
                      {star.label}
                    </text>
                    {isHov && (
                      <g>
                        <rect x={p.x-74} y={p.y-58} width="148" height="48" rx="5"
                          fill="rgba(5,3,16,0.95)" stroke="rgba(168,200,255,0.16)" strokeWidth="1"/>
                        <text x={p.x} y={p.y-40} textAnchor="middle"
                          fill="#c8d8ff" fontSize="10" fontFamily="Georgia,serif">
                          {flaw.text}
                        </text>
                        <text x={p.x} y={p.y-24} textAnchor="middle"
                          fill="rgba(168,200,255,0.52)" fontSize="8.5"
                          fontFamily="Georgia,serif" fontStyle="italic">
                          → {flaw.sig}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Complete message */}
        {showComplete && (
          <div style={{textAlign:"center",marginBottom:"1rem",animation:"fadeUp 0.9s ease forwards"}}>
            <div style={{fontSize:"clamp(1rem,3vw,1.3rem)",color:"#c8d8ff",fontStyle:"italic",lineHeight:1.7,marginBottom:"0.35rem"}}>
              Your flaws became {constellation.name}
            </div>
            <div style={{fontSize:"0.7rem",color:"rgba(168,200,255,0.42)",letterSpacing:"0.1em"}}>
              Hover each star to reveal your hidden talent
            </div>
          </div>
        )}

        {/* Input */}
        {phase==="building" && (
          <div style={{animation:"fadeUp 0.4s ease forwards"}}>
            <div style={{display:"flex",justifyContent:"center",gap:"0.42rem",marginBottom:"0.9rem"}}>
              {Array.from({length:total}).map((_,i)=>(
                <div key={i} style={{
                  width:i<count?8:5, height:i<count?8:5,
                  borderRadius:"50%",
                  background:i<count?"#a8c8ff":"rgba(120,150,200,0.16)",
                  boxShadow:i<count?"0 0 6px rgba(168,200,255,0.6)":"none",
                  transition:"all 0.4s ease", marginTop:i<count?0:1.5,
                }}/>
              ))}
            </div>

            <div style={{
              background:"rgba(9,7,24,0.82)",
              border:"1px solid rgba(100,140,220,0.16)",
              borderRadius:"4px 16px 4px 12px",
              padding:"0.85rem 1.1rem", marginBottom:"0.85rem",
              backdropFilter:"blur(6px)",
            }}>
              <div style={{
                fontSize:"0.57rem",letterSpacing:"0.2em",
                color:"rgba(130,160,210,0.32)",
                fontFamily:"'Courier New',monospace",marginBottom:"0.5rem",
              }}>
                ∿ star {count+1} of {total}
              </div>
              <div style={{display:"flex",gap:"0.55rem",alignItems:"center"}}>
                <input ref={inputRef} value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addFlaw(input)}
                  placeholder="type a flaw you carry…"
                  style={{
                    flex:1, background:"transparent", border:"none",
                    color:"rgba(215,228,255,0.9)",
                    fontFamily:"'Georgia',serif", fontSize:"0.93rem",
                  }}/>
                <button onClick={()=>addFlaw(input)} disabled={!input.trim()} style={{
                  background:input.trim()
                    ?"linear-gradient(135deg,rgba(70,110,200,0.65),rgba(110,70,200,0.65))"
                    :"rgba(40,40,80,0.32)",
                  border:"none",
                  color:input.trim()?"#c8d8ff":"rgba(130,150,200,0.28)",
                  padding:"0.44rem 0.95rem",
                  borderRadius:"2px 10px 2px 8px",
                  cursor:input.trim()?"pointer":"default",
                  fontFamily:"'Georgia',serif", fontSize:"0.8rem",
                  transition:"all 0.3s ease", whiteSpace:"nowrap",
                }}>+ Star</button>
              </div>
            </div>

            <div style={{display:"flex",flexWrap:"wrap",gap:"0.36rem",justifyContent:"center"}}>
              {FLAW_TAGS.filter(t=>!flaws.some(f=>f.text===t)).slice(0,12).map(tag=>(
                <button key={tag} className="flaw-tag" onClick={()=>addFlaw(tag)} style={{
                  background:"rgba(50,70,130,0.16)",
                  border:"1px solid rgba(100,140,220,0.14)",
                  color:"rgba(165,192,232,0.58)",
                  padding:"0.25rem 0.68rem",
                  borderRadius:"1px 7px 1px 5px",
                  cursor:"pointer", fo
