'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { House, LayoutGrid, Cpu, UserRound, Send, Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { resumeSoundOnGesture, toggleSound } from '@/lib/audio';
import { hydratePreferences, setState, useExperience } from '@/lib/store';
import { useI18n } from '@/components/i18n/I18nProvider';
import { LanguageSwitch } from '@/components/i18n/LanguageSwitch';

const LINKS = [
  { id: 'home', icon: House },
  { id: 'work', icon: LayoutGrid },
  { id: 'expertise', icon: Cpu },
  { id: 'about', icon: UserRound },
  { id: 'contact', icon: Send },
] as const;

type SectionId = (typeof LINKS)[number]['id'];

/** Tracks which section sits under the upper third of the viewport. */
function useActiveSection() {
  const [active, setActive] = useState<SectionId>('home');
  useEffect(() => {
    const nodes = LINKS.map(link => document.getElementById(link.id)).filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = entry.target.id as SectionId;
        setActive(id);
        setState({ section: id });
      }
    }, { rootMargin: '-35% 0px -60% 0px' });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return active;
}

export function SiteNav() {
  const { dict } = useI18n();
  const t = dict.nav;
  const active = useActiveSection();
  const soundOn = useExperience(state => state.soundOn);
  const soundBlocked = useExperience(state => state.soundBlocked);
  const motionPaused = useExperience(state => state.motionPaused);
  const introDone = useExperience(state => state.introDone);
  const reduce = useReducedMotion();

  useEffect(() => { hydratePreferences(); }, []);
  useEffect(() => resumeSoundOnGesture(), []);

  const lens = reduce ? { duration: 0 } : { type: 'spring' as const, stiffness: 420, damping: 36, mass: 0.9 };
  const soundLabel = soundBlocked ? t.soundBlocked : soundOn ? t.soundOff : t.soundOn;
  const motionLabel = motionPaused ? t.motionResume : t.motionPause;

  return (
    <header className="site-nav" data-ready={introDone ? 'true' : 'false'}>
      <a className="nav-capsule nav-brand" href="#home" aria-label={t.brand} dir="ltr">
        ELALFY<span>.</span>
      </a>

      <nav className="nav-capsule nav-tabs" aria-label={t.main}>
        <ul>
          {LINKS.map(({ id, icon: Icon }) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={active === id ? 'location' : undefined} data-active={active === id}>
                {active === id && <motion.span layoutId="nav-lens" className="nav-lens" transition={lens} aria-hidden="true" />}
                <Icon size={15} aria-hidden="true" />
                <span>{t.links[id]}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav-end">
        <div className="nav-capsule nav-controls">
          <LanguageSwitch path="/" className="in-nav" />
          <span className="nav-divider" aria-hidden="true" />
          <button type="button" className="nav-icon" onClick={toggleSound} aria-pressed={soundOn} aria-label={soundLabel} title={soundLabel}>
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {soundOn && <span className="sound-bars" aria-hidden="true"><i /><i /><i /></span>}
          </button>
          <button type="button" className="nav-icon" onClick={() => setState({ motionPaused: !motionPaused })} aria-pressed={motionPaused} aria-label={motionLabel} title={motionLabel}>
            {motionPaused ? <Play size={15} /> : <Pause size={15} />}
          </button>
        </div>
        <a className="nav-cta" href="#contact">{t.cta}</a>
      </div>

      {/* Phone and small tablet: the same links as a thumb-reachable glass dock. */}
      <nav className="dock" aria-label={t.compact}>
        <ul>
          {LINKS.map(({ id, icon: Icon }) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={active === id ? 'location' : undefined} data-active={active === id}>
                {active === id && <motion.span layoutId="dock-lens" className="dock-lens" transition={lens} aria-hidden="true" />}
                <Icon size={19} aria-hidden="true" />
                <span>{t.links[id]}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
