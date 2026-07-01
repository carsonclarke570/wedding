/* ============================================================
   Gilt & Grove — Celtic knotwork engine  (grid-graph, real interlace)

   The single canonical generator for ALL knotwork on the site. A faithful
   port of the Ben Liu / Harvard "coloring celtic knot" construction (the
   grid-graph method described by Mercat / Bain), generalized to an arbitrary
   TILE MASK so one engine draws a square seal, a hollow frame ring, and a
   running-plait band from the same topology.

   Why this replaces the old sine-wave "braid" and zig-zag "plait":
   a real Celtic knot is NOT two offset waves — it is a set of closed strands
   that travel diagonally across a grid, reflect off walls, and weave OVER /
   UNDER by a parity checkerboard. That interlace is what reads as a "knot".

   Topology (shared by both hands):
   - Tiles W×H; each tile is 2×2 CELLS; each cell carries ONE cord arc.
   - DIAMONDS sit on tile edges (even = horizontal edges, odd = vertical). A
     diamond is a WALL at a masked-region boundary (or a user break); interior
     diamonds are CROSSINGS. Strands reflect off walls.
   - buildKnot() walks closed loops (continuous strands) and tags each crossing
     with which strand passes OVER (even diamond → "\" over, odd → "/" over).

   Two hands (render differs only per cell):
   - 'smooth'    : per-cell cubic Bézier (rope ribbon)   — the WOVEN set
   - 'geometric' : per-cell straight segments, mitered    — the PLAITED set

   Colors are emitted through `style="stroke:…"` (not the stroke attribute) so
   CSS custom properties like var(--metal) resolve when rendered in a page.
   ============================================================ */

// 8 compass directions, 0 = N, clockwise. Odd = diagonal, even = axial.
const dirToX = (d) => (1 <= d && d <= 3 ? 1 : 0) - (5 <= d && d <= 7 ? 1 : 0);
const dirToY = (d) => dirToX((d + 6) % 8);
const f = (n) => Math.round(n * 100) / 100;

