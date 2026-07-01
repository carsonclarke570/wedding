/* ============================================================
   Gilt & Grove — Celtic knot ornaments (woven / smooth hand)

   Thin wrappers over the canonical grid-graph engine in ./knotwork.mjs.
   Every ornament here is a REAL interlaced Celtic knot (continuous strands
   weaving over/under on a grid), rendered in the rounded "rope" hand — the
   angular twin lives in ./ornaments.mjs. See knotwork.mjs for the method.

   Colors go through `style="stroke:…"` so CSS var()s resolve in the page.
   ============================================================ */

import { knotFrame, knotSeal, knotArch } from './knotwork.mjs';

const RAD = Math.PI / 180;
const f = (n) => n.toFixed(2);

/* ---- The Frame border — a real Celtic knot ring -----------------------
   A hollow rectangular knotwork border (grid-graph engine), woven in the
   smooth "rope" hand. Ties a genuine interlaced corner at each corner and
   runs a continuous over/under plait along every edge. Fits any w×h box. */
export function frameBraid(w, h, { cord = 'var(--metal)', bg = 'var(--bg)' } = {}) {
  if (w < 120 || h < 120) return '';
  // Coarser tiles on small boxes so the ring never crowds the content.
  const tile = Math.max(40, Math.min(60, Math.round(Math.min(w, h) / 3.2)));
  return knotFrame(w, h, { hand: 'smooth', cord, bg, tile, strandProp: 0.52, curveStrength: 0.34 });
}

/* ---- Rising-sun halo — a real knot arch + rays ------------------------
   A running-plait knot band (grid-graph engine) warped onto a circular arc:
   the crown is genuine over/under knotwork, gilded green→gold→green, with a
   fan of fine sun rays beneath it. Replaces the old two-sine braid. */
export function archBraid(
  W = 820,
  H = 360,
  { cordGradId = 'ggArchCord', bg = 'var(--bg)', hand = 'smooth' } = {}
) {
  const a0 = 198, a1 = 342; // degrees, screen space (y down); crown at 270°
  const arch = knotArch(W, H, {
    hand, cord: `url(#${cordGradId})`, bg,
    a0, a1, rows: 1, tile: 50, strandProp: 0.5, curveStrength: 0.34,
  });
  const { cx, cy, R } = arch;

  // Fine rays fanning from the base center, beneath/within the arch.
  const rays = [];
  const RN = 13;
  const rInner = R * 0.30;
  const rOuter = R * 0.96;
  for (let i = 0; i < RN; i++) {
    const ang = (a0 + 8 + ((a1 - a0 - 16) * i) / (RN - 1)) * RAD;
    const x1 = cx + rInner * Math.cos(ang);
    const y1 = cy + rInner * Math.sin(ang);
    const x2 = cx + rOuter * Math.cos(ang);
    const y2 = cy + rOuter * Math.sin(ang);
    const wgt = i % 2 === 0 ? 1.2 : 0.7;
    rays.push(`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke-width="${wgt}" style="stroke:url(#ggRay)"/>`);
  }

  const defs =
    `<defs>` +
    `<linearGradient id="${cordGradId}" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0" stop-color="var(--green-300)"/>` +
    `<stop offset="0.5" stop-color="var(--gold-400)"/>` +
    `<stop offset="1" stop-color="var(--green-300)"/>` +
    `</linearGradient>` +
    `<linearGradient id="ggRay" x1="0" y1="1" x2="0" y2="0">` +
    `<stop offset="0" stop-color="var(--gold-500)" stop-opacity="0"/>` +
    `<stop offset="1" stop-color="var(--gold-400)" stop-opacity="0.55"/>` +
    `</linearGradient>` +
    `</defs>`;

  return { svg: defs + `<g>${rays.join('')}</g>` + arch.inner, viewBox: `0 0 ${W} ${H}`, width: W, height: H };
}

/* ---- Woven divider — the rope twin of divider.svg ----------------------
   Two round-capped rope rails (sage ⟷ bronze) tapering in from the edges,
   tied at centre by the woven triquetra. Round caps + the duo sheen keep it
   firmly in the rope family. */
export function wovenDivider({ width = 300, gold = 'var(--metal)', bg = 'var(--bg)' } = {}) {
  const size = 40, h = size + 6, cy = h / 2, knotW = size + 16;
  const railEnd = (width - knotW) / 2 - 4;
  const seal = knotSeal({ size, hand: 'smooth', cord: gold, bg, strandProp: 0.6 });
  const inner = seal.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return (
    `<svg width="${width}" height="${h}" viewBox="0 0 ${width} ${h}" fill="none" overflow="visible" aria-hidden="true" style="display:block">` +
    // CSS vars resolve in `style`, not in stroke attributes — so the rails are styled.
    `<line x1="14" y1="${cy}" x2="${railEnd}" y2="${cy}" stroke-width="1.6" stroke-linecap="round" style="stroke:var(--green-300)"/>` +
    `<line x1="${width - railEnd}" y1="${cy}" x2="${width - 14}" y2="${cy}" stroke-width="1.6" stroke-linecap="round" style="stroke:var(--gold-300)"/>` +
    `<g transform="translate(${(width - size) / 2} ${(h - size) / 2})">${inner}</g>` +
    `</svg>`
  );
}

/* ---- Triquetra (trinity-knot) seal — a small woven crest ---------------
   Three overlapping vesica leaves, each rendered casing-then-cord so the
   three arcs interlace. Used as a card crest / section mark. */
export function triquetra({ size = 34, stroke = 'var(--metal)', gap = 'var(--bg)' } = {}) {
  const leaf = 'M50,10 A32,32 0 0,1 50,58 A32,32 0 0,1 50,10 Z';
  const patch = 'M64.6,41.2 A32,32 0 0,1 50,58';
  const angles = [0, 120, 240];
  const cord = (d) =>
    `<path d="${d}" fill="none" stroke-width="17" stroke-linejoin="round" stroke-linecap="round" style="stroke:${gap}"/>` +
    `<path d="${d}" fill="none" stroke-width="11" stroke-linejoin="round" stroke-linecap="round" style="stroke:${stroke}"/>`;
  const body =
    angles.map((a) => `<g transform="rotate(${a} 50 50)">${cord(leaf)}</g>`).join('') +
    angles.map((a) => `<g transform="rotate(${a} 50 50)">${cord(patch)}</g>`).join('');
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" overflow="visible" aria-hidden="true" style="display:block">${body}</svg>`;
}
