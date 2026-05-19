
import { useState, useEffect, useRef, useMemo } from "react";
import { messages, MOOD_OPTIONS } from "./constants/messages.js";
import {
  getConstellationVisuals,
  getMoodMessage,
  getMoodEpilogueSequence,
} from "./utils/stage.js";

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

const EPILOGUE_FADE_MS = 2800;
const EPILOGUE_HOLD_MS = 6200;
const EPILOGUE_GAP_MS = 450;
/** Delay between each word appearing in epilogue messages. */
const EPILOGUE_WORD_DELAY_MS = 660;
/** Auto-show flaw → signature tooltip after picking a chip (+Star); was 1.4s, +5s. */
const FLAW_SIGNATURE_REVEAL_MS = 6400;
/** Extra hold (each) for epilogue slides 1–4 (indices 0–3); last slide unchanged */
const EPILOGUE_EXTRA_FIRST_FOUR_MS = 4000;
/** Final epilogue constellation spin (one turn); step 0 uses half this angular speed (double period). */
const EPILOGUE_SPIN_FINAL_SEC = 38;
const EPILOGUE_SPIN_START_SEC = EPILOGUE_SPIN_FINAL_SEC * 2;
/** Epilogue spin speed changes: ease-in-out angular velocity over this duration (ms). */
const EPILOGUE_SPIN_BLEND_MS = 1500;

