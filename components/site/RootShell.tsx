import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@/app/globals.css';
import { I18nProvider } from '@/components/i18n/I18nProvider';
import { LOCALE_KEY, SITE_URL, alternates, dirOf, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { fontVariables } from './fonts';

export const viewport: Viewport = {
  themeColor: '#040605',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export function siteMetadata(locale: Locale): Metadata {
  const t = getDictionary(locale).meta;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.title, template: locale === 'ar' ? '%s | يوسف الألفي' : '%s | Youssef Elalfy' },
    description: t.description,
    applicationName: t.siteName,
    authors: [{ name: 'Youssef Elalfy', url: SITE_URL }],
    creator: 'Youssef Elalfy',
    keywords: ['Youssef Elalfy', 'يوسف الألفي', 'Full-Stack Developer', 'Creative Developer', 'AI agents', 'Next.js', 'React', 'TypeScript', 'Laravel', 'Supabase', 'Three.js', 'Egypt'],
    alternates: alternates('/', locale),
    openGraph: {
      title: t.title,
      description: t.ogDescription,
      url: alternates('/', locale).canonical,
      siteName: t.siteName,
      locale: t.ogLocale,
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_EG'],
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: t.title, description: t.twitterDescription, images: ['/opengraph-image'] },
    robots: { index: true, follow: true },
  };
}

/**
 * Runs before first paint: hides the intro for returning visitors, applies a paused-motion
 * preference, and — on English URLs only — honours a remembered Arabic choice.
 * Arabic URLs are never redirected away, so a shared /ar link always opens in Arabic.
 */
function prePaint(locale: Locale) {
  const redirect = locale === 'en'
    ? `if(localStorage.getItem('${LOCALE_KEY}')==='ar'&&!/[?&]lang=en/.test(location.search)){location.replace('/ar'+(location.pathname==='/'?'':location.pathname)+location.hash);return;}`
    : '';
  // data-motion='ready' enables the hidden starting state of scroll reveals (lib/motion.ts). It is
  // never set under reduced motion, and it is removed again if the motion module has not started
  // within 4.5 s, so text can never stay hidden.
  const motion = `if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.dataset.motion='ready';setTimeout(function(){if(!window.__elalfyMotion)delete d.dataset.motion;},4500);}`;
  return `(function(){var d=document.documentElement;try{${redirect}${motion}d.dataset.intro=sessionStorage.getItem('elalfy_intro_seen')?'skip':'show';if(localStorage.getItem('elalfy_motion_paused')==='1')d.setAttribute('data-motion-paused','');}catch(e){d.dataset.intro='skip';}})();`;
}

function personSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: locale === 'ar' ? 'يوسف الألفي' : 'Youssef Elalfy',
    alternateName: locale === 'ar' ? 'Youssef Elalfy' : 'يوسف الألفي',
    jobTitle: locale === 'ar' ? 'مطوّر Full-Stack ومهندس واجهات إبداعي' : 'Full-Stack Developer & Creative Front-End Engineer',
    url: SITE_URL + (locale === 'ar' ? '/ar' : ''),
    image: `${SITE_URL}/images/profile/youssef-elalfy-close.webp`,
    sameAs: ['https://github.com/Youssef-Elalfy', 'https://www.linkedin.com/in/youssef-elalfy1', 'https://www.behance.net/Youssef-Elalfy'],
    knowsAbout: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Fastify', 'Laravel', 'PHP', 'PostgreSQL', 'MySQL', 'Supabase', 'Three.js', 'AI agents', 'Tool calling'],
  };
}

export function RootShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html lang={locale === 'ar' ? 'ar' : 'en'} dir={dirOf(locale)} className={fontVariables} suppressHydrationWarning>
      {/* eslint-disable-next-line @next/next/no-head-element -- this is the App Router root layout, shared by the en and ar route groups */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaint(locale) }} />
        <noscript><style>{'.intro{display:none!important}'}</style></noscript>
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema(locale)) }} />
        <I18nProvider locale={locale} dict={getDictionary(locale)}>{children}</I18nProvider>
      </body>
    </html>
  );
}
