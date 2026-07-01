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

/* ---- Frame border: a real Celtic knot ring in the angular ENGRAVED hand.
   The geometric twin of frameBraid() — same (w,h)->fragment signature, same
   grid-graph engine, but straight mitered cords with a fine bg channel. */
export function plaitFrame(w, h, { cord = PLAIT_HEX.gold, bg = PLAIT_HEX.bg } = {}) {
  if (w < 120 || h < 120) return '';
  const tile = Math.max(40, Math.min(60, Math.round(Math.min(w, h) / 3.2)));
  return knotFrame(w, h, { hand: 'geometric', cord, bg, tile, strandProp: 0.5 });
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
