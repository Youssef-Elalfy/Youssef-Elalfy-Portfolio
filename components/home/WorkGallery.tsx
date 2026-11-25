'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, BadgeCheck, Github, Globe, Lock, ImageOff } from 'lucide-react';
import { LIME, setState } from '@/lib/store';
import { useI18n } from '@/components/i18n/I18nProvider';
import { localePath } from '@/i18n/config';
import { format } from '@/i18n';
import { refreshMotion, useRevealScope } from '@/lib/motion';
import { RevealText } from '@/components/motion/RevealText';
import type { Project, ProjectFilter } from '@/types';
import { StatusBadge, hasArabic } from './StatusBadge';

type Filter = ProjectFilter | 'all';
const FILTERS: Filter[] = ['all', 'client', '3d', 'fullstack-ai'];

function focusHandlers(project: Project) {
  const on = () => setState({ accent: project.accent ?? LIME });
  const off = () => setState({ accent: LIME });
  return { onPointerEnter: on, onPointerLeave: off, onFocus: on, onBlur: off };
}

function Aka({ value }: { value?: string }) {
  if (!value) return null;
  return hasArabic(value)
    ? <span className="aka" lang="ar" dir="rtl">{value}</span>
    : <span className="aka" dir="ltr">{value}</span>;
}

function Exhibit({ project, index }: { project: Project; index: number }) {
  const { locale, dict } = useI18n();
  const t = dict.work;
  const gallery = project.gallery ?? [];
  const main = gallery.find(item => item.width >= item.height) ?? gallery[0];
  const phone = gallery.find(item => item.height > item.width);
  const host = project.live_url ? new URL(project.live_url).host : project.client ? t.clientHosted : project.github_url ? 'github.com' : t.localBuild;
  const caseHref = localePath(locale, `/projects/${project.slug}`);
  const ref = useRef<HTMLElement>(null);
  useRevealScope(ref);
  return (
    <article ref={ref} data-reveal-scope="" className="exhibit" data-side={index % 2 ? 'right' : 'left'} style={{ '--accent': project.accent ?? LIME } as React.CSSProperties} aria-labelledby={`exhibit-${project.slug}`} {...focusHandlers(project)}>
      <div className="exhibit-media" data-reveal="drift" data-drift-amount="4">
        <Link href={caseHref} className="stage" aria-label={format(t.caseStudyAria, { title: project.title })} tabIndex={-1}>
          <span className="stage-bar" aria-hidden="true"><i /><i /><i /><span dir="ltr">{host}</span></span>
          {main && <span className="stage-shot" data-reveal="media"><Image src={main.src} alt={main.alt} width={main.width} height={main.height} sizes="(max-width: 900px) 92vw, 52vw" /></span>}
        </Link>
        {phone && (
          <span className="phone" aria-hidden="true">
            <Image src={phone.src} alt="" width={phone.width} height={phone.height} sizes="160px" />
          </span>
        )}
      </div>
      <div className="exhibit-info">
        <p className="exhibit-kicker" data-reveal="stagger">{project.client && <span className="client-badge"><BadgeCheck size={14} aria-hidden="true" />{t.clientBadge}</span>}<Aka value={project.aka} /><span>{project.category}</span></p>
        <RevealText as="h3" id={`exhibit-${project.slug}`} text={project.title} />
        <p className="exhibit-tagline" data-reveal="fade">{project.tagline}</p>
        <p className="exhibit-desc" data-reveal="fade">{project.description}</p>
        <dl className="exhibit-facts" data-reveal="stagger">
          <div><dt>{t.status}</dt><dd><StatusBadge status={project.status} labels={dict.status} /></dd></div>
          <div><dt>{t.myPart}</dt><dd>{project.role}</dd></div>
        </dl>
        <ul className="stack" aria-label={t.technologies} data-reveal="stagger">{project.technologies.slice(0, 8).map(tech => <li key={tech}>{tech}</li>)}</ul>
        <div className="exhibit-actions">
          <Link className="btn btn-lime btn-sm" href={caseHref}>{t.caseStudy}</Link>
          {project.live_url && <a className="btn btn-glass btn-sm" href={project.live_url} target="_blank" rel="noopener noreferrer">{project.live_kind === 'website' ? t.liveWebsite : t.liveDemo} <ArrowUpRight size={15} aria-hidden="true" className="flip-rtl" /><span className="sr-only">{t.newTab}</span></a>}
          {project.website_url && <a className="btn btn-glass btn-sm" href={project.website_url} target="_blank" rel="noopener noreferrer"><Globe size={15} aria-hidden="true" /> {t.website}<span className="sr-only">{format(t.websiteFor, { title: project.title })}</span></a>}
          {project.github_url && <a className="btn btn-glass btn-sm" href={project.github_url} target="_blank" rel="noopener noreferrer"><Github size={15} aria-hidden="true" /> {t.source}<span className="sr-only">{format(t.sourceFor, { title: project.title })}</span></a>}
          {project.source_note && <span className="private-note"><Lock size={13} aria-hidden="true" />{project.source_note}</span>}
        </div>
      </div>
    </article>
  );
}

