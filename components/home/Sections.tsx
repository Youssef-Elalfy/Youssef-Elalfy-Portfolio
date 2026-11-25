import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { localePath, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { getAllProjects, getArchived, getProjects } from '@/i18n/projects';
import { RevealText } from '@/components/motion/RevealText';
import { ExpertiseExplorer } from './ExpertiseExplorer';
import { WorkGallery } from './WorkGallery';

export const LINKS = {
  email: 'youssefalfi94@gmail.com',
  github: 'https://github.com/Youssef-Elalfy',
  linkedin: 'https://www.linkedin.com/in/youssef-elalfy1',
  behance: 'https://www.behance.net/Youssef-Elalfy',
  whatsapp: 'https://wa.me/201061095152',
};

export function WorkSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).work;
  return (
    <section id="work" className="section work shell" aria-labelledby="work-title">
      <header className="section-head">
        <RevealText as="h2" id="work-title" className="display" text={t.title} />
        <p className="section-lede" data-reveal="fade">{t.lede}</p>
      </header>
      <WorkGallery projects={getProjects(locale)} archived={getArchived(locale)} />
    </section>
  );
}

/** Example projects per offering, in the same order as the dictionary's offerings. */
const offeringExamples: [string, string][][] = [
  [['UniFlow Campus', 'uniflow'], ['SAYNTRA', 'sayntra'], ['Penguin Academy', 'penguin-academy']],
  [['MASAR AI', 'masar-ai'], ['SADEEMAN AI', 'sadeeman-ai']],
  [['NOCTURNE', 'nocturne']],
  [['UniFlow Campus', 'uniflow'], ['MerchantFlow', 'merchantflow']],
  [['PARALL / 01', 'parall-01'], ['SENSORA', 'sensora']],
  [['Bella Tavola', 'bella-tavola'], ['design', 'ai-labs']],
];

export function ExpertiseSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).expertise;
  return (
    <section id="expertise" className="section expertise shell" aria-labelledby="expertise-title">
      <header className="section-head">
        <RevealText as="h2" id="expertise-title" className="display" text={t.title} />
        <p className="section-lede" data-reveal="fade">{t.lede}</p>
      </header>
      <ExpertiseExplorer projects={getAllProjects(locale).map(({ id, slug, title, category, status, accent }) => ({ id, slug, title, category, status, accent }))} />

      <div className="offer" aria-labelledby="offer-title">
        <RevealText as="h3" id="offer-title" className="offer-title" text={t.offerTitle} />
        <ul className="offer-list">
          {t.offerings.map((item, index) => (
            <li key={item.title}>
              <h4>{item.title}</h4>
              <p>{item.text}</p>
              <p className="offer-examples">
                <span>{t.seenIn}</span>
                {offeringExamples[index].map(([label, slug]) => <Link key={slug} href={localePath(locale, `/projects/${slug}`)}>{label === 'design' ? t.designStudies : label}</Link>)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function AboutSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).about;
  return (
    <section id="about" className="section about shell" aria-labelledby="about-title">
      <div className="about-grid">
        <figure className="about-portrait" data-reveal="drift" data-drift-amount="5">
          <div className="about-frame">
            <Image src="/images/profile/youssef-elalfy-close.webp" alt={t.portraitAlt} fill sizes="(max-width: 900px) 86vw, 30vw" />
            <span className="portrait-grade" aria-hidden="true" />
          </div>
          <figcaption>{t.caption}</figcaption>
        </figure>

        <div className="about-copy">
          <RevealText as="h2" id="about-title" className="display about-title" text={t.title} />
          <p className="about-lead" data-reveal="fade">{t.lead}</p>
          <p>{t.body}</p>
          <blockquote className="about-principle" data-reveal="fade">{t.principle}</blockquote>

          <div className="process" aria-labelledby="process-title">
            <h3 id="process-title">{t.processTitle}</h3>
            <ol>
              {t.process.map((step, index) => (
                <li key={step.title}><span className="step" aria-hidden="true">{index + 1}</span><b>{step.title}</b><p>{step.text}</p></li>
              ))}
            </ol>
          </div>

          <p className="about-learning">{t.learning}</p>

          <div className="about-links">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer"><Github size={16} aria-hidden="true" /> GitHub</a>
            <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} aria-hidden="true" /> LinkedIn</a>
            <a href={LINKS.behance} target="_blank" rel="noopener noreferrer">Behance <ArrowUpRight size={14} aria-hidden="true" className="flip-rtl" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ContactSection({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).contact;
  return (
    <section id="contact" className="section contact shell" aria-labelledby="contact-title">
      <div className="contact-grid">
        <div className="contact-copy">
          <RevealText as="h2" id="contact-title" className="display contact-title" text={t.title} />
          <p className="section-lede" data-reveal="fade">{t.lede}</p>
          <a className="contact-email" href={`mailto:${LINKS.email}`}><Mail size={20} aria-hidden="true" /><span dir="ltr">{LINKS.email}</span></a>
          <ul className="contact-links">
            <li><a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={16} aria-hidden="true" /> LinkedIn</a></li>
            <li><a href={LINKS.github} target="_blank" rel="noopener noreferrer"><Github size={16} aria-hidden="true" /> GitHub</a></li>
            <li><a href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} aria-hidden="true" /> WhatsApp</a></li>
            <li><a href={LINKS.behance} target="_blank" rel="noopener noreferrer">Behance <ArrowUpRight size={14} aria-hidden="true" className="flip-rtl" /></a></li>
          </ul>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
