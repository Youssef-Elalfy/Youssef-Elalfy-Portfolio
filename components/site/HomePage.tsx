import { IntroGate } from '@/components/intro/CinematicIntro';
import { SiteNav } from '@/components/nav/SiteNav';
import { SceneLayer } from '@/components/scene/SceneLayer';
import { SignalTrail } from '@/components/SignalTrail';
import { SiteFooter } from '@/components/SiteFooter';
import { MotionDirector } from '@/components/motion/MotionDirector';
import { Hero } from '@/components/home/Hero';
import { AboutSection, ContactSection, ExpertiseSection, WorkSection } from '@/components/home/Sections';
import type { Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';

export function HomePage({ locale }: { locale: Locale }) {
  return (
    <>
      <IntroGate />
      <SceneLayer />
      <SignalTrail />
      <div id="site" className="site">
        <a className="skip-link" href="#main">{getDictionary(locale).skipToContent}</a>
        <SiteNav />
        <main id="main">
          <Hero locale={locale} />
          <WorkSection locale={locale} />
          <ExpertiseSection locale={locale} />
          <AboutSection locale={locale} />
          <ContactSection locale={locale} />
        </main>
        <SiteFooter />
      </div>
      <MotionDirector />
    </>
  );
}
