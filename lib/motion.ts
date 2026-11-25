'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The site's scroll-motion vocabulary. Elements opt in with `data-reveal`:
 *
 *  words   — headings rendered by <RevealText>: words rise through a mask while a blur resolves.
 *  fade    — supporting copy: opacity, lift and a light blur.
 *  stagger — groups (metadata, tags, lists): direct children fade up one after another.
 *  media   — screenshots and films: a clip-path opening with a slight scale.
 *  drift   — a slow parallax.
 *  exit    — the hero copy easing back as the hero leaves.
 *
 * Every reveal is a timeline scrubbed to scroll, so it plays forward on the way down and runs
 * backwards at the same pace on the way up, from wherever it is. It completes while the element
 * is still in the lower part of the screen, so text being read is always fully shown. Elements
 * that are already on screen when the page loads cannot scroll in; they play a short intro instead.
 *
 * The hidden starting state lives in CSS behind `html[data-motion='ready']`, which the pre-paint
 * script sets only when reduced motion is off and removes again if this module never starts.
 * Elements inside a `[data-reveal-scope]` belong to that component, which binds them itself.
 */

type MotionWindow = Window & { __elalfyMotion?: boolean };

let registered = false;

function ensure() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    // Intros run on wall-clock time: on a device that drops frames (the WebGL scene is busy),
    // lag smoothing would stretch a one-second intro over many seconds of hidden text.
    gsap.ticker.lagSmoothing(0);
    registered = true;
  }
  (window as MotionWindow).__elalfyMotion = true;
}

function collect(root: Element, scoped: boolean): HTMLElement[] {
  const all = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (root instanceof HTMLElement && root.dataset.reveal) all.unshift(root);
  return all.filter(el => {
    if (el.dataset.revealBound !== undefined) return false;
    // The page-level director leaves component scopes alone; a scope binds only its own subtree.
    const owner = el.closest('[data-reveal-scope]');
    return scoped ? owner === root : owner === null;
  });
}

/** Scroll window per kind: [start, end] of the element's top edge, as a share of the viewport. */
const WINDOWS: Record<string, [string, string]> = {
  words: ['top 94%', 'top 58%'],
  fade: ['top 96%', 'top 66%'],
  stagger: ['top 95%', 'top 62%'],
  media: ['top 98%', 'top 40%'],
};

/** Adds the kind's animation to `tl`. Returns false for kinds that are not reveals. */
function build(tl: gsap.core.Timeline, el: HTMLElement, kind: string, arabic: boolean): boolean {
  if (kind === 'words') {
    const words = el.querySelectorAll('.rw-i');
    // y is pinned to 0: GSAP would otherwise read the CSS starting translate as pixels and keep it.
    tl.fromTo(words,
      { y: 0, yPercent: arabic ? 150 : 118, opacity: 0, filter: 'blur(9px)' },
      { y: 0, yPercent: 0, opacity: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 1, stagger: { amount: arabic ? 0.75 : 0.6 } });
    return true;
  }
  if (kind === 'fade') {
    tl.fromTo(el,
      { y: 30, opacity: 0, filter: 'blur(6px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 1 });
    return true;
  }
  if (kind === 'stagger') {
    tl.fromTo(el.children,
      { y: 18, opacity: 0 },
      { y: 0, opacity: 1, ease: 'power2.out', duration: 1, stagger: 0.14 });
    return true;
  }
  if (kind === 'media') {
    tl.fromTo(el,
      { clipPath: 'inset(9% 7% 9% 7% round 28px)', scale: 0.94 },
      { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1, ease: 'power2.out', duration: 1 });
    return true;
  }
  return false;
}

/** Builds the ScrollTriggers for every unbound reveal under `root`. Returns the cleanup. */
export function bindReveals(root: Element, { scoped = false } = {}): () => void {
  ensure();
  const els = collect(root, scoped);
  const html = document.documentElement;
  const ready = html.dataset.motion === 'ready';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const arabic = html.lang === 'ar';
  const firstScreen = window.innerHeight * 0.9;

  const ctx = gsap.context(() => {
    for (const el of els) {
      el.dataset.revealBound = '';
      const kind = el.dataset.reveal ?? '';

      // Reduced motion, or the pre-paint failsafe already showed everything: final state, no tweens.
      if (reduce || !ready) {
        el.classList.add('is-revealed');
        continue;
      }

      if (kind === 'drift') {
        const amount = Number(el.dataset.driftAmount ?? 10);
        gsap.fromTo(el, { yPercent: amount }, { yPercent: -amount, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
        continue;
      }
      if (kind === 'exit') {
        gsap.to(el, { y: -70, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top top', end: 'bottom top', scrub: 0.5 } });
        continue;
      }

      // The word mask is only needed while words are moving; a settled heading drops it so its
      // text-shadow is never cut off.
      const settle = (tl: gsap.core.Timeline) => el.classList.toggle('is-settled', tl.progress() > 0.999);
      const onScreenAtLoad = el.getBoundingClientRect().top + window.scrollY < firstScreen;

      if (onScreenAtLoad) {
        const tl = gsap.timeline({ delay: Number(el.dataset.revealDelay ?? 0.15), defaults: { duration: 1.1 } });
        tl.eventCallback('onUpdate', () => settle(tl));
        if (!build(tl, el, kind, arabic)) tl.kill();
        continue;
      }

      const [start, end] = WINDOWS[kind] ?? WINDOWS.fade;
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: `clamp(${start})`, end: `clamp(${end})`, scrub: kind === 'media' ? 0.6 : 0.5 },
      });
      tl.eventCallback('onUpdate', () => settle(tl));
      if (!build(tl, el, kind, arabic)) tl.kill();
    }
  }, root);

  return () => {
    ctx.revert();
    for (const el of els) {
      delete el.dataset.revealBound;
      el.classList.remove('is-settled');
    }
  };
}

let lastScroll = 0;
let pendingRefresh = 0;
if (typeof window !== 'undefined') {
  window.addEventListener('scroll', () => { lastScroll = performance.now(); }, { passive: true });
}

/**
 * Recalculates trigger positions after layout changes (fonts, filters, images).
 * A refresh restores the scroll position, which would cut a smooth anchor scroll short,
 * so it waits until the page has been still for a moment.
 */
export function refreshMotion() {
  if (!registered) return;
  window.clearTimeout(pendingRefresh);
  const run = () => {
    if (performance.now() - lastScroll < 300) {
      pendingRefresh = window.setTimeout(run, 300);
      return;
    }
    ScrollTrigger.refresh();
  };
  run();
}

/** Lets a component own the reveals inside it, so they are rebuilt when it remounts. */
export function useRevealScope(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return bindReveals(node, { scoped: true });
  }, [ref]);
}
