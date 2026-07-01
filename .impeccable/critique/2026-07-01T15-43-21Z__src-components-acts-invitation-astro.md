---
target: invitation section
total_score: 35
p0_count: 0
p1_count: 1
timestamp: 2026-07-01T15-43-21Z
slug: src-components-acts-invitation-astro
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Staggered kindle animations confirm page vitality; no loading needed for static content |
| 2 | Match System / Real World | 4 | Ceremonial language calibrated perfectly to invitation conventions |
| 3 | User Control and Freedom | 3 | CTAs clear; "Begin" scroll cue has no focus indicator for keyboard users |
| 4 | Consistency and Standards | 4 | Fully coherent with Gilt & Grove; three-face pact respected |
| 5 | Error Prevention | 4 | No user errors possible; static informational content |
| 6 | Recognition Rather Than Recall | 4 | All key logistics visible; chips proactively surface dress code, deadline |
| 7 | Flexibility and Efficiency | 3 | Scroll cue shortcut is good; keyboard nav has one gap |
| 8 | Aesthetic and Minimalist Design | 3 | Clean central axis; pill chips feel slightly off the near-sharp Deco register |
| 9 | Error Recovery | 4 | Static content; no errors to recover from |
| 10 | Help and Documentation | 3 | Chips pre-answer the three most common guest questions |
| **Total** | | **35/40** | **Good** |

## Anti-Patterns Verdict

**LLM assessment**: Not AI-generated — the Invitation section passes both slop tests clean. Dark near-black grounds + Celtic triquetra + inscriptional Roman + cinematic veil curtain does not pattern-match to any recognizable wedding template aesthetic. No editorial-typographic drift. The "kindle" metaphor is an original device. The veil transition is a different level of craft.

**Deterministic scan**: Clean. Exit code 0, no findings. No absolute bans detected.

## Overall Impression

Strongest section on the site. Ceremonial, distinctive, technically ambitious. Main opportunity: fix a structural accessibility gap in the heading, add one missing focus ring, and clarify an ambiguous RSVP year.

## What's Working

1. **The kindle reveal sequence.** Five-layer staggered v2-kindle lights content top-to-bottom like candles being lit. Metaphor, motion, and content in exact alignment.
2. **Date block hierarchy.** Three distinct tiers (parchment-200 date → muted-graphite year → gold-300 location) that read in the correct order without effort.
3. **Reduced-motion coverage is exceptional.** Every animation gets opacity: 1; animation: none in the media query. Content never gated on a class toggle.

## Priority Issues

**[P1] Screen reader announces names twice**
- h1 contains visible name spans (not aria-hidden) AND .sr-only "Warren and Carson". Screen reader: "Warren Carson Warren and Carson."
- Fix: Add aria-label="Warren and Carson" to the h1; add aria-hidden="true" to all three child spans; remove .sr-only span.
- Suggested: /impeccable audit

**[P2] "Begin" link has no focus-visible indicator**
- .hero__cue has :hover but no :focus-visible. No global a:focus-visible rule. WCAG 2.1 AA failure (2.4.7).
- Fix: Add :focus-visible { outline: none; color: var(--gold-300); box-shadow: 0 0 0 2px var(--bg), 0 0 0 4px var(--focus-ring); border-radius: var(--radius-sm); }
- Suggested: /impeccable audit

**[P2] RSVP deadline is year-ambiguous**
- Chip reads "Kindly Reply by August 1" with no year. October 2027 wedding; guests in 2026 could read this as August 2026 or August 2027.
- Fix: "Reply by 1 August 2027" or "Kindly Reply by August 1, 2027"
- Suggested: /impeccable clarify

**[P3] Dead CSS on .hero__place margin**
- CSS sets margin: var(--space-4) 0 0; inline style="margin: 0;" overrides it. Dead code.
- Fix: Remove margin: var(--space-4) 0 0 from .hero__place CSS rule.
- Suggested: /impeccable polish

## Persona Red Flags

**Jordan (First-Timer)**: Gets the picture in ~5 seconds. Red flag: "Kindly Reply by August 1" with no year — texts her partner confused about the deadline year.

**Sam (Accessibility-Dependent)**: h1 announces "Warren Carson Warren and Carson" — confused. Tabs to "Begin" link — no focus ring, can't tell if keyboard is working.

**Casey (Distracted Mobile)**: "Kindly Reply by August 1" without year doesn't anchor the deadline precisely enough to stick when interrupted.

## Minor Observations

- hero__names clamp(42px, 10.5vw, 92px) — 28% above DESIGN.md Celtic Display spec (72px max). Within skill ceiling. Hero context earns it.
- hero__place uses --gold-300 for label text where --green-300 is the system convention. Bronze Tie Rule restricts fills, not text. Deliberate hierarchy choice; worth documenting.
- hero__amp glow text-shadow uses hardcoded hex; --glow-gold or css custom property would be more maintainable.
