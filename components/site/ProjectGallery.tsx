'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ImageOff, Maximize2 } from 'lucide-react';
import type { ProjectImage } from '@/types';
import { useI18n } from '@/components/i18n/I18nProvider';
import { format } from '@/i18n';
import styles from './project.module.css';

type Props = { images: ProjectImage[]; title: string; imageNote?: string; isDesignConcept?: boolean };

export default function ProjectGallery({ images, title, imageNote, isDesignConcept = false }: Props) {
  const { dict, dir } = useI18n();
  const t = dict.caseStudy.gallery;
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(0);
  const current = images[selected];
  const openImage = (index: number) => { setSelected(index); dialog.current?.showModal(); };
  const step = (direction: number) => setSelected(index => (index + direction + images.length) % images.length);
  // Arrow keys follow reading direction: in Arabic, the left arrow moves forward.
  const forwardKey = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
  const backKey = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';

  if (!images.length) {
    return (
      <section id="gallery" className={styles.mediaFallback} aria-label={format(t.media, { title })}>
        <ImageOff size={28} aria-hidden="true" />
        <p>{t.none}</p>
        <span>{imageNote}</span>
        <a href="#overview">{t.readHow}</a>
      </section>
    );
  }

  const [first, ...rest] = images;
  return (
    <section id="gallery" className={styles.gallery} aria-label={format(isDesignConcept ? t.designLabel : t.screenshots, { title })}>
      <div className={styles.stage}>
        <div className={styles.stageBar} aria-hidden="true"><i /><i /><i /><span>{isDesignConcept ? t.design : t.actual}</span></div>
        <button className={styles.heroImage} onClick={() => openImage(0)} aria-label={format(t.enlargeAria, { alt: first.alt })}>
          <Image src={first.src} alt={first.alt} width={first.width} height={first.height} priority sizes="(max-width: 900px) 94vw, 1240px" />
          <span className={styles.enlarge}><Maximize2 size={14} aria-hidden="true" /> {t.enlarge}</span>
        </button>
      </div>
      {imageNote && <p className={styles.mediaNote}>{imageNote}</p>}
      {rest.length > 0 && (
        <div className={styles.thumbnails}>
          {rest.map((item, index) => (
            <figure key={item.src}>
              <button onClick={() => openImage(index + 1)} aria-label={format(t.enlargeAria, { alt: item.alt })} data-tall={item.height > item.width}>
                <Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes="(max-width: 640px) 88vw, 400px" />
              </button>
              <figcaption>{item.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}
      <dialog
        ref={dialog}
        className={styles.dialog}
        aria-label={format(t.dialog, { title })}
        onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        onKeyDown={event => { if (event.key === forwardKey) step(1); if (event.key === backKey) step(-1); }}
      >
        {current && (
          <>
            <div className={styles.dialogControls}>
              <span>{format(t.counter, { title, n: selected + 1, total: images.length })}</span>
              <button onClick={() => dialog.current?.close()} aria-label={t.close}><X size={20} /></button>
            </div>
            <div className={styles.dialogImage}><Image src={current.src} alt={current.alt} width={current.width} height={current.height} sizes="95vw" /></div>
            <div className={styles.dialogFooter}>
              <p>{current.caption}</p>
              {images.length > 1 && (
                <div>
                  <button onClick={() => step(-1)} aria-label={t.previous}><ChevronLeft size={20} className="flip-rtl" /></button>
                  <button onClick={() => step(1)} aria-label={t.next}><ChevronRight size={20} className="flip-rtl" /></button>
                </div>
              )}
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
