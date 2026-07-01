# Gilt & Grove — Design System

A design system for **Warren & Carson's wedding website** (Rehoboth, Massachusetts · September 19, 2026). The brief: a memorable, stylish wedding site that avoids the pre-made-template clichés — **no cursive scripts, no excessive botanicals**. Instead it fuses **Art Deco** (angular, geometric framing; sunbursts; stepped lozenges; tracked caps) with **Celtic knotwork** (interlaced trinity knots, woven corner knots, endless-knot lattices). The feeling is **formal and regal, yet warm and welcoming** — a candle-lit barn, not a stiff ballroom.

> This is a from-scratch brand. There was **no source codebase, Figma, or deck** — the system was designed directly from the couple's written brief. If you later have brand references, share them and the tokens/assets can be reconciled.

## Foundation
- Base palette: **warm near-black grounds** (barn iron, chairs, night) + **graphite neutrals** + **floral white** (cloths, blooms).
- **Eucalyptus greenery is the single lead** — a deep, desaturated sage/foliage (the hung greenery of the barn) — carrying sections solo or paired with floral white on the dark ground. A darkened, antique jewel tone, deliberately *not* bright emerald.
- **Antique bronze/gold** is demoted to a **fine metallic tie**: the "&" between the names, divider knots, corner ornaments, small diamonds, focus/hover glints.
- Type: **Uncial Antiqua** (insular Celtic display — names + ceremonial titles) · **Cinzel** (Roman caps — headings, labels, nav) · **Cormorant Garamond** (warm serif body). *(Poiret One and Cinzel Decorative retired.)*

---

## CONTENT FUNDAMENTALS — how the copy reads

**Voice.** First-person plural and warm — the couple speaking *to* their guests. "*We* would be honored by your presence"; "*We* can't wait to celebrate with you." Guests are addressed directly and affectionately ("the people we love").

**Tone.** Formal-but-warm. Ceremonial diction borrowed from classic invitations — "Together with their families," "Joyfully Accepts / Regretfully Declines," "Kindly reply by August 1" — kept human with small, specific, slightly witty details ("one very persistent cat," "alphabetized, contentiously"). Never stiff, never saccharine.

**Casing.** Headings and names in **Cinzel caps** (e.g. *OUR STORY*, *THE DAY*). Eyebrows/labels are **uppercase, widely tracked** ("SAVE THE DATE"). Body copy is sentence case in Cormorant. Numerals are welcome as display moments (the date block, schedule times).

**Punctuation & ornament.** A diamond (`✦` / rotated square) or the divider motif separates ideas rather than exclamation points. Ampersands are a brand signature — set in Uncial Antiqua and **gold** between the two names ("Warren **&** Carson"), the metallic tie between them.

**Emoji.** None. The "icon" vocabulary is the small gold diamond/fan ornament (the metallic tie), never emoji.

**Examples.**
- Eyebrow: `SAVE THE DATE` · `REHOBOTH · MASSACHUSETTS`
- Heading: `Our Story` · `The Day` · `Travel & Stay`
- Body: "After nine years, one very persistent cat, and a great many dinners, we are overjoyed to gather the people we love."
- CTA labels: `RSVP` · `OUR STORY` · `SEND OUR REPLY`
- Status: `BLACK TIE OPTIONAL` · `ADULTS ONLY` · `RSVP BY AUG 1`
- Names: **Warren & Carson** (set in floral-white Uncial Antiqua; the "&" set in gold)

---

## VISUAL FOUNDATIONS

