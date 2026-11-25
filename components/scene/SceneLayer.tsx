'use client';

import dynamic from 'next/dynamic';
import { Component, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useExperience, type QualityTier } from '@/lib/store';
import { useI18n } from '@/components/i18n/I18nProvider';

const SignalScene = dynamic(() => import('./SignalScene'), { ssr: false });

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

type Capability = { webgl: boolean; quality: QualityTier; reduced: boolean };

function readCapability(): Capability {
  const canvas = document.createElement('canvas');
  let webgl = false;
  try { webgl = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl')); } catch { webgl = false; }
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = window.innerWidth < 900;
  const weak = (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || (navigator.hardwareConcurrency ?? 8) <= 4 || Boolean(nav.connection?.saveData);
  return {
    webgl,
    quality: (coarse && small) || weak ? 'low' : 'high',
    reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
}

let cached: Capability | null = null;
const noop = () => () => {};
const getCapability = () => (cached ??= readCapability());

function usePageVisible() {
  return useSyncExternalStore(
    listener => { document.addEventListener('visibilitychange', listener); return () => document.removeEventListener('visibilitychange', listener); },
    () => !document.hidden,
    () => true,
  );
}

/** Static stand-in for the sculpture: shown while loading, without WebGL, or after a GPU failure. */
function SceneFallback({ failed, onRetry }: { failed: boolean; onRetry: () => void }) {
  const { dict } = useI18n();
  return (
    <div className="scene-fallback">
      <div className="fallback-core" />
      {failed && <button type="button" className="scene-retry" onClick={onRetry}>{dict.scene.retry}</button>}
    </div>
  );
}

export function SceneLayer() {
  const { dir } = useI18n();
  const capability = useSyncExternalStore(noop, getCapability, () => null);
  const motionPaused = useExperience(state => state.motionPaused);
  // During a first-visit intro the scene is hidden; building it then would compete with the
  // intro animation. It starts once the Enter buttons appear, so it is ready when the iris opens.
  const introSettled = useExperience(state => state.introReady || state.introDone);
  const visible = usePageVisible();
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);

  // Mount the renderer after first paint so it never competes with the intro or LCP image.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((callback: () => void) => window.setTimeout(callback, 300));
    const handle = idle(() => setReady(true));
    return () => { if (window.cancelIdleCallback && typeof handle === 'number') window.cancelIdleCallback(handle); };
  }, []);

  const canRender = Boolean(capability?.webgl) && ready && introSettled && !failed;
  const animate = !motionPaused && visible && !capability?.reduced;

  return (
    <div className="scene-layer" aria-hidden={failed ? undefined : true}>
      {!canRender && <SceneFallback failed={failed} onRetry={() => { setFailed(false); setAttempt(value => value + 1); }} />}
      {canRender && capability && (
        <SceneBoundary key={attempt} onError={() => setFailed(true)}>
          <SignalScene mirror={dir === 'rtl'} quality={capability.quality} frameloop={animate ? 'always' : 'demand'} onContextLost={() => setFailed(true)} />
        </SceneBoundary>
      )}
    </div>
  );
}
