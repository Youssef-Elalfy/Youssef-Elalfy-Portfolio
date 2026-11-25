'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { ProjectFilm } from '@/types';
import { useI18n } from '@/components/i18n/I18nProvider';
import styles from './project.module.css';

type ConnectionNavigator = Navigator & { connection?: { saveData?: boolean } };

/**
 * A real project recording shown as a living screenshot: muted, inline and looping, with no native
 * controls. Nothing is downloaded until the frame approaches the viewport; it plays while at least a
 * third of it is visible and pauses as soon as it leaves. Reduced motion and data saving turn
 * autoplay off, and a blocked autoplay falls back to the same small play control.
 */
export function InlineFilm({ film }: { film: ProjectFilm }) {
  const { dict } = useI18n();
  const t = dict.caseStudy.gallery;
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [manual, setManual] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = (navigator as ConnectionNavigator).connection?.saveData === true;
    if (reduce || saveData) {
      // Deferred so the server-rendered poster frame hydrates unchanged first.
      const frame = requestAnimationFrame(() => setManual(true));
      return () => cancelAnimationFrame(frame);
    }

    // Start fetching a little before the frame is reached, so the first frame is ready on arrival.
    const approach = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.preload = 'auto'; approach.disconnect(); }
    }, { rootMargin: '0px 0px 60% 0px' });
    const visibility = new IntersectionObserver(([entry]) => {
      if (entry.intersectionRatio >= 0.35 && !userPaused.current) {
        node.play().catch(() => setManual(true));
      } else if (entry.intersectionRatio < 0.35) {
        node.pause();
      }
    }, { threshold: [0, 0.35, 0.7] });
    approach.observe(node);
    visibility.observe(node);
    return () => { approach.disconnect(); visibility.disconnect(); node.pause(); };
  }, []);

  const toggle = () => {
    const node = video.current;
    if (!node) return;
    if (node.paused) { userPaused.current = false; node.preload = 'auto'; node.play().catch(() => undefined); }
    else { userPaused.current = true; node.pause(); }
  };

  return (
    <figure className={styles.film}>
      <div className={styles.filmFrame} data-reveal="media">
        <video
          ref={video}
          src={film.video}
          poster={film.poster}
          width={film.width}
          height={film.height}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          aria-label={film.alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <button
          type="button"
          className={styles.filmToggle}
          data-manual={manual && !playing ? '' : undefined}
          onClick={toggle}
          aria-label={playing ? t.filmPause : t.filmPlay}
        >
          {playing ? <Pause size={15} aria-hidden="true" /> : <Play size={15} aria-hidden="true" />}
        </button>
      </div>
      <figcaption>{film.caption}</figcaption>
    </figure>
  );
}
