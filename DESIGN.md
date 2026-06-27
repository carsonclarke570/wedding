# Design

**Gilt & Grove** — the visual system for Warren & Carson's wedding website. This document captures the imported design system. The source of truth for tokens is `design-system/` (link `design-system/styles.css` to get everything); this file is the human-readable map. Full brand narrative, voice, and iconography rules live in `design-system/readme.md`.

## Theme

Dark, candle-lit, regal — Art Deco geometry fused with Celtic knotwork. Pages sit on a near-black ground with a faint green undertone (never pure tech-black), text is warm parchment. The two grooms are carried as **twin color leads in equal measure** — deep pine green (Warren) and deep garnet/oxblood (Carson) — with **antique gold demoted to a fine metallic tie** (the "&", divider centers, corner knots, small glints), never a dominant fill.

Color strategy: **committed** — the dark ground plus the green/garnet duo carry the surface; gold is a sparing accent. The mood is a candle-lit ballroom, not a stiff one.

## Color

OKLCH-friendly antique jewel tones. Full ramps in `design-system/tokens/colors.css`. Key roles:

**Grounds (ink — near-black, green undertone)**
- `--ink-900 #0C0E0C` deepest ground · `--ink-800 #12150F` **page background** · `--ink-700 #1A1E18` raised surface · `--ink-600 #242922` card/panel · `--ink-500 #30362E` hover fill

**Text (parchment / graphite)**
- `--parchment-100 #F4EFE3` primary body text on dark · `--text-muted #AEB4A8` (graphite-200, AA on ink-800) · `--text-soft #BDB199`

**Green — Warren (lead)**
- `--green-300 #7E9079` lightest accent text · `--green-400 #56684F` accent/solid · `--green-500 #3E4F3A` core · `--green-600 #2C3A2A` · `--green-700 #1E281C`

**Garnet/oxblood — Carson (co-lead, equal billing)**
- `--rose-300 #B0817A` lightest accent text · `--rose-400 #93534A` accent/solid · `--rose-500 #743D35` core · `--rose-600 #57291F` · `--rose-700 #3B1B16`

**Gold — the metallic tie (accent only)**
- `--gold-300 #E9D6A0` · `--gold-400 #D8BC6B` · `--gold-500 #C2A042` core · `--gold-600 #A4842C` · `--gold-700 #7E631F`

**Signature gradients**
- `--duo-sheen` green⟷gold⟷garnet — the couple's signature, for the names and the primary CTA
- `--duo-line` green→gold→garnet — for important frame/rule borders
- `--gilt-sheen` metallic gold — small gold elements only

**Avoid:** bright/emerald green, pink rose, bluish-purple gradients, neon, pure white, pastels, large flat gold fills.

**Contrast:** body parchment and the `-300` accent ramps are tuned for **WCAG AA** on dark grounds. Re-check any new pairing — especially tracked eyebrows and placeholders — against its real background.

## Typography

Four real faces, loaded via Google Fonts in `design-system/tokens/fonts.css`. High contrast between Deco caps and a warm humanist serif. **No script/cursive.**

- **Display / titling — Cinzel** (`--font-display`), inscriptional Roman caps. Headings and names in caps.
- **Body — Cormorant Garamond** (`--font-serif`), warm high-contrast serif; italic carries emphasis.
- **Eyebrows / labels — Poiret One** (`--font-deco`), geometric Deco sans, uppercase + wide tracking.
- **Rare flourish — Cinzel Decorative** (`--font-ornament`), e.g. the gold "&".

**Scale** (fluid, `--fs-*`): display `clamp(40→72px)` · h1 `clamp(34→52px)` · h2 `clamp(28→38px)` · h3 `clamp(22→27px)` · body `18px` (floor) · small `15px` · eyebrow `13px`.
**Tracking:** display `0.04em` · eyebrow `0.34em` · label `0.18em`. **Line height:** tight `1.04` (display) · body `1.55`. Headings use `text-wrap: balance`, prose uses `text-wrap: pretty`.