**Color & vibe.** Dark, candle-lit, regal. Pages sit on `--ink-800` (#121110) — a warm near-black (barn iron and chairs at night) so it never reads as pure tech-black. Text is floral-white parchment (`--parchment-100`, #FBF7EE). **Eucalyptus greenery is the single lead** — the hung greenery of the barn — a darkened antique jewel tone (green ~#47593F–#5F7456, light sage #90A587), chosen to read rich and natural and to avoid any bright-emerald association. It carries sections solo or paired with floral white, and gilds into bronze in the **duo** (`--duo-sheen` for the names and primary CTA, `--duo-line` for frames and rules). **Bronze/gold is a fine metallic tie only** — the "&", divider knots, corner filigree, small diamonds, hover/focus glints — never a dominant fill. Avoid: bright/emerald greens, bluish-purple gradients, neon, pure white, pastel, large gold fills.

**Type.** High contrast between insular Celtic display (Uncial Antiqua, for names), carved Roman caps (Cinzel, for headings/labels/nav), and a warm humanist serif (Cormorant, body). Display tracking is generous (0.04em); eyebrows are very wide (0.34em). Italic Cormorant carries emphasis and warmth. No script/cursive faces.

**Backgrounds.** Solid dark grounds, occasionally layered with: a **rising-sun halo** behind hero titling; a **faint Celtic knot lattice** texture (`assets/pattern-tile.svg`, a seamless over-under diagonal plait) at ~4% opacity over full pages. No photographic full-bleeds by default (photos live in framed slots); no loud gradients — the only gradients are the greenery→bronze duo on names/CTAs and the metallic `--gilt-sheen` on small gold elements.

**Linework & framing (the signature).** Thin **neutral floral-white** hairlines (`--line`, ~16% parchment) for quiet structure; **greenery→bronze duo borders** (`--duo-line`, via a padding-box/border-box gradient) for important containers like `Frame`; a `--line-green` greenery rule or `--line-gold` bronze rule when a single color is wanted. **Interlaced Celtic-knot corner ornaments** (a small gold tie) sit at each corner of `Frame`. Dividers run a greenery gradient with a centered bronze trinity knot. The motif is knotwork throughout — never botanical filigree.

**Corners & radii.** Architectural and near-sharp: default `--radius-md` is 3px, most structure is 0–2px. True pills only for chips. The Deco half stays angular; softness comes from glow and motion, not rounding.

**Borders.** `--line` (neutral floral-white hairline), `--line-strong`, `--line-soft` for quiet structure; `--line-green` (greenery) and `--line-gold` (bronze) for single-color rules. Important frames use the `--duo-line` greenery⟷bronze gradient border.

**Shadows & elevation.** Deep, soft, near-black on dark grounds: `--shadow-sm/md/lg`. For emphasis/focus, a warm **gilt glow** (`--glow-gold`) — a small bronze ring + amber halo — is the metallic accent; the green button carries its own colored halo on hover.

**Transparency & blur.** The sticky nav uses `rgba(12,14,12,0.82)` + `backdrop-filter: blur(10px)`. Soft tinted fills for badges (`rgba(gold/green, ~0.12–0.18)`). Used sparingly.

**Motion.** Slow and graceful, **no bounce/overshoot**. `--ease-out` (cubic-bezier(0.22,0.61,0.36,1)); durations 160 / 260 / 440ms, with a 700ms "veil" reveal for curtain moments. Page changes cross-fade up 10px. Links draw a gold underline left-to-right on hover.

**Hover / press states.** Hover: the duo button brightens + gains the gilt glow; the green button brightens with a matching colored halo; outline/ghost shift toward `--accent-strong` (green) and pick up a hairline; cards lift 2px with a stronger rule. Press: a 1px downward nudge (`translateY(1px)`). Focus: a green halo (`--focus-ring`).

**Cards.** Two flavors — **dark** (`--surface-card` #262320 with a gold hairline + `--shadow-md`) and **parchment** (warm cream with a gold border, for contrast moments like the venue). Interactive cards lift on hover. Near-sharp corners.

**Imagery vibe.** Warm, golden-hour, low-light photography is the intent; until real photos arrive, the `Photo` placeholder shows a Deco-framed slot with the lattice texture. Keep imagery warm, never cool/blue, never harsh.

**Layout rules.** Centered, symmetrical compositions (Deco loves symmetry). Content maxes at ~1040px; hero/RSVP narrower (~620–760px). Sticky translucent nav. Generous vertical rhythm (`--section-y` 96px).

---

## ICONOGRAPHY

This brand is **ornament-led, not icon-led** — it deliberately has almost no UI icon set, in keeping with formal stationery.

- **Brand ornaments (SVG, in `assets/`)** are the icon vocabulary: `monogram.svg` (a grid-generated Celtic **trefoil knot** cut across the middle by a name plate — two thin gold rules framing the **W & C** initials: gold W, sage ampersand, gold C), `sunburst.svg` (a woven two-strand **halo** arch with fine rays — the harmonised "rising sun") with `sunburst-deco.svg` as a pared-back geometric-ray alternative, `divider.svg` (rule + a centred generated **knot band**), `pattern-tile.svg` (a seamless over-under Celtic **plait** for textures). The framing knotwork (corners + border) is generated live by the `Frame` component. The monogram, sunburst and divider carry **greenery** gilded with **bronze** centers/knots as the tie; the lattice stays bronze. All are line art and scale cleanly.
- **Unicode marks** stand in for tiny accents: the diamond/four-point star `✦` and a rotated square (`transform: rotate(45deg)`) are the only "glyph icons" used (dividers, success states, eyebrow flanks).
- **No emoji. No icon font.** If a functional UI ever needs line icons (e.g. a richer RSVP flow), use a **thin-stroke, 1.5px set** — **Lucide** is the recommended match, tinted green/bronze/parchment to suit. *(Not yet in use — added only if needed.)*
- Logos/marks: the `monogram.svg` Celtic knot name-plate is the primary mark; the "W & C" Cinzel wordmark (gold Uncial Antiqua ampersand) is the secondary lockup.

---

## INDEX — what's in this folder

**Root / foundations**
- `styles.css` — the single entry point consumers link (only `@import`s).
- `tokens/` — `fonts.css` (Google-hosted webfonts), `colors.css`, `typography.css`, `spacing.css`, `effects.css`.
- `base.css` — element defaults + ornament utilities (`.gg-eyebrow`, `.gg-rule`, `.gg-frame`, `.gg-gilt`, `.gg-duo`).
- `components.css` — interaction states (hover/focus/active) for the primitives.
- `assets/` — `monogram.svg`, `sunburst.svg`, `sunburst-deco.svg`, `divider.svg`, `pattern-tile.svg`.
- `SKILL.md` — makes this portable to Claude Code as `gilt-grove-design`.

**Still in the cloud Design System project** (not yet pulled local): the React primitives (`components/core/` — Button, Card, Badge, Divider, Eyebrow, Frame; `components/forms/` — Input, Textarea, Select, RadioGroup, CheckboxGroup), the full click-through UI kit (`ui_kits/wedding-website/`), the printable Save-the-Date template, and the guideline specimen cards. Pull any of these once a framework is chosen for the site.

---

## CAVEATS / FONTS
The three faces (Uncial Antiqua, Cinzel, Cormorant Garamond) are both **declared as `@font-face` families in `tokens/fonts.css`** and **loaded from Google Fonts' CDN** via the `@import` there. The webfont binaries are not self-hosted, so full-fidelity rendering still requires a network connection. **To go fully offline:** download the `.woff2` files from fonts.google.com into `assets/fonts/`, swap each `src: local(...)` in the `@font-face` blocks for `src: url('../assets/fonts/<file>.woff2') format('woff2')`, and delete the `@import`. Nothing else changes.
