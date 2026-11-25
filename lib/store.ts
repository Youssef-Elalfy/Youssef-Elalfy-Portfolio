'use client';

import { useSyncExternalStore } from 'react';

/**
 * Tiny external store shared by the DOM interface and the WebGL scene.
 * The scene reads `getState()` inside its frame loop, so changes never
 * trigger React renders inside the canvas.
 */
export const LIME = '#c8ff3d';

export type QualityTier = 'low' | 'high';

export interface ExperienceState {
  /** The intro overlay has finished (or was skipped for a returning visitor). */
  introDone: boolean;
  /** The intro has finished loading and shows its Enter buttons (the 3D may start building). */
  introReady: boolean;
  /** Visitor asked to pause decorative motion. */
  motionPaused: boolean;
  /** Ambient sound is currently audible. */
  soundOn: boolean;
  /** Browser refused playback (autoplay policy, missing file). */
  soundBlocked: boolean;
  /** Tint applied to the 3D filaments, follows the focused project. */
  accent: string;
  /** Section currently in view. */
  section: string;
}

type Listener = () => void;

const MOTION_KEY = 'elalfy_motion_paused';

let state: ExperienceState = {
  introDone: false,
  introReady: false,
  motionPaused: false,
  soundOn: false,
  soundBlocked: false,
  accent: LIME,
  section: 'home',
};

const serverState = state;
const listeners = new Set<Listener>();

export function getState(): ExperienceState {
  return state;
}

export function setState(patch: Partial<ExperienceState>) {
  let changed = false;
  for (const key of Object.keys(patch) as (keyof ExperienceState)[]) {
    if (state[key] !== patch[key]) { changed = true; break; }
  }
  if (!changed) return;
  state = { ...state, ...patch };
  if ('motionPaused' in patch) {
    try { localStorage.setItem(MOTION_KEY, state.motionPaused ? '1' : '0'); } catch { /* storage unavailable */ }
    document.documentElement.toggleAttribute('data-motion-paused', state.motionPaused);
  }
  listeners.forEach(listener => listener());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function useExperience<T>(selector: (value: ExperienceState) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(serverState));
}

/** Restore persisted preferences once on the client. */
export function hydratePreferences() {
  try {
    if (localStorage.getItem(MOTION_KEY) === '1') setState({ motionPaused: true });
  } catch { /* storage unavailable */ }
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