type MotionProps = { layout: boolean; transition: { duration: number; ease: readonly [number, number, number, number] }; initial?: { opacity: number; y: number }; animate?: { opacity: number; y: number }; exit?: { opacity: number; y: number } };

function IndexRow({ project, motionProps }: { project: Project; motionProps: MotionProps }) {
  const { locale, dict } = useI18n();
  const t = dict.work;
  return (
    <motion.li {...motionProps} className="index-row" style={{ '--accent': project.accent ?? LIME } as React.CSSProperties} {...focusHandlers(project)}>
      <Link href={localePath(locale, `/projects/${project.slug}`)} className="row-link">
        <span className="row-thumb" aria-hidden="true">
          {project.image ? <Image src={project.image} alt="" width={320} height={200} sizes="(max-width: 900px) 30vw, 280px" /> : <span className="row-nothumb"><ImageOff size={18} />{t.noScreenshot}</span>}
        </span>
        <span className="row-main">
          <span className="row-title"><span dir="ltr">{project.title}</span><Aka value={project.aka} /></span>
          <span className="row-tagline">{project.tagline}</span>
        </span>
        <span className="row-meta">
          <StatusBadge status={project.status} labels={dict.status} />
          <span className="row-stack" dir="ltr">{project.technologies.slice(0, 3).join(', ')}</span>
        </span>
        <ArrowUpRight className="row-arrow flip-rtl" size={22} aria-hidden="true" />
      </Link>
      {(project.live_url || project.github_url) && (
        <span className="row-links">
          {project.live_url && <a className="row-live" href={project.live_url} target="_blank" rel="noopener noreferrer">{t.liveShort} <ArrowUpRight size={13} aria-hidden="true" className="flip-rtl" /><span className="sr-only">{format(t.liveFor, { title: project.title })}</span></a>}
          {project.github_url && <a className="row-live" href={project.github_url} target="_blank" rel="noopener noreferrer"><Github size={13} aria-hidden="true" /> {t.source}<span className="sr-only">{format(t.sourceFor, { title: project.title })}</span></a>}
        </span>
      )}
    </motion.li>
  );
}

/** Receives projects already localized on the server, so only one language ships to the browser. */
export function WorkGallery({ projects, archived }: { projects: Project[]; archived: Project[] }) {
  const { locale, dict } = useI18n();
  const t = dict.work;
  const [filter, setFilter] = useState<Filter>('all');
  const reduce = useReducedMotion();
  const countFor = (item: Filter) => projects.filter(project => item === 'all' || project.filters?.includes(item)).length;
  const visible = projects.filter(project => filter === 'all' || project.filters?.includes(filter));
  const featured = visible.filter(project => project.featured);
  const rest = visible.filter(project => !project.featured);
  // Same props on server and client (useReducedMotion is false during SSR); reduced motion
  // only zeroes the duration below, which avoids a hydration mismatch in the style attribute.
  const enter = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 } };
  const ease = { duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] as const };

  // Filtering changes the page height; re-measure scroll triggers once the layout animation settles.
  // Not on first mount: the page-level director already measures, and an extra refresh could
  // interrupt a visitor's first anchor scroll.
  const firstFilter = useRef(true);
  useEffect(() => {
    if (firstFilter.current) { firstFilter.current = false; return; }
    const id = window.setTimeout(refreshMotion, 650);
    return () => window.clearTimeout(id);
  }, [filter]);

  return (
    <>
      <div className="filters" role="group" aria-label={t.filtersLabel}>
        {FILTERS.map(item => (
          <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>
            {filter === item && <motion.span layoutId="filter-lens" className="filter-lens" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 36 }} aria-hidden="true" />}
            <span>{t.filters[item]}</span>
            <span className="filter-count">{countFor(item)}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{format(visible.length === 1 ? t.showingOne : t.showing, { count: visible.length, filter: t.filters[filter] })}</p>

      <div className="exhibits">
        <AnimatePresence initial={false}>
          {featured.map((project, index) => (
            <motion.div key={project.id} layout={!reduce} {...enter} transition={ease}>
              <Exhibit project={project} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {rest.length > 0 && (
        <div className="index">
          <RevealText as="h3" className="index-heading" text={t.moreBuilds} />
          <ul>
            <AnimatePresence initial={false}>
              {rest.map(project => (
                <IndexRow key={project.id} project={project} motionProps={{ layout: !reduce, transition: ease, ...enter }} />
              ))}
            </AnimatePresence>
          </ul>
        </div>
      )}

      <div className="archive">
        <RevealText as="h3" className="archive-heading" text={t.archive} />
        <ul>
          {archived.map(project => (
            <li key={project.id}>
              <Link href={localePath(locale, `/projects/${project.slug}`)}>
                {project.image && <Image src={project.image} alt="" width={240} height={150} sizes="160px" />}
                <span><b dir="ltr">{project.title}</b><small>{project.status && dict.status[project.status]}</small></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
