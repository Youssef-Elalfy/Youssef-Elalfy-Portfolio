import Link from 'next/link';
import { ArrowDown } from 'lucide-react';
import { localePath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { HeroPortrait } from './HeroPortrait';

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).hero;
  return (
    <section id="home" className="hero" aria-labelledby="hero-name">
      <div className="hero-grid shell">
        <ul className="hero-roles" aria-label={t.rolesLabel}>
          {t.roles.map(role => <li key={role}>{role}</li>)}
        </ul>

        <HeroPortrait />

        <h1 id="hero-name" className="hero-name" data-reveal="exit">
          <span className="name-line"><span>{t.name[0]}</span></span>
          <span className="name-line name-indent"><span>{t.name[1]}</span></span>
        </h1>

        <div className="hero-copy">
          <p className="hero-lede" data-reveal="exit">{t.lede}</p>
          <div className="hero-actions" data-reveal="exit">
            <a className="btn btn-lime" href="#work">{t.explore}</a>
            <a className="btn btn-glass" href="#contact">{t.talk}</a>
          </div>
          <Link className="hero-now" href={localePath(locale, '/projects/sadeeman-ai')}>
            <span className="now-label">{t.nowLabel}</span>
            <span><b>{t.nowName}</b>{t.nowRest}</span>
          </Link>
        </div>
      </div>

      <div className="hero-foot shell">
        <span>{t.foot}</span>
        <a className="scroll-cue" href="#work"><ArrowDown size={15} aria-hidden="true" /> {t.scrollCue}</a>
      </div>
    </section>
  );
}
