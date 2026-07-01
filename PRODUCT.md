# Product

## Register

brand

## Users

Wedding guests of Warren & Carson — family and friends, a wide age range, many of whom will reach the site from an emailed save-the-date or invitation on their phone. Their context is practical and emotional at once: they've come to find out *when, where, what to wear, where to stay,* and *how to reply* — and to feel, for a moment, the warmth of being invited by people they love. A secondary audience is the couple themselves, for whom the site is a keepsake.

The job to be done: answer the logistics quickly and unmistakably (date, place, dress code, lodging, RSVP), while making the visit feel like a personal invitation rather than a form to fill out.

## Product Purpose

A wedding website for **Warren & Carson** — Rehoboth, Massachusetts, **September 19, 2026**. It carries the celebration online: Save the Date, Our Story, Lodging / Travel, Registry, RSVP, and a guest Gallery. Most of the site is editorial and largely static; **RSVP** needs persistence (a backend or form service) and **Gallery** needs file/blob storage and upload handling — the chosen stack must accommodate both.

Success looks like: every guest finds their answer in seconds, replies without friction, and comes away feeling the event's character before they ever arrive. The site should look unmistakably *theirs* — not a recognizable template.

## Brand Personality

**Gilt & Grove** — formal and regal, yet warm and welcoming. A candle-lit ballroom, not a stiff one. Three words: **regal, warm, crafted.**

The voice is first-person plural and affectionate — the couple speaking *to* their guests ("We would be honored by your presence"; "the people we love"). The tone borrows ceremonial diction from classic invitations ("Together with their families," "Joyfully Accepts / Regretfully Declines," "Kindly reply by August 1") and keeps it human with small, specific, slightly witty details. Never stiff, never saccharine, no emoji.

Visually it leans **Celtic** — interlaced trinity knots, woven corners, and endless-knot lattices, with insular Uncial lettering for the names — set in **angular, architectural framing** (the structural Deco inheritance: crisp rules, near-sharp corners, sunburst halos). The palette is drawn from a candle-lit night barn: **warm near-black grounds** (wrought iron, chairs), **floral white** (tablecloths, blooms), **eucalyptus greenery as the single lead** (the hung greenery), and **antique bronze/gold as a fine metallic tie** (the "&" between their names, divider knots, corner ornaments, small glints) — never a dominant fill. Emotional goals: belonging, anticipation, quiet grandeur.

## Anti-references

- **The pre-made wedding template** (Zola / The Knot / Squarespace-wedding look) — stocky, samey, fill-in-the-blank. The whole reason this brand exists is to *not* look generated from a theme picker.
- **Cursive scripts and botanical illustration** — flowing calligraphy headlines, floral borders, eucalyptus sprigs, watercolor washes. The greenery here lives in the *palette*, not in drawn foliage; the romance is carried by knotwork, metal, and type — never script or botanical filigree.
- **Cold / corporate / SaaS-landing** sterility — clinical whitespace, businesslike neutrality. Too clinical for a wedding.
- **Loud / cluttered** layouts where the actual information (date, RSVP) is hard to find.
- Color traps to avoid: bright/emerald greens, bluish-purple gradients, neon, pure white, pastels, and large flat gold fills (bronze is a tie, not a surface).

## Design Principles

1. **A personal invitation, not a form.** Every screen should read as the couple addressing the guest. Warmth and ceremony first; the logistics are delivered *through* that voice, not bolted beside it.
2. **Greenery leads, bronze ties.** Eucalyptus green is the single lead color, carrying sections solo or paired with floral white on the dark ground; **bronze/gold is only ever the fine metallic tie** — the "&", divider knots, corner ornaments, glints — never a dominant surface fill.
3. **Ornament over decoration.** The Deco-Celtic knotwork is a deliberate, generated system (frames, corners, dividers, lattice) — not clip-art sprinkled on top. If an ornament isn't doing structural or symbolic work, it doesn't belong.
4. **Regal but legible.** Dark candle-lit grounds and high-contrast type create grandeur, but the guest's answer — date, place, dress code, RSVP — must always be the fastest thing to find and read.
5. **Restraint is the luxury.** Near-sharp corners, few gradients, gold used sparingly, slow graceful motion with no bounce. The richness comes from precision and material, not from adding more.

## Accessibility & Inclusion

- Target **WCAG 2.1 AA**. The palette is built for it on dark grounds — body parchment text and the lighter greenery accent ramp (`--green-300`) are chosen to clear AA; verify any new color pairing (especially small tracked eyebrows and placeholder text) against its actual background before shipping.
- **Reduced motion is required**, not optional: every reveal, cross-fade, and the 700ms "veil" needs a `prefers-reduced-motion: reduce` alternative (crossfade or instant). Motion is already slow and non-bouncy by design.
- Don't rely on color alone to convey RSVP accept/decline state — pair it with labels and shape (the system already uses rotated-square radios, gold-knot marks, and text labels).
- Wide age range and mobile-first arrival: generous tap targets, real font sizes (18px body floor), and copy that's plain about the essentials even while the voice is ceremonial.