/* ---- Build the topology from a tile grid + mask + breaks ------------- */
export function buildKnot(W, H, opts = {}) {
  const { inMask = () => true, breaks = [], tQ = 12, pad = tQ } = opts;
  const tH = 2 * tQ, tW = 4 * tQ;
  const has = (tx, ty) => tx >= 0 && ty >= 0 && tx < W && ty < H && inMask(tx, ty);

  const even = Array.from({ length: H + 1 }, () => new Array(W).fill(0));   // exists
  const odd = Array.from({ length: H }, () => new Array(W + 1).fill(0));
  const evenState = Array.from({ length: H + 1 }, () => new Array(W).fill(0));
  const oddState = Array.from({ length: H }, () => new Array(W + 1).fill(0));

  for (let y = 0; y <= H; y++)
    for (let x = 0; x < W; x++) {
      const a = has(x, y - 1), b = has(x, y);
      even[y][x] = a || b ? 1 : 0;
      if (a !== b) evenState[y][x] = 1;
    }
  for (let y = 0; y < H; y++)
    for (let x = 0; x <= W; x++) {
      const a = has(x - 1, y), b = has(x, y);
      odd[y][x] = a || b ? 1 : 0;
      if (a !== b) oddState[y][x] = 2;
    }
  for (const br of breaks) {
    if (br.kind === 'even' && even[br.y]?.[br.x]) evenState[br.y][br.x] = br.state;
    if (br.kind === 'odd' && odd[br.y]?.[br.x]) oddState[br.y][br.x] = br.state;
  }
  const stEven = (y, x) => (even[y]?.[x] ? evenState[y][x] : 0);
  const stOdd = (y, x) => (odd[y]?.[x] ? oddState[y][x] : 0);
  const cellIn = (cx, cy) => has(Math.floor(cx / 2), Math.floor(cy / 2));

  function cellInfo(x, y) {
    const parity = (x + y) % 2;
    const quadrant = 2 * (y % 2) + (x % 2);
    let dTop, dRight, dLeft, dBottom;
    if (y % 2 === 0) {
      if (x % 2 === 0) { dTop = ['e', y / 2, x / 2]; dLeft = ['o', y / 2, x / 2]; }
      else { dTop = ['e', y / 2, (x - 1) / 2]; dRight = ['o', y / 2, (x + 1) / 2]; }
    } else {
      if (x % 2 === 0) { dTop = ['o', (y - 1) / 2, x / 2]; dRight = ['e', (y + 1) / 2, x / 2]; }
      else { dTop = ['o', (y - 1) / 2, (x + 1) / 2]; dLeft = ['e', (y + 1) / 2, (x - 1) / 2]; }
    }
    if (parity === 0) { dRight = dTop; dBottom = dLeft; }
    else { dBottom = dRight; dLeft = dTop; }
    const st = (d) => (d ? (d[0] === 'e' ? stEven(d[1], d[2]) : stOdd(d[1], d[2])) : 0);
    return { parity, quadrant, sTop: st(dTop), sBottom: st(dBottom) };
  }
  const dir1 = (x, y) => {
    const c = cellInfo(x, y);
    if (c.parity === 0) return c.sBottom === 1 ? 6 : c.sBottom === 2 ? 4 : 5;
    return c.sTop === 1 ? 6 : c.sTop === 2 ? 0 : 7;
  };
  const dir2 = (x, y) => {
    const c = cellInfo(x, y);
    if (c.parity === 0) return c.sTop === 1 ? 2 : c.sTop === 2 ? 0 : 1;
    return c.sBottom === 1 ? 2 : c.sBottom === 2 ? 4 : 3;
  };
  const key = (x, y) => y * 2 * W + x;
  const neigh1 = (x, y) => {
    switch (dir1(x, y)) {
      case 4: return [x, y + 1]; case 5: return [x - 1, y + 1];
      case 6: return [x - 1, y]; case 7: return [x - 1, y - 1]; case 0: return [x, y - 1];
    }
  };
  const neigh2 = (x, y) => {
    switch (dir2(x, y)) {
      case 0: return [x, y - 1]; case 1: return [x + 1, y - 1]; case 2: return [x + 1, y];
      case 3: return [x + 1, y + 1]; case 4: return [x, y + 1];
    }
  };

  const touched = new Set();
  const inCells = [];
  for (let y = 0; y < 2 * H; y++)
    for (let x = 0; x < 2 * W; x++) {
      if (cellIn(x, y)) inCells.push([x, y]);
      else touched.add(key(x, y));
    }

  const links = [];
  for (const [sx, sy] of inCells) {
    if (touched.has(key(sx, sy))) continue;
    const cellSeq = [], inDir = [], outDir = [];
    let prev = null, curr = [sx, sy], guard = 0;
    while (guard++ < 200000) {
      cellSeq.push(curr); touched.add(key(curr[0], curr[1]));
      const [cx, cy] = curr;
      const n2 = neigh2(cx, cy);
      if (prev && n2 && n2[0] === prev[0] && n2[1] === prev[1]) {
        outDir.push(dir1(cx, cy)); inDir.push(dir2(cx, cy));
        prev = curr; curr = neigh1(cx, cy);
      } else {
        outDir.push(dir2(cx, cy)); inDir.push(dir1(cx, cy));
        prev = curr; curr = neigh2(cx, cy);
      }
      if (!curr) break;
      if (curr[0] === cellSeq[0][0] && curr[1] === cellSeq[0][1]) break;
    }
    if (cellSeq.length >= 2) links.push({ cellSeq, inDir, outDir });
  }

  // crossings
  const diamondXY = (g, y, x) =>
    g === 'e' ? [pad + x * tW + tH, pad + y * tW] : [pad + x * tW, pad + y * tW + tH];
  const cellsToDiamond = (cx, cy, quadrant, dir) => {
    let xx, yy;
    if (quadrant === 0) { xx = cx / 2; yy = cy / 2; return dir <= 2 ? ['e', yy, xx] : ['o', yy, xx]; }
    if (quadrant === 1) { xx = (cx - 1) / 2; yy = cy / 2; return (dir === 6 || dir === 7 || dir === 0) ? ['e', yy, xx] : ['o', yy, xx + 1]; }
    if (quadrant === 2) { xx = cx / 2; yy = (cy - 1) / 2; return (dir === 6 || dir === 7 || dir === 0) ? ['o', yy, xx] : ['e', yy + 1, xx]; }
    xx = (cx - 1) / 2; yy = (cy - 1) / 2; return dir <= 2 ? ['o', yy, xx + 1] : ['e', yy + 1, xx];
  };
  const crossings = new Map();
  links.forEach((lnk, li) => {
    for (let i = 0; i < lnk.cellSeq.length; i++) {
      const [cx, cy] = lnk.cellSeq[i];
      const quadrant = 2 * (cy % 2) + (cx % 2);
      const od = lnk.outDir[i];
      const d = cellsToDiamond(cx, cy, quadrant, od);
      if (!d) continue;
      const state = d[0] === 'e' ? stEven(d[1], d[2]) : stOdd(d[1], d[2]);
      if (state !== 0) continue;
      const kk = `${d[0]}:${d[1]}:${d[2]}`;
      let rec = crossings.get(kk);
      if (!rec) { const [dx, dy] = diamondXY(d[0], d[1], d[2]); rec = { dx, dy, parity: d[0] === 'e' ? 0 : 1 }; crossings.set(kk, rec); }
      if (od === 3 || od === 7) { rec.link1 = li; rec.i1 = i; }
      else if (od === 1 || od === 5) { rec.link2 = li; rec.i2 = i; }
    }
  });

  return {
    W, H, tQ, tH, tW, pad, links, crossings: [...crossings.values()],
    width: pad * 2 + W * tW, height: pad * 2 + H * tW,
  };
}

