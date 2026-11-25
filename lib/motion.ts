'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The site's scroll-motion vocabulary. Elements opt in with `data-reveal`:
 *
 *  words  — headings rendered by <RevealText>: masked word rise with a short blur. Plays once,
 *           so reading text never disappears again when the visitor scrolls back up.
 *  fade   — supporting copy: a quiet opacity and lift. Plays once.
 *  media  — screenshots: a clip-path opening scrubbed to scroll. Fully reversible.
 *  drift  — a slow parallax scrubbed to scroll. Fully reversible.
 *  exit   — the hero copy easing back as the hero leaves. Fully reversible.
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
    // Reveals run on wall-clock time: on a device that drops frames (the WebGL scene is busy),
    // lag smoothing would stretch a one-second heading reveal over many seconds of hidden text.
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

function markRevealed(el: HTMLElement, targets: gsap.TweenTarget) {
  el.classList.add('is-revealed');
  gsap.set(targets, { clearProps: 'transform,opacity,filter' });
}

/** Builds the ScrollTriggers for every unbound reveal under `root`. Returns the cleanup. */
export function bindReveals(root: Element, { scoped = false } = {}): () => void {
  ensure();
  const els = collect(root, scoped);
  const html = document.documentElement;
  const ready = html.dataset.motion === 'ready';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const arabic = html.lang === 'ar';

  const ctx = gsap.context(() => {
    for (const el of els) {
      el.dataset.revealBound = '';
      const kind = el.dataset.reveal;

      // Reduced motion, or the pre-paint failsafe already showed everything: final state, no tweens.
      if (reduce || !ready) {
        el.classList.add('is-revealed');
        continue;
      }

      if (kind === 'words') {
        const words = el.querySelectorAll('.rw-i');
        gsap.fromTo(words,
          // y is pinned to 0: GSAP would otherwise read the CSS starting translate as pixels and keep it.
          { y: 0, yPercent: arabic ? 165 : 135, opacity: 0, filter: 'blur(7px)' },
          {
            y: 0, yPercent: 0, opacity: 1, filter: 'blur(0px)',
            duration: 1.1, ease: 'expo.out', stagger: { each: arabic ? 0.08 : 0.055 },
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            onComplete: () => markRevealed(el, words),
          });
      } else if (kind === 'fade') {
        gsap.fromTo(el,
          { opacity: 0, y: 18 },
          {
            opacity: 1, y: 0, duration: 0.95, ease: 'power2.out', delay: Number(el.dataset.revealDelay ?? 0.08),
            scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            onComplete: () => markRevealed(el, el),
          });
      } else if (kind === 'media') {
        gsap.fromTo(el,
          { clipPath: 'inset(9% 7% 9% 7% round 28px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 96%', end: 'top 42%', scrub: 0.6 } });
      } else if (kind === 'drift') {
        const amount = Number(el.dataset.driftAmount ?? 10);
        gsap.fromTo(el,
          { yPercent: amount },
          { yPercent: -amount, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
      } else if (kind === 'exit') {
        gsap.to(el, { y: -70, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: el.closest('section') ?? el, start: 'top top', end: 'bottom top', scrub: 0.5 } });
      }
    }
  }, root);

  return () => {
    ctx.revert();
    for (const el of els) delete el.dataset.revealBound;
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
