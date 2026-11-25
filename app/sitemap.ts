import type { MetadataRoute } from 'next';
import { allProjects } from '@/data/projects';
import { SITE_URL, localePath } from '@/i18n/config';

function entry(path: string, priority: number): MetadataRoute.Sitemap {
  const languages = { en: SITE_URL + localePath('en', path), ar: SITE_URL + localePath('ar', path) };
  return (['en', 'ar'] as const).map(locale => ({ url: SITE_URL + localePath(locale, path), changeFrequency: 'monthly' as const, priority, alternates: { languages } }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...entry('/', 1), ...allProjects.flatMap(project => entry(`/projects/${project.slug}`, 0.7))];
}
