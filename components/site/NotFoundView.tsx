import Link from 'next/link';

type Copy = { lang: 'en' | 'ar'; title: string; text: string; home: string; work: string; homeHref: string };

const COPY: Record<'en' | 'ar', Copy> = {
  en: { lang: 'en', title: 'This page doesn’t exist.', text: 'The link may be old, or the address has a typo. Everything else is still here.', home: 'Back to the homepage', work: 'See the work', homeHref: '/' },
  ar: { lang: 'ar', title: 'هذه الصفحة غير موجودة.', text: 'ربما الرابط قديم، أو في العنوان خطأ مطبعي. كل شيء آخر ما زال هنا.', home: 'العودة إلى الرئيسية', work: 'شاهد الأعمال', homeHref: '/ar' },
};

/** Branded 404. `locales` decides which languages are shown (both for unmatched URLs). */
export function NotFoundView({ locales }: { locales: ('en' | 'ar')[] }) {
  return (
    <main className="not-found shell" id="main">
      <Link href={COPY[locales[0]].homeHref} className="nav-capsule nav-brand not-found-brand" dir="ltr">ELALFY<span>.</span></Link>
      <p className="not-found-code" aria-hidden="true">404</p>
      {locales.map((locale, index) => {
        const copy = COPY[locale];
        return (
          <section key={locale} lang={copy.lang} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="not-found-copy">
            {index === 0 ? <h1 className="display">{copy.title}</h1> : <h2 className="display">{copy.title}</h2>}
            <p>{copy.text}</p>
            <div className="hero-actions">
              <Link className="btn btn-lime" href={copy.homeHref}>{copy.home}</Link>
              <Link className="btn btn-glass" href={`${copy.homeHref}#work`}>{copy.work}</Link>
            </div>
          </section>
        );
      })}
    </main>
  );
}
