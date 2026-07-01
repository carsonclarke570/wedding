/* ============================================================
   Gilt & Grove — Plaited (angular) knot ornaments
   The Art-Deco counterpart to the rope hand in knots.mjs.

   Thin wrappers over the canonical grid-graph engine in ./knotwork.mjs:
   the SAME real interlaced Celtic knot, rendered in the geometric hand —
   straight mitered cords, butt caps, a fine background channel engraved
   down each spine. Structure is Celtic; surface is Deco.

   Hex-resolved palette so a generated SVG stands alone off-page.
   ============================================================ */

import { knotFrame, knotSeal, knotBand } from './knotwork.mjs';

const f = (n) => Math.round(n * 100) / 100;

export const PLAIT_HEX = {
  gold: '#B18A44',
  bg: '#121110',
  green: '#5F7456',
  bronze: '#8D6B31',
};

/* Corner-fade mask: full braid at corners, fading to `midOpacity` at edge midpoints.
   Produces a "taper" effect where the knotwork concentrates at corners. */
function cornerTaper(content, w, h, tile, midOpacity) {
  const r = tile * 3.2;
  const uid = `t${w}x${h}`;
  const corners = [[0, 0], [w, 0], [0, h], [w, h]];
  const grads = corners.map(([cx, cy], i) =>
    `<radialGradient id="${uid}_g${i}" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse">` +
    `<stop offset="0" stop-color="white"/><stop offset="1" stop-color="white" stop-opacity="0"/>` +
    `</radialGradient>`
  ).join('');
  const fills = corners.map((_, i) =>
    `<rect width="${w}" height="${h}" fill="url(#${uid}_g${i})"/>`
  ).join('');
  return (
    `<defs>${grads}<mask id="${uid}_m">` +
    `<rect width="${w}" height="${h}" fill="white" fill-opacity="${midOpacity}"/>` +
    `${fills}</mask></defs>` +
    `<g mask="url(#${uid}_m)">${content}</g>`
  );
}

/* ---- Frame border: a real Celtic knot ring in the angular ENGRAVED hand.
   The geometric twin of frameBraid() — same (w,h)->fragment signature, same
   grid-graph engine, but straight mitered cords with a fine bg channel. */
export function plaitFrame(w, h, { cord = PLAIT_HEX.gold, bg = PLAIT_HEX.bg, strandProp, maxTile, taper, taperStrength } = {}) {
  if (w < 120 || h < 120) return '';
  const cap = maxTile ?? 60;
  const tile = Math.max(24, Math.min(cap, Math.round(Math.min(w, h) / 3.2)));
  const content = knotFrame(w, h, { hand: 'geometric', cord, bg, tile, strandProp: strandProp ?? 0.5 });
  return taper ? cornerTaper(content, w, h, tile, taperStrength ?? 0.12) : content;
}

/* ---- Seal: a small square knot crest in the engraved hand. */
export function plaitSeal({ size = 66, gold = PLAIT_HEX.gold, bg = PLAIT_HEX.bg } = {}) {
  return knotSeal({ size, hand: 'geometric', cord: gold, bg, strandProp: 0.52 });
}

/* ---- Straight band: an inline engraved running-plait run. */
export function plaitBand({ length = 96, gold = PLAIT_HEX.gold, bg = PLAIT_HEX.bg } = {}) {
  const { inner, width, height } = knotBand({ length, hand: 'geometric', cord: gold, bg, tile: 26 });
  return `<svg width="${f(width)}" height="${f(height)}" viewBox="0 0 ${f(width)} ${f(height)}" fill="none" aria-hidden="true" style="display:block">${inner}</svg>`;
}

/* ---- Divider: green→bronze rails with a centred engraved knot seal. */
export function plaitDivider({ width = 300, gold = PLAIT_HEX.gold, bg = PLAIT_HEX.bg } = {}) {
  const size = 46, h = size + 4, cy = h / 2, knotW = size + 20;
  const railEnd = (width - knotW) / 2 - 10;
  const seal = plaitSeal({ size, gold, bg });
  const inner = seal.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return (
    `<svg width="${width}" height="${h}" viewBox="0 0 ${width} ${h}" fill="none" aria-hidden="true" style="display:block">` +
    `<line x1="14" y1="${cy}" x2="${railEnd}" y2="${cy}" stroke="${PLAIT_HEX.green}" stroke-width="1.2"/>` +
    `<line x1="${width - railEnd}" y1="${cy}" x2="${width - 14}" y2="${cy}" stroke="${PLAIT_HEX.bronze}" stroke-width="1.2"/>` +
    `<g transform="translate(${(width - size) / 2}, ${(h - size) / 2})">${inner}</g>` +
    `</svg>`
  );
}
