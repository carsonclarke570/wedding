---
name: gilt-grove-design
description: Use this skill to generate well-branded interfaces and assets for Gilt & Grove — the Art Deco + Celtic-knot wedding brand for Warren & Carson (Rehoboth, MA) — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type, fonts, ornament assets, and a UI kit of components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this folder, and explore the other available files (`styles.css` and `tokens/` for the foundations, `assets/` for the gold ornaments). The React primitives, the full wedding-website UI kit, and the guideline specimen cards still live in the cloud Design System project (`Gilt & Grove`, claude.ai/design project `4cafa18a-9529-4a9f-b46b-1a7688bf7ae0`) — pull them down via the claude_design / DesignSync tool when needed.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc.), copy assets out and create static HTML files for the user to view — link `styles.css`, use the CSS custom properties (`--ink-800`, `--accent`/`--accent-green`, `--duo-sheen`, `--metal`, `--font-display`, `--font-celtic`, etc.), and reach for the ornament SVGs in `assets/` rather than inventing new ones. If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

Core rules to honor: warm dark near-black grounds; **eucalyptus greenery as the single lead** (the hung greenery of the barn), gilded into bronze in the duo (`--duo-sheen`, `--duo-line`); **antique bronze/gold demoted to a fine metallic tie** (the "&", divider knots, corner knots, small glints) — never a dominant fill; **Uncial Antiqua** for the names + **Cinzel** caps (headings / labels / nav) + **Cormorant Garamond** body; angular near-sharp corners with duo / greenery rule framing and small gold Celtic-knot corners; **motifs are Celtic knotwork** (trinity knots, interlaced corners, knot lattices), not botanical or filigree; slow graceful motion, no bounce; **no cursive, no botanical illustration, no emoji**.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask a few questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.