/* ---- Per-cell path piece. Returns anchor + control POINTS so an optional
   warp(x,y)->[x,y] can bend the whole knot (e.g. a band into an arch). ---- */
function cellPiece(model, cell, inDir, outDir, hand, cs) {
  const { tQ, tH, pad } = model;
  const [cx, cy] = cell;
  const CX = pad + cx * tH + tQ, CY = pad + cy * tH + tQ;
  const P0 = [CX + tQ * dirToX(inDir), CY + tQ * dirToY(inDir)];
  const P3 = [CX + tQ * dirToX(outDir), CY + tQ * dirToY(outDir)];
  const straight = (inDir - outDir) % 4 === 0;
  const axisCorner =
    ((inDir === 0 || inDir === 4) && (outDir === 2 || outDir === 6)) ||
    ((inDir === 2 || inDir === 6) && (outDir === 0 || outDir === 4));
  if (straight) return { start: P0, t: 'L', pts: [P3] };
  if (axisCorner) {
    const c = (inDir === 0 || inDir === 4) ? [P0[0], P3[1]] : [P3[0], P0[1]];
    return { start: P0, t: 'L', pts: [c, P3] };
  }
  if (hand === 'geometric') return { start: P0, t: 'L', pts: [[CX, CY], P3] };
  const c1 = [CX + tQ * cs * Math.sin(inDir * Math.PI / 4), CY - tQ * cs * Math.cos(inDir * Math.PI / 4)];
  const c2 = [CX + tQ * cs * Math.sin(outDir * Math.PI / 4), CY - tQ * cs * Math.cos(outDir * Math.PI / 4)];
  return { start: P0, t: 'C', pts: [c1, c2, P3] };
}

const emit = (p, warp) => {
  const W = warp || ((x, y) => [x, y]);
  const g = (pt) => { const q = W(pt[0], pt[1]); return `${f(q[0])} ${f(q[1])}`; };
  if (p.t === 'L') return p.pts.map((pt) => `L${g(pt)}`).join(' ');
  return `C${g(p.pts[0])} ${g(p.pts[1])} ${g(p.pts[2])}`;
};