function easeInOutCubic(t) {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** Epilogue: black → navy cross-fade (spinning constellation scene). */
const EPILOGUE_BACKGROUND_RAMP_MS = 12000;

/** Per-message stage navy; stage 1 darkest, stage 5 brightest. */
const NAVY_STAGE_GRADIENT_STOPS = [
  { inner: [6, 10, 32], outer: [2, 3, 18] },
  { inner: [12, 16, 46], outer: [4, 6, 28] },
  { inner: [20, 26, 68], outer: [6, 9, 44] },
  { inner: [30, 38, 98], outer: [9, 13, 64] },
  { inner: [46, 60, 136], outer: [12, 20, 90] },
];
const NAVY_ORIGIN_BLACK = [0, 0, 6];

function lerpRgb(from, to, t) {
  const u = Math.min(1, Math.max(0, t));
  const r = Math.round(from[0] + (to[0] - from[0]) * u);
  const g = Math.round(from[1] + (to[1] - from[1]) * u);
  const b = Math.round(from[2] + (to[2] - from[2]) * u);
  return `${r},${g},${b}`;
}

/** Radial navy sky: eased black→navy over `easedRamp`, tone follows epilogue slide (stage). */
function buildEpilogueBackdrop(epilogueSlideIndex, easedRamp) {
  const clampedSlide = Math.max(
    0,
    Math.min(epilogueSlideIndex, NAVY_STAGE_GRADIENT_STOPS.length - 1),
  );
  const stops = NAVY_STAGE_GRADIENT_STOPS[clampedSlide];
  const innerRgb = lerpRgb(NAVY_ORIGIN_BLACK, stops.inner, easedRamp);
  const outerRgb = lerpRgb(NAVY_ORIGIN_BLACK, stops.outer, easedRamp);
  const midBlend = 0.52;
  const i = stops.inner;
  const o = stops.outer;
  const midPt = [
    i[0] + (o[0] - i[0]) * midBlend,
    i[1] + (o[1] - i[1]) * midBlend,
    i[2] + (o[2] - i[2]) * midBlend,
  ];
  const midRgb = lerpRgb(NAVY_ORIGIN_BLACK, midPt, easedRamp);

  return `radial-gradient(ellipse 132% 100% at 50% 40%, rgb(${innerRgb}) 0%, rgb(${midRgb}) 46%, rgb(${outerRgb}) 100%)`;
}

const METEOR_WHITE_PALETTE = {
  tail: "linear-gradient(90deg, rgba(255, 238, 248, 0.62) 0%, rgba(255, 210, 228, 0.38) 10%, rgba(255, 195, 215, 0.22) 26%, rgba(255, 185, 205, 0.12) 48%, rgba(255, 185, 205, 0.05) 68%, rgba(255, 190, 205, 0.02) 82%, rgba(255, 195, 215, 0.008) 92%, transparent 100%)",
  tailShadow:
    "0 0 22px 10px rgba(255, 205, 225, 0.28), 0 0 40px 18px rgba(255, 185, 210, 0.12), inset 0 0 14px rgba(255, 255, 255, 0.18)",
  halo: "linear-gradient(90deg, rgba(255, 210, 228, 0.14) 0%, rgba(255, 200, 218, 0.06) 35%, rgba(255, 190, 210, 0.025) 65%, rgba(255, 188, 208, 0.01) 88%, transparent 100%)",
  haloShadow: "0 0 24px 14px rgba(255, 200, 220, 0.12)",
  head: "radial-gradient(circle at 30% 26%, #ffffff 0%, #fff5fb 35%, #ffd8ec 72%, #f0b8d8 100%)",
  headShadow:
    "0 0 8px 3px rgba(255, 245, 252, 0.95), 0 0 18px 8px rgba(255, 215, 235, 0.55), 0 0 32px 14px rgba(255, 190, 215, 0.35), inset 0 0 8px rgba(255, 255, 255, 0.9)",
};

const METEOR_YELLOW_PALETTES = [
  {
    tail: "linear-gradient(90deg, rgba(255, 248, 190, 0.7) 0%, rgba(255, 232, 150, 0.45) 10%, rgba(255, 215, 110, 0.26) 26%, rgba(255, 200, 90, 0.14) 48%, rgba(255, 190, 80, 0.06) 68%, rgba(255, 185, 75, 0.02) 82%, transparent 100%)",
    tailShadow:
      "0 0 22px 10px rgba(255, 220, 120, 0.32), 0 0 40px 18px rgba(255, 200, 90, 0.14), inset 0 0 14px rgba(255, 245, 200, 0.22)",
    halo: "linear-gradient(90deg, rgba(255, 230, 150, 0.16) 0%, rgba(255, 210, 120, 0.07) 35%, rgba(255, 195, 100, 0.03) 65%, transparent 88%)",
    haloShadow: "0 0 24px 14px rgba(255, 210, 110, 0.14)",
    head: "radial-gradient(circle at 30% 26%, #fffef0 0%, #ffe9a8 35%, #ffd060 72%, #e8a830 100%)",
    headShadow:
      "0 0 8px 3px rgba(255, 248, 210, 0.95), 0 0 18px 8px rgba(255, 220, 130, 0.55), 0 0 32px 14px rgba(255, 190, 80, 0.38), inset 0 0 8px rgba(255, 255, 230, 0.85)",
  },
  {
    tail: "linear-gradient(90deg, rgba(255, 242, 175, 0.68) 0%, rgba(255, 225, 135, 0.42) 10%, rgba(255, 205, 95, 0.24) 26%, rgba(245, 190, 70, 0.12) 48%, transparent 100%)",
    tailShadow:
      "0 0 24px 12px rgba(255, 210, 100, 0.3), 0 0 38px 16px rgba(255, 185, 70, 0.12), inset 0 0 12px rgba(255, 240, 180, 0.2)",
    halo: "linear-gradient(90deg, rgba(255, 215, 130, 0.14) 0%, rgba(255, 195, 90, 0.06) 40%, transparent 85%)",
    haloShadow: "0 0 26px 12px rgba(255, 200, 95, 0.13)",
    head: "radial-gradient(circle at 30% 26%, #fffce8 0%, #ffdc88 38%, #ffc840 70%, #d49828 100%)",
    headShadow:
      "0 0 9px 3px rgba(255, 245, 200, 0.92), 0 0 20px 9px rgba(255, 205, 110, 0.5), 0 0 30px 12px rgba(255, 175, 60, 0.35)",
  },
  {
    tail: "linear-gradient(90deg, rgba(255, 235, 160, 0.66) 0%, rgba(255, 218, 120, 0.4) 12%, rgba(255, 198, 85, 0.22) 30%, rgba(255, 180, 65, 0.1) 55%, transparent 100%)",
    tailShadow:
      "0 0 20px 9px rgba(255, 195, 85, 0.28), 0 0 36px 15px rgba(255, 170, 55, 0.11), inset 0 0 13px rgba(255, 230, 160, 0.18)",
    halo: "linear-gradient(90deg, rgba(255, 205, 115, 0.13) 0%, rgba(255, 185, 80, 0.05) 38%, transparent 90%)",
    haloShadow: "0 0 22px 13px rgba(255, 188, 88, 0.11)",
    head: "radial-gradient(circle at 30% 26%, #fff9e0 0%, #ffe070 32%, #f5b838 68%, #c88820 100%)",
    headShadow:
      "0 0 8px 3px rgba(255, 238, 185, 0.9), 0 0 17px 7px rgba(255, 198, 95, 0.52), 0 0 28px 13px rgba(255, 168, 50, 0.32)",
  },
];

/** Epilogue line: reveal words one at a time while the slide is visible. */
function EpilogueStaggeredMessage({ text, visible, className, style }) {
  const words = useMemo(
    () => (text ? text.trim().split(/\s+/).filter(Boolean) : []),
    [text],
  );
  const [shownCount, setShownCount] = useState(0);

  useEffect(() => {
    if (!visible || words.length === 0) {
      setShownCount(0);
      return;
    }

    setShownCount(0);
    let cancelled = false;
    let timerId = 0;
    let i = 0;

    const tick = () => {
      if (cancelled) return;
      i += 1;
      setShownCount(i);
      if (i < words.length) {
        timerId = window.setTimeout(tick, EPILOGUE_WORD_DELAY_MS);
      }
    };

    timerId = window.setTimeout(tick, EPILOGUE_WORD_DELAY_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timerId);
    };
  }, [text, visible, words]);

  return (
    <p className={className} style={style}>
      {words.map((word, i) => (
        <span
          key={`${i}-${word}`}
          style={{
            opacity: visible && i < shownCount ? 1 : 0,
            transition: "opacity 2.52s ease",
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}

/** Stable per-tag offset for scattered flaw-tag buttons on the building screen. */
function flawTagScatter(tag) {
  let h = 0;
  for (let i = 0; i < tag.length; i++) {
    h = (Math.imul(31, h) + tag.charCodeAt(i)) | 0;
  }
  const hx = ((h & 0xffff) >>> 0) / 0xffff;
  const hy = (((h >>> 16) & 0xffff) >>> 0) / 0xffff;
  const hr = (((h >>> 8) & 0xff) >>> 0) / 255;
  return {
    x: (hx - 0.5) * 16,
    y: (hy - 0.5) * 12,
    rot: (hr - 0.5) * 2.4,
  };
}

// localStorage helpers — do not resume a finished run (7 stars): always start the picking flow.
const loadSaved = () => {
  try {
    const flawsRaw = localStorage.getItem("hc-flaws");
    const constellationRaw = localStorage.getItem("hc-constellation");
    const moodRaw = localStorage.getItem("hc-mood");
    let flaws = flawsRaw ? JSON.parse(flawsRaw) : [];
    const constellation = constellationRaw ? JSON.parse(constellationRaw) : pickRandom();
    const mood = moodRaw && messages[moodRaw] ? moodRaw : null;
    if (Array.isArray(flaws) && flaws.length >= 7) {
      flaws = [];
    }
    return { flaws, constellation, mood };
  } catch {
    return { flaws: [], constellation: pickRandom(), mood: null };
  }
};

export default function HiddenConstellation() {
  const saved = loadSaved();
  const [mood, setMood] = useState(saved.mood);
  const [constellation, setConstellation] = useState(saved.constellation);
  const [flaws, setFlaws] = useState(saved.flaws);
  const [earlyComplete, setEarlyComplete] = useState(false);
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

  const [epilogueStep, setEpilogueStep] = useState(0);
  const [epilogueVisible, setEpilogueVisible] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
  );
  const [meteorOrientDeg, setMeteorOrientDeg] = useState(() => Math.random() * 360);
  const [meteorPass, setMeteorPass] = useState(1);
  const [meteorYellowIdx, setMeteorYellowIdx] = useState(0);
  const [epilogueElapsedMs, setEpilogueElapsedMs] = useState(0);

  const total = 7;
  const count = flaws.length;
  const svgW = isMobileLayout ? 210 : 300;
  const svgH = isMobileLayout ? 224 : 320;
  const pos = (star) => ({ x: star.x * svgW, y: star.y * svgH });

  const visibleFlawTags = useMemo(
    () => FLAW_TAGS.filter((t) => !flaws.some((f) => f.text === t)).slice(0, 12),
    [flaws],
  );

  const epilogueMessages = useMemo(
    () => (mood ? getMoodEpilogueSequence(mood, messages) : []),
    [mood],
  );
  const lastMessageIndex = Math.max(epilogueMessages.length - 1, 0);
  const constellationVisuals = getConstellationVisuals(count);

  /** Pink stars: 5+ inputs (5th star onward); core display logic unchanged. */
  const pinkStarsActive = count >= 5;
  const lastEpiloguePinkStars = pinkStarsActive;
  /** Darker last-epilogue pink on mobile only (desktop unchanged). */
  const lastPinkMobileDark = lastEpiloguePinkStars && isMobileLayout;

  const epilogueSpinLastIdx = Math.max(epilogueMessages.length - 1, 1);
  const epilogueSpinDurationSec = showComplete
    ? EPILOGUE_SPIN_START_SEC -
      (EPILOGUE_SPIN_FINAL_SEC * epilogueStep) / epilogueSpinLastIdx
    : EPILOGUE_SPIN_FINAL_SEC;

  const spinWrapRef = useRef(null);
  const spinAngleRef = useRef(0);
  const spinEpilogueActiveRef = useRef(false);
  const spinRafRef = useRef(0);
  const epilogueSpinDurationSecRef = useRef(epilogueSpinDurationSec);
  epilogueSpinDurationSecRef.current = epilogueSpinDurationSec;

  /** Duration (sec) used for the current omega ease segment; when ref changes, restart blend. */
  const spinAppliedDurationSecRef = useRef(null);
  /** Omega at start of current blend segment. */
  const spinOmegaBlendFromRef = useRef(0);
  /** performance.now() when current blend started. */
  const spinOmegaBlendT0Ref = useRef(0);
  /** Last frame's commanded angular velocity (rad/s), for chaining blends. */
  const spinLastOmegaCmdRef = useRef(0);

  useEffect(() => {
    if (!showComplete) {
      spinEpilogueActiveRef.current = false;
      spinAngleRef.current = 0;
      spinLastOmegaCmdRef.current = 0;
      spinAppliedDurationSecRef.current = null;
      cancelAnimationFrame(spinRafRef.current);
      spinRafRef.current = 0;
      const el = spinWrapRef.current;
      if (el) el.style.transform = "rotate(0deg)";
      return;
    }

    const TWO_PI = 2 * Math.PI;

    if (!spinEpilogueActiveRef.current) {
      const dur0 = epilogueSpinDurationSecRef.current;
      const o0 = TWO_PI / dur0;
      spinOmegaBlendFromRef.current = o0;
      spinLastOmegaCmdRef.current = o0;
      spinAppliedDurationSecRef.current = dur0;
      spinOmegaBlendT0Ref.current = performance.now() - (EPILOGUE_SPIN_BLEND_MS + 1);
      spinEpilogueActiveRef.current = true;
    }

    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      const dur = epilogueSpinDurationSecRef.current;
      if (dur !== spinAppliedDurationSecRef.current) {
        spinOmegaBlendFromRef.current = spinLastOmegaCmdRef.current;
        spinAppliedDurationSecRef.current = dur;
        spinOmegaBlendT0Ref.current = now;
      }

      const omegaTarget = TWO_PI / dur;
      const blendU = Math.min(1, (now - spinOmegaBlendT0Ref.current) / EPILOGUE_SPIN_BLEND_MS);
      const te = easeInOutCubic(blendU);
      const omegaCmd =
        spinOmegaBlendFromRef.current + (omegaTarget - spinOmegaBlendFromRef.current) * te;

      spinLastOmegaCmdRef.current = omegaCmd;
      spinAngleRef.current += omegaCmd * dt;
      while (spinAngleRef.current > TWO_PI * 16) spinAngleRef.current -= TWO_PI * 16;

      const el = spinWrapRef.current;
      if (el) {
        el.style.transform = `rotate(${(spinAngleRef.current * 180) / Math.PI}deg)`;
      }

      spinRafRef.current = requestAnimationFrame(tick);
    };

    spinRafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(spinRafRef.current);
      spinRafRef.current = 0;
    };
  }, [showComplete]);

  // Save to localStorage whenever flaws, constellation, or mood changes
  useEffect(() => {
    try {
      localStorage.setItem("hc-flaws", JSON.stringify(flaws));
      localStorage.setItem("hc-constellation", JSON.stringify(constellation));
      if (mood) localStorage.setItem("hc-mood", mood);
    } catch {}
  }, [flaws, constellation, mood]);

  useEffect(() => {
    if (!showComplete) {
      setEpilogueStep(0);
      setEpilogueVisible(false);
      return;
    }
    let cancelled = false;

    (async () => {
      if (earlyComplete) {
        setEpilogueVisible(false);
        await new Promise((r) => setTimeout(r, EPILOGUE_GAP_MS));
        if (cancelled) return;
        setEpilogueStep(lastMessageIndex);
        setEpilogueVisible(true);
        return;
      }

      const lastIdx = epilogueMessages.length - 1;
      if (lastIdx < 0) return;

      setEpilogueVisible(false);
      for (let i = 0; i < epilogueMessages.length; i++) {
        if (cancelled) return;
        if (i > 0) {
          setEpilogueVisible(false);
          await new Promise((r) => setTimeout(r, EPILOGUE_FADE_MS + EPILOGUE_GAP_MS));
          if (cancelled) return;
        } else {
          await new Promise((r) => setTimeout(r, EPILOGUE_GAP_MS));
          if (cancelled) return;
        }
        setEpilogueStep(i);
        setEpilogueVisible(true);
        await new Promise((r) => setTimeout(
          r,
          EPILOGUE_FADE_MS +
            EPILOGUE_HOLD_MS +
            (i < lastIdx ? EPILOGUE_EXTRA_FIRST_FOUR_MS : 0),
        ));
        if (cancelled) return;
        if (i === lastIdx) {
          return;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [showComplete, earlyComplete, epilogueMessages, lastMessageIndex]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobileLayout(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (mood) {
      setMeteorOrientDeg(Math.random() * 360);
      setMeteorPass(1);
      setMeteorYellowIdx(0);
    }
  }, [mood]);

  const meteorIsYellow = meteorPass % 4 === 0;
  const meteorPalette = meteorIsYellow
    ? METEOR_YELLOW_PALETTES[meteorYellowIdx % METEOR_YELLOW_PALETTES.length]
    : METEOR_WHITE_PALETTE;

  const handleMeteorIteration = () => {
    setMeteorOrientDeg(Math.random() * 360);
    setMeteorPass((p) => {
      const next = p + 1;
      if (next % 4 === 0) {
        setMeteorYellowIdx(Math.floor(Math.random() * METEOR_YELLOW_PALETTES.length));
      }
      return next;
    });
  };

  /** Epilogue rotating scene: sky dark → navy cross-fade (12s) + brighten per slide (stage). */
  useEffect(() => {
    if (!showComplete) {
      setEpilogueElapsedMs(0);
      return;
    }
    const t0 = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - t0;
      setEpilogueElapsedMs(elapsed);
      if (elapsed >= EPILOGUE_BACKGROUND_RAMP_MS) {
        clearInterval(id);
      }
    }, 100);
    return () => clearInterval(id);
  }, [showComplete]);

  const epilogueBackdrop = useMemo(() => {
    const rawRamp = Math.min(1, epilogueElapsedMs / EPILOGUE_BACKGROUND_RAMP_MS);
    const easedRamp = easeInOutCubic(rawRamp);
    return buildEpilogueBackdrop(epilogueStep, easedRamp);
  }, [epilogueElapsedMs, epilogueStep]);

  const addFlaw = (text) => {
    if (!text.trim() || count >= total) return;
    const sig = complexToSignature(text);
    const idx = count;
    const next = [...flaws, { text: text.trim(), sig, starIdx: idx }];
    setFlaws(next);
    setNewStarIdx(idx);
    setInput("");
    setTimeout(() => setNewStarIdx(null), FLAW_SIGNATURE_REVEAL_MS);

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
      setEarlyComplete(false);
      setTimeout(() => { setPhase("complete"); setTimeout(() => setShowComplete(true), 600); }, 400);
    }
  };

  const finishConstellation = () => {
    if (count < 3) return;
    setEarlyComplete(true);
    setPhase("complete");
    setTimeout(() => setShowComplete(true), 600);
  };

  const selectMood = (moodId) => {
    setMood(moodId);
    try {
      localStorage.setItem("hc-mood", moodId);
    } catch {}
  };

  const reset = () => {
    // Clear localStorage
    try {
      localStorage.removeItem("hc-flaws");
      localStorage.removeItem("hc-constellation");
      localStorage.removeItem("hc-mood");
    } catch {}
    setMood(null);
    setFlaws([]); setInput(""); setPhase("building");
    setShowComplete(false); setEarlyComplete(false);
    setHoveredStar(null);
    setLineKeys({}); setNewStarIdx(null);
    setConstellation(pickRandom());
  };

  return (
    <div style={{
      minHeight: "100vh", width: "100vw",
      background: showComplete ? epilogueBackdrop : "#03020b",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "1.5rem 1rem", fontFamily: "'Georgia', serif",
      position: "relative", overflow: "hidden",
      boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes starAppear {
          0%   { opacity: 0; transform: scale(0.42); filter: drop-shadow(0 0 0 transparent); }
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
        @keyframes meteorFlow10 {
          0% { transform: translate3d(46vmin, 0, 0); opacity: 0; }
          3.95% { opacity: 1; }
          38.2% { transform: translate3d(-16vmin, 0, 0); opacity: 1; }
          54% { transform: translate3d(-44vmin, 0, 0); opacity: 0.38; }
          65.8% { transform: translate3d(-54vmin, 0, 0); opacity: 0; }
          66%, 100% { transform: translate3d(-54vmin, 0, 0); opacity: 0; }
        }
        * { box-sizing: border-box; }
        .flaw-tag:hover {
          background:rgba(100,140,220,0.28)!important;
          border-color:rgba(168,200,255,0.42)!important;
          color:rgba(215,228,255,0.95)!important;
        }
        .flaw-tags-scroll {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 0.42rem 0.36rem;
          padding: 0.6rem 0.35rem 0.2rem;
          width: 100%;
          overflow: visible;
        }
        .flaw-tags-scroll .flaw-tag {
          justify-self: center;
          max-width: 100%;
        }
        .flaw-tags-row3 {
          display: contents;
        }
        @media (min-width: 641px) {
          .hc-main-column {
            overflow: visible;
          }
          .flaw-tags-row3 {
            display: grid;
            grid-column: 1 / -1;
            grid-template-columns: repeat(4, minmax(max-content, 1fr));
            gap: 0.42rem 0.5rem;
            width: min(100vw - 2.5rem, 36rem);
            margin-left: 50%;
            transform: translateX(-50%);
            justify-items: center;
            box-sizing: border-box;
          }
          .flaw-tags-row3 .flaw-tag {
            justify-self: center;
            width: auto;
            max-width: none;
          }
        }
        input::placeholder{ color:rgba(255,255,255,0.95) !important; }
        input:focus{ outline:none; }
        @media (max-width: 640px) {
          .epilogue-main-text {
            font-size: clamp(1.67rem, 5.62vw, 2.03rem) !important;
            color: #a8b6dc !important;
            word-spacing: 0.18em !important;
            text-wrap: balance;
          }
          .flaw-tags-scroll {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 0.55rem 0.42rem;
          }
          .flaw-tags-scroll .flaw-tag {
            width: 100%;
            min-width: 0;
            max-width: 100%;
            box-sizing: border-box;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .epilogue-main-text {
          word-spacing: 0.56em;
        }
        .mood-screen {
          text-align: center;
          width: 100%;
          max-width: 420px;
        }
        .mood-screen h2 {
          font-size: clamp(1.1rem, 3.2vw, 1.45rem);
          font-weight: 400;
          color: #c8d8f8;
          letter-spacing: 0.08em;
          margin: 0 0 1.6rem;
          font-style: italic;
        }
        .mood-option {
          display: block;
          width: 100%;
          text-align: left;
          background: rgba(50, 70, 130, 0.12);
          border: 1px solid rgba(100, 140, 220, 0.14);
          color: rgba(200, 218, 248, 0.82);
          padding: 0.85rem 1rem;
          margin-bottom: 0.55rem;
          border-radius: 4px 14px 4px 10px;
          cursor: pointer;
          font-family: 'Georgia', serif;
          font-size: clamp(0.88rem, 0.75rem + 0.5vw, 0.98rem);
          transition: border-color 0.35s, background 0.35s, box-shadow 0.35s;
        }
        .mood-option:hover {
          border-color: rgba(168, 200, 255, 0.32);
          background: rgba(80, 110, 180, 0.18);
          box-shadow: 0 0 18px rgba(120, 160, 230, 0.12);
        }
        .mood-option-label {
          letter-spacing: 0.06em;
        }
        .finish-early-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          width: 100%;
          margin-top: 0.65rem;
          background: transparent;
          border: 1px solid rgba(200, 215, 245, 0.14);
          color: rgba(210, 224, 255, 0.42);
          padding: 0.5rem 0.75rem;
          border-radius: 2px 12px 2px 8px;
          cursor: pointer;
          font-family: 'Georgia', serif;
          font-size: clamp(0.78rem, 0.68rem + 0.35vw, 0.86rem);
          letter-spacing: 0.04em;
          font-style: italic;
          transition: border-color 0.35s, color 0.35s, box-shadow 0.35s;
        }
        .finish-early-tap {
          flex-shrink: 0;
          font-style: normal;
          letter-spacing: 0.06em;
          color: rgba(228, 238, 255, 0.88);
        }
        .finish-early-btn:hover .finish-early-tap {
          color: rgba(245, 250, 255, 0.98);
        }
        .finish-early-btn:hover {
          border-color: rgba(200, 220, 255, 0.32);
          color: rgba(228, 238, 255, 0.72);
          box-shadow: 0 0 14px rgba(168, 200, 255, 0.1);
        }
      `}</style>

      {!mood && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem 1rem",
          }}
        >
          <div className="mood-screen">
            <h2>how does tonight feel?</h2>
            {MOOD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="mood-option"
                onClick={() => selectMood(opt.id)}
              >
                <span className="mood-option-label">
                  {opt.emoji} {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

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

      {mood && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              transform: `rotate(${meteorOrientDeg}deg)`,
              transformOrigin: "50% 50%",
              width: 0,
              height: 0,
              position: "relative",
            }}
          >
            <div
              onAnimationIteration={handleMeteorIteration}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "calc(38vmin * 1.4 * 1.5)",
                height: "26px",
                marginLeft: "calc(-19vmin * 1.4 * 1.5)",
                marginTop: "-13px",
                transformOrigin: "50% 50%",
                animation: "meteorFlow10 calc(10s / 1.3 + 7.5s) linear infinite",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "8px",
                  right: "-7vmin",
                  top: "50%",
                  height: "5px",
                  marginTop: "-2.5px",
                  borderRadius: "999px",
                  zIndex: 1,
                  filter: "blur(1.85px)",
                  background: meteorPalette.tail,
                  boxShadow: meteorPalette.tailShadow,
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: "22%",
                  right: "-10vmin",
                  top: "50%",
                  height: "8px",
                  marginTop: "-4px",
                  zIndex: 0,
                  filter: "blur(4.5px)",
                  opacity: 0.5,
                  borderRadius: "999px",
                  background: meteorPalette.halo,
                  boxShadow: meteorPalette.haloShadow,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "0",
                  top: "50%",
                  width: "7.56px",
                  height: "7.56px",
                  marginTop: "-3.78px",
                  borderRadius: "50%",
                  zIndex: 2,
                  background: meteorPalette.head,
                  boxShadow: meteorPalette.headShadow,
                }}
              />
            </div>
          </div>
        </div>
      )}

      {mood && (
      <div className="hc-main-column" style={{ position:"relative", zIndex:2, width:"100%", maxWidth:"440px" }}>

        {/* Title */}
        <div style={{ textAlign:"center", marginBottom:"1.4rem" }}>
          {!showComplete && (
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
          )}
          {!showComplete && (
          <p style={{
            color:"rgba(160,185,230,0.38)", fontSize:"0.7rem",
            letterSpacing:"0.18em", textTransform:"uppercase", margin:0,
          }}>
            {constellation.name}
          </p>
          )}
        </div>

        {/* SVG */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:"1.2rem" }}>
          <div style={{
            background: showComplete ? "rgba(0, 0, 0, 0.4)" : "rgba(7,5,20,0.78)",
            border: showComplete ? "none" : "1px solid rgba(100,140,220,0.11)",
            borderRadius: showComplete ? "50%" : "14px",
            padding: showComplete
              ? (isMobileLayout ? "0.945rem" : "1.35rem")
              : (isMobileLayout ? "0.63rem" : "0.9rem"),
            backdropFilter: showComplete ? undefined : "blur(10px)",
            boxShadow: showComplete ? "0 0 40px rgba(0, 0, 0, 0.5)" : undefined,
            overflow: showComplete ? "visible" : "hidden",
          }}>
            <div
              ref={spinWrapRef}
              style={{
                width: svgW,
                height: svgH,
                overflow: "visible",
                transformOrigin: "center center",
                willChange: showComplete ? "transform" : "auto",
              }}
            >
            <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}
              style={{ display:"block", overflow:"visible" }}>
              <defs>
                <radialGradient id="hc-star-pink" cx="30%" cy="28%" r="75%">
                  <stop offset="0%" stopColor="#fff2f7" />
                  <stop offset="38%" stopColor="#ffc2df" />
                  <stop offset="100%" stopColor="#e85a9e" />
                </radialGradient>
                <linearGradient id="hc-star-pink-hover" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="100%" stopColor="#ff6eb2" />
                </linearGradient>
                <radialGradient id="hc-star-pink-m" cx="30%" cy="28%" r="75%">
                  <stop offset="0%" stopColor="#d8b8c8" />
                  <stop offset="40%" stopColor="#b06088" />
                  <stop offset="100%" stopColor="#6e2048" />
                </radialGradient>
                <linearGradient id="hc-star-pink-hover-m" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e0c0d4" />
                  <stop offset="100%" stopColor="#a03068" />
                </linearGradient>
              </defs>

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
                if(!lineKeys[key] || !constellationVisuals.showLines) return null;
                const pa=pos(constellation.stars[a]);
                const pb=pos(constellation.stars[b]);
                const len=Math.hypot(pb.x-pa.x,pb.y-pa.y);
                const lineO = constellationVisuals.lineOpacity;
                const blueA = 0.28 * lineO;
                const pinkA = (lastPinkMobileDark ? 0.5 : 0.55) * lineO;
                return <line key={key}
                  x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
                  stroke={lastEpiloguePinkStars
                    ? (lastPinkMobileDark ? `rgba(175, 75, 110, ${pinkA})` : `rgba(255, 140, 178, ${pinkA})`)
                    : `rgba(168,200,255,${blueA})`}
                  strokeWidth="1" strokeLinecap="round"
                  style={{
                    strokeDasharray: len,
                    strokeDashoffset: 0,
                    "--len": len,
                    transition: "stroke 2.2s ease, opacity 1.2s ease",
                    opacity: lineO,
                  }}/>;
              })}

              {/* Complete glow */}
              {phase==="complete" && (
                <circle cx={svgW/2} cy={svgH/2} r={isMobileLayout ? 60 : 85}
                  fill="none"
                  stroke={lastEpiloguePinkStars
                    ? (lastPinkMobileDark ? "rgba(150, 60, 90, 0.14)" : "rgba(255, 130, 175, 0.16)")
                    : "rgba(168,200,255,0.07)"}
                  strokeWidth={isMobileLayout ? 56 : 80}
                  style={{
                    animation: "completeGlow 3s ease-in-out infinite",
                    transition: "stroke 2.2s ease",
                  }}/>
              )}

              {/* Active stars */}
              {constellation.stars.map((star,i)=>{
                const flaw=flaws.find(f=>f.starIdx===i);
                if(!flaw) return null;
                const p=pos(star); const r=star.size/2;
                const isNew=newStarIdx===i; const isHov=hoveredStar===i||newStarIdx===i;
                const pinkFill = isHov
                  ? `url(#${lastPinkMobileDark ? "hc-star-pink-hover-m" : "hc-star-pink-hover"})`
                  : `url(#${lastPinkMobileDark ? "hc-star-pink-m" : "hc-star-pink"})`;
                const pinkGlow = lastPinkMobileDark
                  ? (isHov ? "#9a5a78" : "#7a4060")
                  : (isHov ? "#ffb8de" : "#ff7eb8");
                const blueFill = isHov ? "#fff" : "#a8c8ff";
                const blueGlow = isHov ? "#fff" : "#a8c8ff";
                return (
                  <g key={`s${i}`} style={{
                    cursor:"pointer",
                    opacity: constellationVisuals.starOpacity,
                    transition: "opacity 1.2s ease",
                  }}
                    onMouseEnter={()=>setHoveredStar(i)}
                    onMouseLeave={()=>{
                      if (newStarIdx !== i) setHoveredStar(null);
                    }}>
                    <circle cx={p.x} cy={p.y} r={r+10}
                      fill="none"
                      stroke={lastEpiloguePinkStars
                        ? lastPinkMobileDark
                          ? (isHov ? "rgba(175, 72, 105, 0.52)" : "rgba(155, 62, 92, 0.26)")
                          : (isHov ? "rgba(255, 140, 185, 0.55)" : "rgba(255, 120, 165, 0.28)")
                        : (isHov ? "rgba(168,200,255,0.38)" : "rgba(168,200,255,0.1)")}
                      strokeWidth="1"
                      style={{
                        animation: `starPulse ${2+i*0.4}s ease-in-out infinite`,
                        transition: "stroke 2.2s ease",
                      }}/>
                    <circle cx={p.x} cy={p.y} r={r}
                      fill={lastEpiloguePinkStars ? pinkFill : blueFill}
                      style={{
                        transformOrigin: `${p.x}px ${p.y}px`,
                        transformBox: "fill-box",
                        filter: lastEpiloguePinkStars
                          ? `drop-shadow(0 0 ${isHov ? 18 : 12}px ${pinkGlow}) drop-shadow(0 0 ${isHov ? 7 : 5}px rgba(255,255,255,0.7)) drop-shadow(${isHov ? -2 : -1}px ${isHov ? -3 : -2}px ${isHov ? 6 : 4}px rgba(255,255,255,0.45))`
                          : `drop-shadow(0 0 ${isHov ? 16 : 10}px ${blueGlow})`,
                        transition: "fill 2.2s ease, filter 2.2s ease",
                        animation: isNew ? "starAppear 1.4s cubic-bezier(0.22, 0.61, 0.36, 1) forwards" : "none",
                      }}/>
                    {lastEpiloguePinkStars && (
                      <circle
                        cx={p.x - r * 0.28}
                        cy={p.y - r * 0.3}
                        r={Math.max(r * 0.3, 2.2)}
                        fill="rgba(255,255,255,0.62)"
                        opacity={isHov ? 0.92 : 0.58}
                        style={{ pointerEvents: "none" }}
                      />
                    )}
                    <text x={p.x+r+5} y={p.y+4}
                      fill={lastEpiloguePinkStars
                        ? (lastPinkMobileDark ? "rgba(195, 125, 150, 0.82)" : "rgba(255, 175, 205, 0.88)")
                        : "rgba(168,200,255,0.4)"}
                      fontSize="8"
                      fontFamily="Georgia,serif"
                      style={{userSelect:"none",pointerEvents:"none"}}>
                      {star.label}
                    </text>
                    {isHov && (
                      <g>
                        <rect x={p.x-74} y={p.y-58} width="148" height="48" rx="5"
                          fill="rgba(5,3,16,0.95)" stroke="rgba(168,200,255,0.16)" strokeWidth="1"/>
                        <text x={p.x} y={p.y-40} textAnchor="middle"
                          fill="#e4ecff" fontSize="10" fontFamily="Georgia,serif">
                          {flaw.text}
                        </text>
                        <text x={p.x} y={p.y-24} textAnchor="middle"
                          fill="rgba(200,220,255,0.92)" fontSize="8.5"
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
        </div>

        {/* Epilogue sequence (after constellation complete) */}
        {showComplete && (
          <div style={{
            textAlign: "center",
            marginBottom: "1rem",
            minHeight: "clamp(7rem, 22vh, 11rem)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 0.25rem",
          }}>
            <EpilogueStaggeredMessage
              key={earlyComplete ? `early-${count}` : epilogueStep}
              text={
                earlyComplete
                  ? getMoodMessage(mood, count, messages)
                  : epilogueMessages[epilogueStep]
              }
              visible={epilogueVisible}
              className="epilogue-main-text"
              style={{
                fontSize: "clamp(1.236rem, 4.166vw, 1.505rem)",
                color: "#c8d8ff",
                fontStyle: "italic",
                lineHeight: 1.78,
                margin: 0,
                maxWidth: "26rem",
                overflowWrap: "break-word",
                opacity: epilogueVisible ? 1 : 0,
                transition: `opacity ${EPILOGUE_FADE_MS}ms ease-in-out`,
                textShadow: "0 0 28px rgba(90, 120, 200, 0.12)",
              }}
            />
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
                <input ref={inputRef} value={input}
                  onChange={e=>setInput(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addFlaw(input)}
                  placeholder="type a flaw you carry…"
                  style={{
                    width:"100%", background:"transparent", border:"none",
                    color:"rgba(232,240,255,0.98)",
                    fontFamily:"'Georgia',serif",
                    fontSize:"clamp(0.88rem, 0.72rem + 0.85vw, 0.94rem)",
                  }}/>
            </div>

            {count >= 3 && (
              <button
                type="button"
                className="finish-early-btn"
                onClick={finishConstellation}
              >
                <span>let this be my constellation</span>
                <span className="finish-early-tap">→ tap</span>
              </button>
            )}

            <div className="flaw-tags-scroll">
              {visibleFlawTags.slice(0, 8).map((tag) => (
                  <button
                    key={tag}
                    className="flaw-tag"
                    onClick={() => addFlaw(tag)}
                    style={{
                      background:"rgba(50,70,130,0.16)",
                      border:"1px solid rgba(100,140,220,0.14)",
                      color:"rgba(165,192,232,0.58)",
                      padding:"0.25rem 0.68rem",
                      borderRadius:"1px 7px 1px 5px",
                      cursor:"pointer",
                      fontFamily:"'Georgia', serif",
                      fontSize:"clamp(0.86rem, 0.58rem + 1.35vw, 0.96rem)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {tag}
                  </button>
              ))}
              {visibleFlawTags.length > 8 && (
                <div className="flaw-tags-row3">
                  {visibleFlawTags.slice(8).map((tag) => (
                    <button
                      key={tag}
                      className="flaw-tag"
                      onClick={() => addFlaw(tag)}
                      style={{
                        background:"rgba(50,70,130,0.16)",
                        border:"1px solid rgba(100,140,220,0.14)",
                        color:"rgba(165,192,232,0.58)",
                        padding:"0.25rem 0.68rem",
                        borderRadius:"1px 7px 1px 5px",
                        cursor:"pointer",
                        fontFamily:"'Georgia', serif",
                        fontSize:"clamp(0.86rem, 0.58rem + 1.35vw, 0.96rem)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Flaw list (hidden on final complete screen — main epilogue only) */}
        {flaws.length > 0 && !showComplete && (
          <div style={{marginTop:"1.1rem"}}>
            {flaws.map((f,i)=>(
              <div key={i} style={{
                display:"flex",alignItems:"center",
                gap:"0.5rem",marginBottom:"0.32rem",
              }}>
                <div style={{width:5,height:5,borderRadius:"50%",flexShrink:0,
                  background:"#a8c8ff",boxShadow:"0 0 5px rgba(168,200,255,0.7)"}}/>
                <span style={{color:"rgba(210,224,255,0.88)",fontSize:"0.78rem"}}>{f.text}</span>
                <span style={{color:"rgba(195,215,255,0.88)",fontSize:"0.7rem",fontStyle:"italic"}}>→ {f.sig}</span>
              </div>
            ))}
          </div>
        )}

        {/* Reset */}
        {phase==="complete" && (
          <div style={{textAlign:"center",marginTop:"1.3rem"}}>
            <button onClick={reset} style={{
              background:"transparent",
              border:"1px solid rgba(168,200,255,0.2)",
              color:"rgba(188,214,255,0.72)",
              padding:"0.52rem 1.5rem",
              borderRadius:"2px 12px 2px 10px",
              cursor:"pointer", fontFamily:"'Georgia',serif",
              fontSize:"0.8rem", letterSpacing:"0.05em", transition:"all 0.3s ease",
            }}
              onMouseEnter={e=>e.target.style.borderColor="rgba(168,200,255,0.48)"}
              onMouseLeave={e=>e.target.style.borderColor="rgba(168,200,255,0.2)"}
            >Begin again →</button>
          </div>
        )}
      </div>
      )}
    </div>
  );
}
