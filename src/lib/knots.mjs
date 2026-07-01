/* ============================================================
   Gilt & Grove — Celtic knot engine
   One canonical generator so all knotwork on the site is consistent.

   Principles (from the standard grid/braid literature — Bain method,
   dmackinnon/celtic parity weave, bezborodow casing ratios):
   - A two-strand braid is two phase-opposed sinusoids about a centerline:
       A(s) = C(s) + a(s)·sin(2π s/λ)·N(s)
       B(s) = C(s) − a(s)·sin(2π s/λ)·N(s)
     Strands cross every half-period (λ/2).
   - λ MUST divide the path length (λ = L/k, integer k) or crossings drift
     and the braid looks awkward — the #1 cause of inconsistent knots.
   - Over/under is driven by crossing-index PARITY, never hand-tracked.
   - Interlace is rendered with a casing recipe: a thick background-colored
     stroke under each cord, then the cord; the "over" strand's segment is
     redrawn on top at alternate crossings so it severs the one beneath.
   - Casing ≈ 1.6× cord; round caps + dense sampling keep curves smooth.
   ============================================================ */

const RAD = Math.PI / 180;
const f = (n) => n.toFixed(2);

// Generic two-strand braid renderer along a centerline described by
// pt(s) -> [x,y] and a perimeter length `total`. ampFn(s) -> amplitude.
// Returns an SVG fragment string (paths only).
function renderBraid({
  pt,
  total,
  closed = false,
  period,
  ampFn,
  ampMax,
  cord = 'var(--metal)',
  bg = 'var(--bg)',
  cordW = 5,
  casingW = 8,
  density = 1.6,
}) {
  const n = Math.max(600, Math.round(total * density));
  const eps = Math.max(0.4, total / n);
  const normal = (s) => {
    const [ax, ay] = pt(s - eps);
    const [bx, by] = pt(s + eps);
    let tx = bx - ax;
    let ty = by - ay;
    const m = Math.hypot(tx, ty) || 1;
    return [-ty / m, tx / m];
  };
  const strand = (sign) => {
    const p = [];
    for (let i = 0; i <= n; i++) {
      const s = (total * i) / n;
      const P = pt(s);
      const N = normal(s);
      const o = sign * ampFn(s) * Math.sin((2 * Math.PI * s) / period);
      p.push([P[0] + N[0] * o, P[1] + N[1] * o]);
    }
    return p;
  };
  const A = strand(1);
  const B = strand(-1);
  const toPath = (p) => 'M' + p.map((q) => f(q[0]) + ',' + f(q[1])).join(' L');
  const sub = (p, s, ds) => {
    const i0 = Math.max(0, Math.round(((s - ds) / total) * n));
    const i1 = Math.min(n, Math.round(((s + ds) / total) * n));
    return 'M' + p.slice(i0, i1 + 1).map((q) => f(q[0]) + ',' + f(q[1])).join(' L');
  };
  // NOTE: CSS custom properties (var()) resolve in `style`, NOT in SVG
  // presentation attributes — so stroke colors go through style.
  const ribbon = (d, cap) =>
    `<path d="${d}" fill="none" stroke-width="${cordW + casingW}" stroke-linecap="${cap}" stroke-linejoin="round" style="stroke:${bg}"/>` +
    `<path d="${d}" fill="none" stroke-width="${cordW}" stroke-linecap="${cap}" stroke-linejoin="round" style="stroke:${cord}"/>`;
  // Base ribbons: B ends up on top everywhere initially.
  let out = ribbon(toPath(A), closed ? 'round' : 'round') + ribbon(toPath(B), 'round');
  // Overlay A across alternate crossings so the weave alternates by parity.
  for (let k = 0; ; k++) {
    const s = (k * period) / 2;
    if (s > total) break;
    if (ampFn(s) > ampMax * 0.18 && k % 2 === 0) out += ribbon(sub(A, s, period * 0.26), 'butt');
  }
  return out;
}

/* ---- Closed rounded-rectangle braid (the Frame border) ----------------
   Amplitude peaks at the four corners (strands weave a knot) and tapers to
   zero mid-edge (collapse to a single line). λ = perimeter / k. */
