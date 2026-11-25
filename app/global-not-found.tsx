import type { Metadata } from 'next';
import '@/app/globals.css';
import { NotFoundView } from '@/components/site/NotFoundView';
import { fontVariables } from '@/components/site/fonts';

export const metadata: Metadata = {
  title: 'Page not found | Youssef Elalfy',
  robots: { index: false, follow: true },
};

/** Unmatched URLs in either language: no locale is known here, so both are shown. */
export default function GlobalNotFound() {
  return (
    <html lang="en" dir="ltr" className={fontVariables}>
      <body>
        <NotFoundView locales={['en', 'ar']} />
      </body>
    </html>
  );
}
