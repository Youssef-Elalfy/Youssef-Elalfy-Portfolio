'use client';

import { getState, setState } from './store';

/**
 * Ambient sound from the original intro (`/audio/ambient-bg.mp3`).
 * Playback only ever starts from a visitor gesture, ramps in gently and
 * pauses while the tab is hidden.
 */
const SRC = '/audio/ambient-bg.mp3';
const TARGET_VOLUME = 0.22;
const PREF_KEY = 'elalfy_sound_pref';
/** Set while sound is on in this tab's session; lets a language switch bring it back. */
const SESSION_KEY = 'elalfy_sound_session';

let audio: HTMLAudioElement | null = null;
let fadeFrame = 0;
let visibilityBound = false;

function element() {
  if (typeof window === 'undefined') return null;
  if (!audio) {
    audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = 'none';
    audio.volume = 0;
  }
  if (!visibilityBound) {
    visibilityBound = true;
    document.addEventListener('visibilitychange', () => {
      if (!audio || !getState().soundOn) return;
      if (document.hidden) audio.pause();
      else audio.play().catch(() => setState({ soundOn: false, soundBlocked: true }));
    });
  }
  return audio;
}

function fadeTo(target: number, duration: number, done?: () => void) {
  const el = audio;
  if (!el) return;
  cancelAnimationFrame(fadeFrame);
  const from = el.volume;
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.volume = Math.max(0, Math.min(1, from + (target - from) * eased));
    if (t < 1) fadeFrame = requestAnimationFrame(step);
    else done?.();
  };
  fadeFrame = requestAnimationFrame(step);
}

export async function enableSound(rampMs = 1800): Promise<boolean> {
  const el = element();
  if (!el) return false;
  try {
    el.volume = 0;
    await el.play();
    setState({ soundOn: true, soundBlocked: false });
    try { localStorage.setItem(PREF_KEY, 'on'); sessionStorage.setItem(SESSION_KEY, 'on'); } catch { /* storage unavailable */ }
    fadeTo(TARGET_VOLUME, rampMs);
    return true;
  } catch {
    setState({ soundOn: false, soundBlocked: true });
    return false;
  }
}

export function disableSound(remember = true) {
  setState({ soundOn: false });
  if (remember) {
    try { localStorage.setItem(PREF_KEY, 'off'); sessionStorage.removeItem(SESSION_KEY); } catch { /* storage unavailable */ }
  }
  if (!audio) return;
  fadeTo(0, 500, () => audio?.pause());
}

export function toggleSound() {
  if (getState().soundOn) disableSound();
  else void enableSound(900);
}

/**
 * After a full page load in the same session (for example a language switch), browsers block
 * audio until the visitor interacts. If sound was on, it resumes on their first click or key —
 * never on a new visit, and never from a click on the sound controls themselves.
 */
export function resumeSoundOnGesture(): () => void {
  let wanted = false;
  try { wanted = sessionStorage.getItem(SESSION_KEY) === 'on'; } catch { wanted = false; }
  if (!wanted) return () => {};
  const resume = (event: Event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('.nav-controls, .intro')) return;
    stop();
    if (!getState().soundOn) void enableSound(1400);
  };
  const stop = () => {
    window.removeEventListener('pointerdown', resume, true);
    window.removeEventListener('keydown', resume, true);
  };
  window.addEventListener('pointerdown', resume, true);
  window.addEventListener('keydown', resume, true);
  return stop;
}