export function frameBraid(w, h, { cord = 'var(--metal)', bg = 'var(--bg)' } = {}) {
  const I = 30, rr = 26, ampMax = 8.5, halfW = rr + 34, cordW = 4.5, casingW = 7;
  const x0 = I, x1 = w - I, y0 = I, y1 = h - I;
  if (x1 <= x0 + 2 * rr + 10 || y1 <= y0 + 2 * rr + 10) return '';
  const segs = [
    { t: 'L', a: [x0 + rr, y0], b: [x1 - rr, y0] },
    { t: 'A', c: [x1 - rr, y0 + rr], a0: -90, a1: 0 },
    { t: 'L', a: [x1, y0 + rr], b: [x1, y1 - rr] },
    { t: 'A', c: [x1 - rr, y1 - rr], a0: 0, a1: 90 },
    { t: 'L', a: [x1 - rr, y1], b: [x0 + rr, y1] },
    { t: 'A', c: [x0 + rr, y1 - rr], a0: 90, a1: 180 },
    { t: 'L', a: [x0, y1 - rr], b: [x0, y0 + rr] },
    { t: 'A', c: [x0 + rr, y0 + rr], a0: 180, a1: 270 },
  ];
  segs.forEach((s) => {
    s.len = s.t === 'L' ? Math.hypot(s.b[0] - s.a[0], s.b[1] - s.a[1]) : Math.abs(s.a1 - s.a0) * RAD * rr;
  });
  const total = segs.reduce((a, s) => a + s.len, 0);
  let acc = 0;
  const corners = [];
  segs.forEach((s) => { if (s.t === 'A') corners.push(acc + s.len / 2); acc += s.len; });
  const pt = (s) => {
    s = ((s % total) + total) % total;
    let a = 0;
    for (const sg of segs) {
      if (s <= a + sg.len) {
        const u = (s - a) / sg.len;
        if (sg.t === 'L') return [sg.a[0] + (sg.b[0] - sg.a[0]) * u, sg.a[1] + (sg.b[1] - sg.a[1]) * u];
        const ang = sg.a0 + (sg.a1 - sg.a0) * u;
        return [sg.c[0] + rr * Math.cos(ang * RAD), sg.c[1] + rr * Math.sin(ang * RAD)];
      }
      a += sg.len;
    }
    return segs[segs.length - 1].b;
  };
  const ampFn = (s) => {
    let m = 0;
    for (const c of corners) {
      let d = Math.abs(s - c);
      d = Math.min(d, total - d);
      if (d < halfW) {
        const ww = 0.5 * (1 + Math.cos((Math.PI * d) / halfW));
        if (ww > m) m = ww;
      }
    }
    return ampMax * m;
  };
  // period chosen so an integer number of half-waves spans the perimeter
  const k = Math.max(8, Math.round(total / 28));
  const period = total / k;
  return renderBraid({ pt, total, closed: true, period, ampFn, ampMax, cord, bg, cordW, casingW });
}

/* ---- Open arch braid + rays (the rising-sun halo) ---------------------
   Centerline is a circular arc (a rainbow). Amplitude follows sin²(π s/L)
   so the two strands spring from a single point at each foot, weave over
   the crown, and re-merge — symmetric and clean. λ = arcLength / k. */
export function archBraid(
  W = 820,
  H = 360,
  { cordGradId = 'ggArchCord', bg = 'var(--bg)' } = {}
) {
  const cx = W / 2;
  const cy = H * 0.92;
  const R = Math.min(W * 0.40, H * 0.74);
  const a0 = 200, a1 = 340; // degrees, screen space (y down); top of arc at 270°
  const pt = (s) => {
    const ang = (a0 + ((a1 - a0) * s) / total) * RAD;
    return [cx + R * Math.cos(ang), cy + R * Math.sin(ang)];
  };
  const total = ((a1 - a0) * RAD) * R;
  const ampMax = 9.5;
  const ampFn = (s) => {
    const e = Math.sin((Math.PI * s) / total); // 0 at feet, 1 at crown
    return ampMax * e * e;
  };
  const k = Math.max(8, Math.round(total / 64)); // ~ one full wave per 64px
  const period = total / k;
  const cord = `url(#${cordGradId})`;
  const braid = renderBraid({ pt, total, closed: false, period, ampFn, ampMax, cord, bg, cordW: 4.5, casingW: 7 });

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

  return { svg: defs + `<g>${rays.join('')}</g>` + braid, viewBox: `0 0 ${W} ${H}`, width: W, height: H };
}

/* ---- Woven divider — the rope twin of divider.svg ----------------------
   Two round-capped rope rails (sage ⟷ bronze) tapering in from the edges,
   tied at centre by the woven triquetra. Round caps + the duo sheen keep it
   firmly in the rope family. */
export function wovenDivider({ width = 300, gold = 'var(--metal)', bg = 'var(--bg)' } = {}) {
  const h = 44, cy = h / 2, size = 34, knotW = size + 14;
  const railEnd = (width - knotW) / 2 - 4;
  const seal = triquetra({ size, stroke: gold, gap: bg });
  const inner = seal.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  return (
    `<svg width="${width}" height="${h}" viewBox="0 0 ${width} ${h}" fill="none" overflow="visible" aria-hidden="true" style="display:block">` +
    // CSS vars resolve in `style`, not in stop-color/stroke attributes — so the
    // rails are styled. Round caps are the rope tell against the plaited rails.
    `<line x1="14" y1="${cy}" x2="${railEnd}" y2="${cy}" stroke-width="1.6" stroke-linecap="round" style="stroke:var(--green-300)"/>` +
    `<line x1="${width - railEnd}" y1="${cy}" x2="${width - 14}" y2="${cy}" stroke-width="1.6" stroke-linecap="round" style="stroke:var(--gold-300)"/>` +
    // triquetra() draws in a 0..100 space scaled by its own <svg>; we stripped
    // that wrapper, so re-apply the 100→size scale about the knot's centre.
    `<g transform="translate(${width / 2} ${cy}) scale(${size / 100}) translate(-50 -50)">${inner}</g>` +
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
