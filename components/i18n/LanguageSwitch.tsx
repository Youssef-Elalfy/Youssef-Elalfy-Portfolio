'use client';

import { motion, useReducedMotion } from 'motion/react';
import { LOCALE_KEY, localePath, locales, type Locale } from '@/i18n/config';
import { getState } from '@/lib/store';
import { useI18n } from './I18nProvider';

/**
 * EN | عربي. A real link to the same page in the other language: it keeps the
 * current project page and the section in view, and remembers the choice.
 * The intro has already been marked as seen, so switching never replays it.
 */
export function LanguageSwitch({ path, className = '' }: { path: string; className?: string }) {
  const { locale, dict } = useI18n();
  const reduce = useReducedMotion();

  const go = (target: Locale) => (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (target === locale) { event.preventDefault(); return; }
    try { localStorage.setItem(LOCALE_KEY, target); } catch { /* storage unavailable */ }
    // Keep the visitor where they are: same page, same section.
    const section = getState().section;
    const hash = path === '/' && section && section !== 'home' ? `#${section}` : window.location.hash;
    event.currentTarget.href = localePath(target, path) + hash;
  };

  return (
    <nav className={`lang-switch ${className}`} aria-label={dict.language.label}>
      {locales.map(item => (
        <a
          key={item}
          href={localePath(item, path)}
          hrefLang={item}
          lang={item}
          aria-current={item === locale ? 'true' : undefined}
          aria-label={item === 'en' ? dict.language.switchToEn : dict.language.switchToAr}
          onClick={go(item)}
          data-active={item === locale}
        >
          {item === locale && <motion.span layoutId={`lang-lens-${className}`} className="lang-lens" transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 34 }} aria-hidden="true" />}
          <span>{item === 'en' ? dict.language.en : dict.language.ar}</span>
        </a>
      ))}
    </nav>
  );
}
