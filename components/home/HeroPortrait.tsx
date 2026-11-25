'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { getState } from '@/lib/store';
import { useI18n } from '@/components/i18n/I18nProvider';

/**
 * The owner's real photograph, unretouched, staged in a glass frame.
 * Effects live only around the photo (rim light, edge grade, a glass plate
 * behind it) so the face is never covered or altered.
 */
export function HeroPortrait() {
  const { dict } = useI18n();
  const figure = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = figure.current;
    if (!node) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      node.style.setProperty('--rx', `${(-y * 4).toFixed(2)}deg`);
      node.style.setProperty('--ry', `${(x * 5).toFixed(2)}deg`);
      node.style.setProperty('--mx', `${(50 + x * 18).toFixed(1)}%`);
    };
    const onMove = (event: PointerEvent) => {
      if (!fine.matches || reduced.matches || getState().motionPaused) return;
      x = (event.clientX / window.innerWidth) * 2 - 1;
      y = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(frame); };
  }, []);

  return (
    <figure ref={figure} className="portrait">
      <div className="portrait-plate" aria-hidden="true" />
      <div className="portrait-frame">
        <Image
          src="/images/profile/youssef-elalfy.webp"
          alt={dict.hero.portraitAlt}
          fill
          priority
          sizes="(max-width: 900px) 80vw, 36vw"
          className="portrait-photo"
        />
        <span className="portrait-grade" aria-hidden="true" />
        <span className="portrait-sheen" aria-hidden="true" />
      </div>
      <figcaption className="portrait-tag">
        <span className="status-dot" aria-hidden="true" />
        {dict.hero.portraitTag}
      </figcaption>
    </figure>
  );
}