function linkPath(model, lnk, hand, cs, warp) {
  const seq = lnk.cellSeq;
  let d = '';
  for (let i = 0; i < seq.length; i++) {
    const p = cellPiece(model, seq[i], lnk.inDir[i], lnk.outDir[i], hand, cs);
    if (i === 0) { const s = (warp || ((x, y) => [x, y]))(p.start[0], p.start[1]); d += `M${f(s[0])} ${f(s[1])} `; }
    d += emit(p, warp) + ' ';
  }
  return d.trim() + ' Z';
}
function localPath(model, lnk, i, hand, cs, warp) {
  const seq = lnk.cellSeq;
  let d = '';
  for (let k = i; k < i + 2; k++) {
    const idx = k % seq.length;
    const p = cellPiece(model, seq[idx], lnk.inDir[idx], lnk.outDir[idx], hand, cs);
    if (k === i) { const s = (warp || ((x, y) => [x, y]))(p.start[0], p.start[1]); d += `M${f(s[0])} ${f(s[1])} `; }
    d += emit(p, warp) + ' ';
  }
  return d.trim();
}

/* ---- Render to SVG inner markup ------------------------------------- */
let UID = 0;
export function renderKnot(model, opts = {}) {
  const hand = opts.hand || 'smooth';
  const cord = opts.cord || 'var(--metal)';
  const bg = opts.bg || 'var(--bg)';
  const strandProp = opts.strandProp ?? (hand === 'geometric' ? 0.5 : 0.58);
  const gapProp = opts.gapProp ?? 0.62;
  const cs = opts.curveStrength ?? 0.33;
  const channel = opts.channel ?? (hand === 'geometric');
  const cap = opts.cap ?? (hand === 'geometric' ? 'butt' : 'round');
  const warp = opts.warp || null;
  const { tH, tQ } = model;
  const strandW = strandProp * tH;
  // Salted id: clipPath ids are global in the DOM, and server-rendered seals
  // share a document with client-painted frames — collisions would clip a
  // crossing to the wrong rhombus. The random suffix keeps every knot unique.
  const uid = 'gk' + (UID++).toString(36) + Math.floor(Math.random() * 1e9).toString(36);
  const Wp = warp || ((x, y) => [x, y]);

  const S = (color) => `style="stroke:${color}"`;
  let base = '';
  for (const lnk of model.links) {
    const d = linkPath(model, lnk, hand, cs, warp);
    base += `<path d="${d}" fill="none" ${S(cord)} stroke-width="${f(strandW)}" stroke-linecap="${cap}" stroke-linejoin="round"/>`;
  }

  let clips = '', cross = '';
  model.crossings.forEach((c, idx) => {
    if (c.link1 == null || c.link2 == null) return;
    const overLink = c.parity === 0 ? c.link1 : c.link2;
    const overI = c.parity === 0 ? c.i1 : c.i2;
    const d = localPath(model, model.links[overLink], overI, hand, cs, warp);
    const cid = `${uid}_${idx}`;
    const r = tH;
    const rh = [[c.dx - r, c.dy], [c.dx, c.dy - r], [c.dx + r, c.dy], [c.dx, c.dy + r]]
      .map((p) => Wp(p[0], p[1])).map((q) => `${f(q[0])} ${f(q[1])}`);
    clips += `<clipPath id="${cid}"><path d="M${rh[0]} L${rh[1]} L${rh[2]} L${rh[3]} Z"/></clipPath>`;
    cross += `<g clip-path="url(#${cid})">` +
      `<path d="${d}" fill="none" ${S(bg)} stroke-width="${f(strandW + gapProp * tQ)}" stroke-linecap="round"/>` +
      `<path d="${d}" fill="none" ${S(cord)} stroke-width="${f(strandW)}" stroke-linecap="${cap}" stroke-linejoin="round"/>` +
      `</g>`;
  });

  let engrave = '';
  if (channel) {
    for (const lnk of model.links) {
      const d = linkPath(model, lnk, hand, cs, warp);
      engrave += `<path d="${d}" fill="none" ${S(bg)} stroke-width="${f(strandW * 0.16)}" stroke-linecap="round"/>`;
    }
  }
  return `<defs>${clips}</defs>${base}${cross}${engrave}`;
}

