import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check, Github, Lock } from 'lucide-react';
import { projects } from '@/data/projects';
import { StatusBadge, hasArabic } from '@/components/home/StatusBadge';
import { LanguageSwitch } from '@/components/i18n/LanguageSwitch';
import { SITE_URL, alternates, localePath, type Locale } from '@/i18n/config';
import { format, getDictionary } from '@/i18n';
import { getAllProjects } from '@/i18n/projects';
import ProjectGallery from './ProjectGallery';
import { MotionDirector } from '@/components/motion/MotionDirector';
import { RevealText } from '@/components/motion/RevealText';
import styles from './project.module.css';

export function projectMetadata(slug: string, locale: Locale): Metadata {
  const t = getDictionary(locale).caseStudy;
  const project = getAllProjects(locale).find(item => item.slug === slug);
  if (!project) return { title: t.notFound };
  const title = format(t.metaTitle, { title: project.title });
  const path = `/projects/${project.slug}`;
  const site = locale === 'ar' ? 'يوسف الألفي' : 'Youssef Elalfy';
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description: project.description,
    alternates: alternates(path, locale),
    openGraph: { title: `${title} | ${site}`, description: project.description, type: 'article', url: localePath(locale, path), locale: locale === 'ar' ? 'ar_EG' : 'en_US', images: project.image ? [{ url: project.image, alt: project.title }] : ['/opengraph-image'] },
    twitter: { card: 'summary_large_image', title: `${title} | ${site}`, description: project.description, images: project.image ? [project.image] : ['/opengraph-image'] },
  };
}

