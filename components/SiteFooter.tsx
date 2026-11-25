'use client';

import { RotateCcw } from 'lucide-react';
import { replayIntro } from '@/components/intro/CinematicIntro';
import { useI18n } from '@/components/i18n/I18nProvider';
import { format } from '@/i18n';

export function SiteFooter() {
  const { dict } = useI18n();
  const t = dict.footer;
  return (
    <footer className="site-footer shell">
      <a className="footer-mark" href="#home" aria-label={t.backToTop} dir="ltr">ELALFY<span>.</span></a>
      <p>{t.tagline}</p>
      <div className="footer-actions">
        <button type="button" className="footer-replay" onClick={replayIntro}><RotateCcw size={14} aria-hidden="true" /> {t.replay}</button>
        <a href="#home">{t.backToTop}</a>
      </div>
      <small>{format(t.rights, { year: new Date().getFullYear() })}</small>
    </footer>
  );
}
