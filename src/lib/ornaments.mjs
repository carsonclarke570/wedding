/* ============================================================
   Gilt & Grove — Plaited (angular) ornament engine
   The Art-Deco counterpart to the rope engine in knots.mjs.

   Vocabulary (matched to monogram.svg / divider.svg):
   - Straight cords at 45°/90°, butt caps — no curves.
   - Each cord is ENGRAVED: a flat gold stroke with a thin
     background-coloured channel down its centre line.
   - Junction dots (a gold disc cored with the channel colour)
     round off every turning point.
   This is a Deco line-lattice, not a rope weave: the two styles
   share the knot grammar (braid, corners, trinity) but differ in
   curvature, caps and surface — so each can be a consistent SET.

   One generator (a zig-zag plait along any centerline) drives the
   band, the frame border and the seal, exactly as the single
   braid generator drives the rope frame/arch/triquetra.
   ============================================================ */

const f = (n) => Math.round(n * 100) / 100;

// Resolved to hex so generated SVG stands alone (var() doesn't resolve
// outside a page) — identical palette to the committed angular assets.
export const PLAIT_HEX = {
  gold: '#B18A44',
  bg: '#121110',
  green: '#5F7456',
  bronze: '#8D6B31',
};

/* Render straight cord segments + junction dots in the engraved style:
   flat gold cord, thin background channel, gold dots cored with channel. */
function engrave(segs, dots, { cell, gold = PLAIT_HEX.gold, bg = PLAIT_HEX.bg }) {
  const cord = cell * 0.46;   // gold cord weight   (≈ matches the assets)
  const chan = cord * 0.2;    // engraved centre channel
  const dr = cord * 0.5;      // junction dot radius
  const line = (s, w, c) =>
    `<line x1="${f(s[0])}" y1="${f(s[1])}" x2="${f(s[2])}" y2="${f(s[3])}" stroke="${c}" stroke-width="${f(w)}" stroke-linecap="butt"/>`;
  const dot = (p, r, c) => `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(r)}" fill="${c}"/>`;
  return (
    segs.map((s) => line(s, cord, gold)).join('') +
    dots.map((p) => dot(p, dr, gold)).join('') +
    segs.map((s) => line(s, chan, bg)).join('') +
    dots.map((p) => dot(p, dr * 0.22, bg)).join('')
  );
}

/* A zig-zag plait along a centerline pt(s), with inward unit normal nrm(s).
   Two mirrored strands bounce between the two rails at ±amp(s); they cross
   on the centerline between every pair of nodes (the woven X). Turning
   points carry junction dots. amp may taper, so a band can bloom into a
   knot at a corner and collapse to a single engraved rule along an edge. */
function plaitStrands({ pt, nrm, total, closed, cell, ampFn, dotMin = 1.2 }) {
  let nodes = Math.max(2, Math.round(total / cell));
  if (closed && nodes % 2) nodes += 1;
  const step = total / nodes;
  const rail = [];
  for (let i = 0; i < nodes; i++) {
    const s = (i + 0.5) * step;            // phase nodes off the corners
    const c = pt(s);
    const n = nrm(s);
    const a = ampFn(s);
    const sgn = i % 2 === 0 ? 1 : -1;
    rail.push({
      out: [c[0] + n[0] * a * sgn, c[1] + n[1] * a * sgn],
      in: [c[0] - n[0] * a * sgn, c[1] - n[1] * a * sgn],
      a,
    });
  }
  const segs = [];
  const dots = [];
  const last = closed ? nodes : nodes - 1;
  for (let i = 0; i < last; i++) {
    const A = rail[i], B = rail[(i + 1) % nodes];
    segs.push([A.out[0], A.out[1], B.out[0], B.out[1]]);
    segs.push([A.in[0], A.in[1], B.in[0], B.in[1]]);
  }
  rail.forEach((r) => {
    if (r.a >= dotMin) { dots.push(r.out); dots.push(r.in); }
  });
  if (!closed) {                            // cap the open ends across the rails
    segs.push([rail[0].out[0], rail[0].out[1], rail[0].in[0], rail[0].in[1]]);
    const e = nodes - 1;
    segs.push([rail[e].out[0], rail[e].out[1], rail[e].in[0], rail[e].in[1]]);
  }
  return { segs, dots };
}