## Spacing & Layout

8px base rhythm (`--space-1 4px` … `--space-10 128px`), with `--section-y` = 96px vertical rhythm.

- Containers: `--container-sm 560` · `--container-md 820` · `--container-lg 1120` · `--container-xl 1320`. Content maxes ~1040px; hero/RSVP narrower (~620–760px).
- Centered, symmetrical compositions (Deco loves symmetry). Sticky translucent nav (`rgba(12,14,12,0.82)` + `blur(10px)`).

## Shape, Borders & Elevation

Architectural, near-sharp corners — `--radius-md` 3px default, most structure 0–2px; true pills (`--radius-pill`) only for chips. Softness comes from glow and motion, not rounding.

- **Borders:** `--line` neutral parchment hairline (signature quiet structure) · `--line-strong` · `--line-soft` · `--line-green` / `--line-rose` single-groom rules · important frames use the `--duo-line` gradient border.
- **Shadows:** deep, soft, near-black — `--shadow-sm/md/lg`. Emphasis/focus uses the warm **gilt glow** `--glow-gold` (gold ring + amber halo); green/rose buttons carry a matching colored halo.

## Ornament (the signature)

Knotwork throughout — **never botanical filigree**. Assets in `design-system/assets/`:
- `monogram.svg` — Celtic trefoil-knot name plate, "W & C" (gold W, sage &, gold C). Primary mark.
- `sunburst.svg` / `sunburst-deco.svg` — woven rising-sun halo behind hero titling.
- `divider.svg` — green→garnet rule with a centered gold trinity knot.
- `pattern-tile.svg` — seamless over-under plait for faint full-page lattice (~4% opacity).

CSS ornament utilities in `base.css`: `.gg-eyebrow` (tracked Deco label), `.gg-rule` (green⟷rose hairline + gold diamond), `.gg-frame` (Deco corner frame), `.gg-gilt` / `.gg-duo` (foil text). The `Frame` component generates live knot corners + duo border. **Unicode `✦` / rotated square** are the only glyph icons; **no emoji, no icon font** (use thin 1.5px Lucide only if a functional UI ever needs line icons).

## Motion

Slow and graceful, **no bounce/overshoot**. `--ease-out cubic-bezier(0.22,0.61,0.36,1)`; durations `--dur-fast 160` / `--dur-base 260` / `--dur-slow 440` / `--dur-veil 700` (curtain reveals). Page changes cross-fade up 10px; links draw a gold underline left-to-right on hover; cards lift 2px; press nudges 1px down; focus shows a green halo (`--focus-ring`).

**Reduced motion is required** — every animation needs a `prefers-reduced-motion: reduce` alternative (crossfade or instant).

## Components

CSS interaction states are in `design-system/components.css`, keyed off stable class names + `data-variant`/`data-tone`:
- **Button** (`.gg-btn`) variants: `duo` (signature), `green`, `rose`, `gold`, `outline`, `ghost` — each with its own hover halo; 1px press; gilt focus ring.
- **Inputs / Textarea / Select** (`.gg-input`, `.gg-textarea`, `.gg-select`) — hairline borders, gilt focus glow, graphite placeholders.
- **Radio / Checkbox** (`.gg-choice`) — rotated-square radios, gold check marks, per-tone (green/rose/gold) selected rules.
- **Link** (`.gg-link`) — left-to-right gold underline on hover.
- **Card** — dark (`--surface-card` + gold hairline) and **parchment** (cream surface with ink text restored) flavors; `.gg-card--interactive` lifts on hover.

The full React primitives (Button, Card, Badge, Divider, Eyebrow, Frame, form fields), the click-through wedding-website UI kit, and the Save-the-Date template remain in the cloud Design System project and can be pulled locally once a framework is chosen.

## Imagery

Warm, golden-hour, low-light photography. Until real photos arrive, use the Deco-framed `Photo` placeholder slot with the lattice texture. Never cool/blue, never harsh; photos live in framed slots (no photographic full-bleeds by default).
