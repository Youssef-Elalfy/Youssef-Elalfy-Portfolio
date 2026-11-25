export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export const SITE_URL = 'https://elalfy-portfolio.vercel.app';
export const LOCALE_KEY = 'elalfy_locale';

export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr');

/** Builds an internal path for a locale. English lives at the root; Arabic under /ar. */
export function localePath(locale: Locale, path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`;
  if (locale === 'en') return clean;
  return clean === '/' ? '/ar' : `/ar${clean}`;
}

/** Strips the locale prefix from a pathname. */
export function basePath(pathname: string) {
  if (pathname === '/ar' || pathname === '/ar/') return '/';
  return pathname.startsWith('/ar/') ? pathname.slice(3) : pathname;
}

/** hreflang alternates for a locale-independent path. */
export function alternates(path: string, locale: Locale) {
  return {
    canonical: localePath(locale, path),
    languages: { en: localePath('en', path), ar: localePath('ar', path), 'x-default': localePath('en', path) },
  };
}