/* Sharp-cornered rectangle centerline with inward normals + corner offsets. */
function rectPath(x0, y0, x1, y1) {
  const c = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const edges = [];
  for (let i = 0; i < 4; i++) {
    const a = c[i], b = c[(i + 1) % 4];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const dx = (b[0] - a[0]) / len, dy = (b[1] - a[1]) / len;
    let nx = -dy, ny = dx;
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    if ((cx - mx) * nx + (cy - my) * ny < 0) { nx = -nx; ny = -ny; }
    edges.push({ a, b, len, dx, dy, nx, ny });
  }
  const total = edges.reduce((s, e) => s + e.len, 0);
  const corners = [];
  let acc = 0;
  edges.forEach((e) => { corners.push(acc); acc += e.len; });
  const find = (s) => {
    s = ((s % total) + total) % total;
    let a = 0;
    for (const e of edges) { if (s <= a + e.len) return [e, s - a]; a += e.len; }
    return [edges[3], edges[3].len];
  };
  const pt = (s) => { const [e, u] = find(s); return [e.a[0] + e.dx * u, e.a[1] + e.dy * u]; };
  const nrm = (s) => { const [e] = find(s); return [e.nx, e.ny]; };
  return { pt, nrm, total, corners };
}

/* ---- Frame border: a continuous engraved plait that knots at the four
   corners and collapses to a single engraved rule mid-edge — the angular
   twin of frameBraid(). Same (w,h)->fragment signature. */
export function plaitFrame(w, h, { cord = PLAIT_HEX.gold, bg = PLAIT_HEX.bg } = {}) {
  const inset = 26, cell = 19, ampMax = 11, ampMid = 0;
  const m = inset + ampMax;
  if (w < 2 * m + 80 || h < 2 * m + 80) return '';
  const { pt, nrm, total, corners } = rectPath(m, m, w - m, h - m);
  const bloom = cell * 2.0;
  const ampFn = (s) => {
    let g = 0;
    for (const c of corners) {
      let d = Math.abs(s - c);
      d = Math.min(d, total - d);
      if (d < bloom) g = Math.max(g, 0.5 * (1 + Math.cos((Math.PI * d) / bloom)));
    }
    return ampMid + (ampMax - ampMid) * g;
  };
  const { segs, dots } = plaitStrands({ pt, nrm, total, closed: true, cell, ampFn, dotMin: 2 });
  return engrave(segs, dots, { cell, gold: cord, bg });
}

/* ---- Seal: a small closed square plait — the angular trinity-knot crest. */
export function plaitSeal({ size = 66, gold = PLAIT_HEX.gold, bg = PLAIT_HEX.bg } = {}) {
  const cell = 9.5, amp = 6.5, m = amp + 8;
  const { pt, nrm, total } = rectPath(m, m, size - m, size - m);
  const { segs, dots } = plaitStrands({ pt, nrm, total, closed: true, cell, ampFn: () => amp });
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" aria-hidden="true" style="display:block">${engrave(segs, dots, { cell, gold, bg })}</svg>`;
}

/* ---- Straight band: the divider's woven centre + any inline plait run. */
export function plaitBand({ length = 96, cy = 18, gold = PLAIT_HEX.gold, bg = PLAIT_HEX.bg } = {}) {
  const cell = 16, amp = 8;
  const pt = (s) => [amp + s, cy];
  const nrm = () => [0, -1];
  const total = length;
  const { segs, dots } = plaitStrands({ pt, nrm, total, closed: false, cell, ampFn: () => amp });
  const w = length + amp * 2, h = cy + amp + 4;
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" aria-hidden="true" style="display:block">${engrave(segs, dots, { cell, gold, bg })}</svg>`;
}

/* ---- Divider: green→bronze rails with a centred engraved plait knot. */
export function plaitDivider({ width = 300, gold = PLAIT_HEX.gold, bg = PLAIT_HEX.bg } = {}) {
  const h = 40, cy = h / 2, knotW = 84;
  const railEnd = (width - knotW) / 2 - 10;
  const seal = plaitSeal({ size: 52, gold, bg });
  // strip the seal's <svg> wrapper so we can place it inline
  const inner = seal.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return (
    `<svg width="${width}" height="${h}" viewBox="0 0 ${width} ${h}" fill="none" aria-hidden="true" style="display:block">` +
    `<line x1="14" y1="${cy}" x2="${railEnd}" y2="${cy}" stroke="${PLAIT_HEX.green}" stroke-width="1.2"/>` +
    `<line x1="${width - railEnd}" y1="${cy}" x2="${width - 14}" y2="${cy}" stroke="${PLAIT_HEX.bronze}" stroke-width="1.2"/>` +
    `<g transform="translate(${(width - 52) / 2}, ${(h - 52) / 2})">${inner}</g>` +
    `</svg>`
  );
}