export function ProjectPage({ slug, locale }: { slug: string; locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.caseStudy;
  const all = getAllProjects(locale);
  const project = all.find(item => item.slug === slug);
  if (!project) notFound();
  const isPrimary = projects.some(item => item.id === project.id);
  const pool = isPrimary ? all.filter(item => projects.some(primary => primary.id === item.id)) : all;
  const next = pool[(pool.findIndex(item => item.id === project.id) + 1) % pool.length];
  const isConcept = project.status === 'Design concept';
  const path = `/projects/${project.slug}`;

  return (
      <div className={styles.page} style={{ '--accent': project.accent ?? '#c8ff3d' } as React.CSSProperties}>
        <a className={styles.skipLink} href="#overview">{t.skip}</a>
        <header className={styles.header}>
          <Link href={localePath(locale, '/')} className={styles.brand} aria-label={t.home} dir="ltr">ELALFY<span>.</span></Link>
          <div className={styles.headerEnd}>
            <div className={styles.langCapsule}><LanguageSwitch path={path} className="in-case" /></div>
            <Link href={localePath(locale, '/') + '#work'} className={styles.back}><ArrowLeft size={16} aria-hidden="true" className="flip-rtl" /> {t.allWork}</Link>
          </div>
        </header>

        <main className={styles.main}>
          <section className={styles.hero} aria-labelledby="project-title">
            <p className={styles.kicker} data-reveal="stagger">
              {project.aka && (hasArabic(project.aka) ? <span lang="ar" dir="rtl" className={styles.aka}>{project.aka}</span> : <span className={styles.aka} dir="ltr">{project.aka}</span>)}
              <span>{project.category}</span>
              <StatusBadge status={project.status} labels={dict.status} />
            </p>
            <RevealText as="h1" id="project-title" text={project.title} suffix={<span aria-hidden="true" className={styles.titleDot}>.</span>} />
            <div className={styles.heroCopy} data-reveal="stagger">
              {project.tagline && <p className={styles.tagline}>{project.tagline}</p>}
              <p className={styles.description}>{project.description}</p>
            </div>

            <dl className={styles.facts} data-reveal="stagger">
              <div><dt>{t.myPart}</dt><dd>{project.role}</dd></div>
              <div><dt>{t.status}</dt><dd>{project.status && dict.status[project.status]}</dd></div>
              <div><dt>{t.builtWith}</dt><dd><ul className={styles.stack}>{project.technologies.map(tech => <li key={tech} dir="ltr">{tech}</li>)}</ul></dd></div>
            </dl>

            <div className={styles.actions} data-reveal="fade">
              {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" className={styles.primary}>{project.live_kind === 'website' ? dict.work.liveWebsite : dict.work.liveDemo} <ArrowUpRight size={17} aria-hidden="true" className="flip-rtl" /><span className="sr-only">{dict.work.newTab}</span></a>}
              {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className={project.live_url ? styles.secondary : styles.primary}><Github size={17} aria-hidden="true" /> {t.source}<span className="sr-only">{dict.work.newTab}</span></a>}
              {project.behance_url && <a href={project.behance_url} target="_blank" rel="noopener noreferrer" className={styles.secondary}>{t.behance} <ArrowUpRight size={16} aria-hidden="true" className="flip-rtl" /></a>}
              {project.source_note && <span className={styles.private}><Lock size={14} aria-hidden="true" /> {project.source_note}</span>}
              {!project.live_url && !project.behance_url && <span className={styles.private}>{t.noPublicDemo}</span>}
            </div>
          </section>

          <ProjectGallery images={project.gallery ?? []} title={project.title} imageNote={project.image_note} isDesignConcept={isConcept} film={project.film} />

          <section id="overview" className={styles.story} aria-labelledby="story-purpose">
            <RevealText as="h2" id="story-purpose" text={t.whyExists} />
            <div className={styles.prose}>
              <p className={styles.lead} data-reveal="fade">{project.purpose ?? project.description}</p>
              <p data-reveal="fade">{format(t.myPartLine, { role: locale === 'ar' ? project.role ?? '' : (project.role ?? '').toLowerCase() })}</p>
            </div>
          </section>

          <section className={styles.story} aria-labelledby="story-build">
            <RevealText as="h2" id="story-build" text={isConcept ? t.theDesign : t.howBuilt} />
            <div className={styles.prose}>
              <p data-reveal="fade">{project.architecture}</p>
              <RevealText as="h3" text={isConcept ? t.explores : t.implemented} />
              <ul className={styles.features} data-reveal="fade">{project.features?.map(feature => <li key={feature}><Check size={16} aria-hidden="true" /><span>{feature}</span></li>)}</ul>
            </div>
          </section>

          {project.challenges && project.challenges.length > 0 && (
            <section className={styles.story} aria-labelledby="story-decisions">
              <RevealText as="h2" id="story-decisions" text={t.decisions} />
              <div className={styles.decisions} data-reveal="stagger">
                {project.challenges.map(challenge => <article key={challenge.title}><h3>{challenge.title}</h3><p>{challenge.solution}</p></article>)}
              </div>
            </section>
          )}

          <section className={styles.statusNote} aria-labelledby="project-status">
            <RevealText as="h2" id="project-status" text={t.whereStands} />
            <StatusBadge status={project.status} labels={dict.status} />
            <p data-reveal="fade">{project.status_note}</p>
          </section>

          <nav className={styles.next} aria-label={t.nextLabel} data-reveal="fade">
            <span>{t.next}</span>
            <Link href={localePath(locale, `/projects/${next.slug}`)} style={{ '--next': next.accent ?? '#c8ff3d' } as React.CSSProperties}><bdi>{next.title}</bdi><ArrowUpRight size={36} aria-hidden="true" className="flip-rtl" /></Link>
            <Link href={localePath(locale, '/') + '#contact'} className={styles.secondary}>{t.talk} <ArrowUpRight size={16} aria-hidden="true" className="flip-rtl" /></Link>
          </nav>
        </main>

        <footer className={styles.footer}>
          <span>{format(dict.footer.rights, { year: new Date().getFullYear() })}</span>
          <Link href={localePath(locale, '/') + '#work'}>{t.backAll}</Link>
        </footer>
        <MotionDirector />
      </div>
  );
}
