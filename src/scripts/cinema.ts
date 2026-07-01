/* ============================================================
   Gilt & Grove — Cinema
   The scroll-driven layer: Lenis smooth-scroll + GSAP ScrollTrigger
   choreography for the pinned "acts" and the parallax stage behind them.

   This is PROGRESSIVE ENHANCEMENT. The page renders and reads completely
   with no JavaScript — every element's default (CSS) state is its FINAL,
   fully-visible state. Cinema only runs when the guest has a fine pointer,
   a wide viewport, and has not asked for reduced motion; otherwise the acts
   un-pin into an ordinary long-scroll and the design-system's own
   view-timeline reveals carry the motion. Nothing here gates content
   visibility on a class that a headless renderer would never toggle.
   ============================================================ */

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pin + scrub is a desktop-pointer experience. Touch and narrow viewports
// get the un-pinned stacked flow (still smooth, still revealed).
const cinemaAllowed = () =>
  !prefersReduced() &&
  window.matchMedia('(pointer: fine)').matches &&
  window.innerWidth > 860;

async function boot() {
  if (!cinemaAllowed()) return;

  const [{ default: Lenis }, gsapMod, stMod] = await Promise.all([
    import('lenis'),
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);
  const gsap = (gsapMod as any).gsap ?? (gsapMod as any).default;
  const ScrollTrigger = (stMod as any).ScrollTrigger ?? (stMod as any).default;
  gsap.registerPlugin(ScrollTrigger);

  const root = document.documentElement;
  root.classList.add('cinema-on');

  /* ---- Smooth scroll (Lenis), wired into GSAP's ticker ---- */
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => 1 - Math.pow(1 - t, 4), // ease-out-quart, no overshoot
    wheelMultiplier: 0.9,
    // Release native scroll for any overflow container injected into the page
    // (e.g. dev-tool panels, the impeccable live editor) so they can scroll
    // independently of Lenis's window-level wheel capture.
    prevent: (node: Element) => {
      if (node === document.documentElement || node === document.body) return false;
      const s = window.getComputedStyle(node);
      return s.overflowY === 'auto' || s.overflowY === 'scroll' ||
             s.overflow  === 'auto' || s.overflow  === 'scroll';
    },
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time: number) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  (window as any).__lenis = lenis; // handle for the dev screenshot harness

  // Anchor links (nav, act index, hero CTAs) glide instead of jumping.
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as
      | HTMLAnchorElement
      | null;
    if (!a) return;
    const id = a.getAttribute('href')!.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: 0, duration: 1.2 });
  });

  const q = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) =>
    ctx.querySelector(sel) as T | null;
  const qa = <T extends Element = HTMLElement>(sel: string, ctx: ParentNode = document) =>
    Array.from(ctx.querySelectorAll(sel)) as T[];

  /* ---- Parallax stage: layers drift at their own depth ----
     data-speed is yPercent travelled across the whole page (negative = up). */
  qa('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.speed || '0.15');
    gsap.to(el, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      },
    });
  });

  /* ---- Per-act aura blooms cross-fade as their act holds the viewport ---- */
  qa('[data-aura]').forEach((el) => {
    const actId = el.dataset.aura!;
    const act = document.getElementById(actId);
    if (!act) return;
    gsap.fromTo(
      el,
      { opacity: 0 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: act,
          start: 'top 85%',
          end: 'top 30%',
          scrub: true,
        },
      }
    );
    gsap.to(el, {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: act,
        start: 'bottom 60%',
        end: 'bottom 10%',
        scrub: true,
      },
    });
  });

  /* ============================================================
     ACT 0 — The Invitation
     The hero pins; the woven sun-halo swells and dissolves, the
     names and card drift up, and a greenery⟶bronze veil rises to
     hand off into Act I.
     ============================================================ */
  const hero = q('[data-act="invitation"]');
  // Only pin+scrub when the hero actually fits the viewport. On a short window
  // the hero is taller than the screen; pinning it would scrub the CTA away
  // before it can be read, so we let it scroll normally (the load reveal still
  // plays, the veil simply never rises).
  if (hero && hero.offsetHeight <= window.innerHeight + 4) {
    const halo = q('[data-hero-halo]', hero);
    const content = q('[data-hero-content]', hero);
    const veil = q('[data-hero-veil]', hero);
    const scrollCue = q('[data-hero-cue]', hero);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: '+=110%',
        pin: true,
        pinSpacing: true,
        scrub: 0.5,
      },
    });

    if (halo) tl.to(halo, { scale: 1.35, opacity: 0, ease: 'none' }, 0);
    if (scrollCue) tl.to(scrollCue, { opacity: 0, duration: 0.15, ease: 'none' }, 0);
    if (content)
      tl.to(content, { yPercent: -18, opacity: 0, ease: 'power1.in' }, 0.15);
    if (veil)
      tl.fromTo(
        veil,
        { yPercent: 105 },
        { yPercent: 0, ease: 'power2.inOut' },
        0.35
      );
  }

  /* ============================================================
     ACT I — The Two of Us
     Two cords (greenery + bronze) draw down the centre and tie into
     a trinity knot; the copy and portrait settle in from either side.
     "Two people, one knot."
     ============================================================ */
  const weave = q('[data-act="story"]');
  if (weave) {
    const cords = qa('[data-weave-cord]', weave);
    const seal = q('[data-weave-seal]', weave);
    const colStart = q('[data-weave-col="start"]', weave);
    const colEnd = q('[data-weave-col="end"]', weave);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: weave,
        start: 'top 78%',
        end: 'center 58%',
        scrub: 0.6,
      },
    });

    cords.forEach((path) => {
      const len = (path as unknown as SVGPathElement).getTotalLength?.() || 400;
      gsap.set(path, { strokeDasharray: len });
      tl.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none' }, 0);
    });
    if (colStart) tl.fromTo(colStart, { xPercent: -6, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'power2.out' }, 0.1);
    if (colEnd) tl.fromTo(colEnd, { xPercent: 6, opacity: 0 }, { xPercent: 0, opacity: 1, ease: 'power2.out' }, 0.1);
    if (seal)
      tl.fromTo(
        seal,
        { scale: 0.55, rotate: -35, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, ease: 'back.out(1.4)' },
        0.45
      );
  }

  /* ---- Act index: highlight whichever act holds the viewport centre ---- */
  qa<HTMLAnchorElement>('[data-act-index] a').forEach((link) => {
    const id = link.getAttribute('href')?.slice(1);
    const section = id ? document.getElementById(id) : null;
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end: 'bottom 55%',
      onToggle: (self: any) => link.classList.toggle('is-current', self.isActive),
    });
  });

  ScrollTrigger.refresh();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
