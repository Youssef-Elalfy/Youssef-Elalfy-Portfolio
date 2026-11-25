'use client';

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { enableSound, disableSound } from '@/lib/audio';
import { prefersReducedMotion, setState } from '@/lib/store';
import { useI18n } from '@/components/i18n/I18nProvider';

/**
 * The original ELALFY intro (wordmark, "Design. Develop. Experience.",
 * Enter with / without sound, perspective grid, neon flicker) — preserved and
 * extended with a real loading phase, an iris hand-off into the site,
 * Skip/Escape, and a voluntary replay. Shown once per browser session.
 */

const SEEN_KEY = 'elalfy_intro_seen';
const WORD = ['E', 'L', 'A', 'L', 'F', 'Y'];

type Phase = 'boot' | 'ready' | 'entering';

const introListeners = new Set<() => void>();
function subscribeIntro(listener: () => void) {
  introListeners.add(listener);
  return () => { introListeners.delete(listener); };
}
function introVisible() {
  return document.documentElement.dataset.intro !== 'skip';
}

/** Footer "Replay intro" calls this. */
export function replayIntro() {
  try { sessionStorage.removeItem(SEEN_KEY); } catch { /* storage unavailable */ }
  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  document.documentElement.dataset.intro = 'show';
  setState({ introDone: false });
  introListeners.forEach(listener => listener());
}

function finishIntro() {
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* storage unavailable */ }
  document.documentElement.dataset.intro = 'skip';
  setState({ introDone: true });
  introListeners.forEach(listener => listener());
}

export function IntroGate() {
  // Server markup always contains the intro; the pre-paint script hides it for returning visitors.
  const visible = useSyncExternalStore(subscribeIntro, introVisible, () => true);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    if (!introVisible()) setState({ introDone: true });
    // Each replay mounts a fresh intro with its own timeline.
    return subscribeIntro(() => { if (introVisible()) setGeneration(value => value + 1); });
  }, []);

  if (!visible) return null;
  return <CinematicIntro key={generation} />;
}

function CinematicIntro() {
  const { dict } = useI18n();
  const t = dict.intro;
  const [phase, setPhase] = useState<Phase>('boot');
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const leaving = useRef(false);

  // Boot: progress follows real readiness (fonts + window load), never less than a short beat.
  useEffect(() => {
    const reduced = prefersReducedMotion();
    const minimum = reduced ? 250 : 1700;
    const start = performance.now();
    let loaded = document.readyState === 'complete';
    let fontsReady = false;
    let frame = 0;
    let shown = 0;
    const onLoad = () => { loaded = true; };
    window.addEventListener('load', onLoad, { once: true });
    document.fonts?.ready.then(() => { fontsReady = true; }).catch(() => { fontsReady = true; });
    const cap = window.setTimeout(() => { loaded = true; fontsReady = true; }, 4500);

    const tick = (now: number) => {
      const elapsed = now - start;
      const ready = loaded && fontsReady;
      const timeShare = Math.min(1, elapsed / minimum);
      const target = ready ? timeShare : Math.min(0.86, timeShare * 0.9);
      shown += (target - shown) * (reduced ? 1 : 0.12);
      if (barRef.current) barRef.current.style.transform = `scaleX(${shown.toFixed(4)})`;
      if (pctRef.current) pctRef.current.textContent = String(Math.round(shown * 100)).padStart(3, '0');
      if (ready && elapsed >= minimum && shown > 0.995) { setPhase('ready'); setState({ introReady: true }); return; }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(frame); clearTimeout(cap); window.removeEventListener('load', onLoad); };
  }, []);

  // Keep the page behind the intro out of the tab order and away from screen readers.
  useEffect(() => {
    const site = document.getElementById('site');
    site?.setAttribute('inert', '');
    return () => site?.removeAttribute('inert');
  }, []);

  useEffect(() => { if (phase === 'ready') primaryRef.current?.focus({ preventScroll: true }); }, [phase]);

  const enter = useCallback((withSound: boolean) => {
    if (leaving.current) return;
    leaving.current = true;
    // Audio must start inside the click handler to satisfy autoplay policies.
    if (withSound) void enableSound(2400);
    else disableSound(true);

    const root = rootRef.current;
    const dot = dotRef.current?.getBoundingClientRect();
    if (root && dot) {
      root.style.setProperty('--ix', `${dot.left + dot.width / 2}px`);
      root.style.setProperty('--iy', `${dot.top + dot.height * 0.72}px`);
      root.style.setProperty('--iris-max', `${Math.hypot(window.innerWidth, window.innerHeight) * 1.05}px`);
    }
    setPhase('entering');
    window.setTimeout(finishIntro, prefersReducedMotion() ? 260 : 1250);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') enter(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enter]);

  return (
    <div ref={rootRef} className="intro" data-phase={phase} role="dialog" aria-modal="true" aria-labelledby="intro-title" aria-describedby="intro-tagline">
      <div className="intro-floor" aria-hidden="true"><div className="intro-grid" /></div>
      <div className="intro-glow" aria-hidden="true" />
      <div className="intro-scan" aria-hidden="true" />
      <div className="intro-iris-ring" aria-hidden="true" />

      <button type="button" className="intro-skip" onClick={() => enter(false)}>{t.skip} <kbd>Esc</kbd></button>

      <div className="intro-stage">
        <p id="intro-title" className="intro-wordmark" dir="ltr" lang="en">
          <span className="sr-only">{t.wordmark}</span>
          {WORD.map((letter, index) => <span key={index} className="intro-letter" style={{ '--i': index } as React.CSSProperties} aria-hidden="true">{letter}</span>)}
          <span ref={dotRef} className="intro-dot" aria-hidden="true">.</span>
        </p>

        <div className="intro-progress" aria-hidden={phase !== 'boot'}>
          <span className="intro-bar"><span ref={barRef} /></span>
          <span className="intro-pct" role="status" aria-label={t.loading}><span ref={pctRef}>000</span></span>
        </div>

        {/* Whole words animate, never single letters, so Arabic shaping stays intact. */}
        <p id="intro-tagline" className="intro-tagline">
          {t.tagline.map((word, index) => <Fragment key={word}>{index > 0 && ' '}<span style={{ '--w': index } as React.CSSProperties}>{word}</span></Fragment>)}
        </p>
        <p className="intro-welcome">{t.welcome}</p>

        <div className="intro-actions">
          <button ref={primaryRef} type="button" className="intro-enter" onClick={() => enter(true)} disabled={phase === 'boot'}>
            <span>{t.enter}</span>
            <Volume2 size={18} aria-hidden="true" />
            <ArrowRight size={18} aria-hidden="true" className="flip-rtl" />
          </button>
          <button type="button" className="intro-quiet" onClick={() => enter(false)} disabled={phase === 'boot'}>
            <span>{t.quiet}</span>
            <VolumeX size={15} aria-hidden="true" />
          </button>
          <p className="intro-hint">{t.hint}</p>
        </div>
      </div>
    </div>
  );
}
