'use client';

import { useEffect, useRef } from 'react';
import { getState, subscribe } from '@/lib/store';

/**
 * A lime-to-emerald ribbon that follows a precise pointer and dissolves within
 * half a second — a restrained reinterpretation of a painted brush trail.
 * The native cursor stays visible and untouched; the canvas never receives events.
 * Runs only for fine pointers, without reduced motion, while motion is not paused,
 * and its frame loop sleeps whenever the pointer is still.
 */
type Sample = { x: number; y: number; t: number };

const LIFE = 520;
const MAX_WIDTH = 9;

export function SignalTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const samples: Sample[] = [];
    let frame = 0;
    let ratio = 1;

    const enabled = () => finePointer.matches && !reduced.matches && !getState().motionPaused && getState().introDone;

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * ratio);
      canvas.height = Math.round(window.innerHeight * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      frame = 0;
      const now = performance.now();
      while (samples.length && now - samples[0].t > LIFE) samples.shift();
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (samples.length > 2) {
        // Build the ribbon edges from smoothed normals; width tapers toward the tail.
        const left: [number, number][] = [];
        const right: [number, number][] = [];
        for (let index = 0; index < samples.length; index += 1) {
          const previous = samples[Math.max(0, index - 1)];
          const next = samples[Math.min(samples.length - 1, index + 1)];
          const dx = next.x - previous.x;
          const dy = next.y - previous.y;
          const length = Math.hypot(dx, dy) || 1;
          const age = 1 - (now - samples[index].t) / LIFE;
          const along = index / (samples.length - 1);
          const width = MAX_WIDTH * Math.sin(Math.min(1, along * 1.15) * Math.PI * 0.5) * Math.max(0, age);
          left.push([samples[index].x - (dy / length) * width, samples[index].y + (dx / length) * width]);
          right.push([samples[index].x + (dy / length) * width, samples[index].y - (dx / length) * width]);
        }
        const tail = samples[0];
        const head = samples[samples.length - 1];
        const gradient = context.createLinearGradient(tail.x, tail.y, head.x, head.y);
        gradient.addColorStop(0, 'rgba(31,122,85,0)');
        gradient.addColorStop(0.55, 'rgba(62,230,160,0.35)');
        gradient.addColorStop(1, 'rgba(200,255,61,0.78)');
        context.beginPath();
        context.moveTo(left[0][0], left[0][1]);
        for (let index = 1; index < left.length; index += 1) context.lineTo(left[index][0], left[index][1]);
        for (let index = right.length - 1; index >= 0; index -= 1) context.lineTo(right[index][0], right[index][1]);
        context.closePath();
        context.fillStyle = gradient;
        context.fill();
      }

      if (samples.length) frame = requestAnimationFrame(draw);
    };

    const wake = () => { if (!frame) frame = requestAnimationFrame(draw); };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      if (!enabled()) { samples.length = 0; return; }
      samples.push({ x: event.clientX, y: event.clientY, t: performance.now() });
      if (samples.length > 48) samples.shift();
      wake();
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    const unsubscribe = subscribe(() => { if (!enabled()) { samples.length = 0; wake(); } });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      unsubscribe();
    };
  }, []);

  return <canvas ref={canvasRef} className="signal-trail" aria-hidden="true" />;
}