/* ============================================================
   High-level shape builders (used by components)
   ============================================================ */

// choose a tile count that best fits a pixel span at a target tile size
const fitTiles = (px, tile, min) => Math.max(min, Math.round(px / tile));

/* A hollow knot FRAME that fits exactly into a w×h box (border ring).
   Returns an SVG <g> fragment scaled to the box's own 0..w / 0..h space. */
export function knotFrame(w, h, opts = {}) {
  const { hand = 'smooth', cord, bg, tile = 46, thickness = 1 } = opts;
  const W = fitTiles(w, tile, 3), H = fitTiles(h, tile, 3);
  const tQ = tile / 4;
  const t = thickness;
  const mask = (tx, ty) => tx < t || ty < t || tx >= W - t || ty >= H - t;
  const model = buildKnot(W, H, { tQ, inMask: mask });
  const inner = renderKnot(model, { hand, cord, bg, ...opts });
  const sx = w / model.width, sy = h / model.height;
  return `<g transform="scale(${f(sx)} ${f(sy)})">${inner}</g>`;
}

/* A small square knot SEAL / crest. Returns a full <svg>. */
export function knotSeal(opts = {}) {
  const { size = 64, hand = 'smooth', cord, bg, tiles = 2 } = opts;
  const tQ = (size - 4) / (tiles * 4);
  const model = buildKnot(tiles, tiles, { tQ, pad: tQ + 1 });
  const inner = renderKnot(model, { hand, cord, bg, ...opts });
  const s = size / model.width;
  return `<svg width="${f(size)}" height="${f(size)}" viewBox="0 0 ${size} ${size}" fill="none" aria-hidden="true" style="display:block" overflow="visible">` +
    `<g transform="scale(${f(s)})">${inner}</g></svg>`;
}

/* A running-plait knot BAND (horizontal). Returns inner markup + dims. */
export function knotBand(opts = {}) {
  const { length = 120, hand = 'smooth', cord, bg, tile = 30, rows = 2 } = opts;
  const W = fitTiles(length, tile, 2);
  const tQ = tile / 4;
  const model = buildKnot(W, rows, { tQ });
  const inner = renderKnot(model, { hand, cord, bg, ...opts });
  return { inner, width: model.width, height: model.height };
}

/* A knot BAND bent into an ARCH — the hero's rising-sun halo. Builds a
   straight running plait, then warps it onto a circular arc (center below,
   crown at the top) so the crown is genuine over/under knotwork. */
export function knotArch(Wpx = 820, Hpx = 360, opts = {}) {
  const {
    hand = 'smooth', cord = 'var(--metal)', bg = 'var(--bg)',
    a0 = 200, a1 = 340, rows = 2, tile = 46,
  } = opts;
  const cx = Wpx / 2, cy = Hpx * 0.9;
  const R = Math.min(Wpx * 0.4, Hpx * 0.78);
  const arcLen = R * (a1 - a0) * Math.PI / 180;
  const W = fitTiles(arcLen, tile, 6);
  const tQ = tile / 4;
  const model = buildKnot(W, rows, { tQ });
  const midY = model.height / 2;
  const warp = (x, y) => {
    const u = x / model.width;
    const ang = (a0 + u * (a1 - a0)) * Math.PI / 180;
    const rad = R + (y - midY);
    return [cx + rad * Math.cos(ang), cy + rad * Math.sin(ang)];
  };
  const inner = renderKnot(model, { hand, cord, bg, warp, cap: 'round', ...opts, warp });
  return { inner, cx, cy, R, width: Wpx, height: Hpx };
}
