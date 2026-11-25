import { allProjects, archivedProjects, projects } from '@/data/projects';
import { projectsAr } from '@/data/projects.ar';
import type { Project } from '@/types';
import type { Locale } from './config';

/** Returns the project with its text in the requested language. Facts and media stay shared. */
export function localizeProject(project: Project, locale: Locale): Project {
  if (locale === 'en') return project;
  const ar = projectsAr[project.id];
  if (!ar) return project;
  return {
    ...project,
    category: ar.category,
    tagline: ar.tagline ?? project.tagline,
    description: ar.description,
    role: ar.role,
    status_note: ar.status_note,
    purpose: ar.purpose,
    features: ar.features,
    architecture: ar.architecture,
    challenges: ar.challenges,
    image_note: ar.image_note,
    source_note: project.source_note ? ar.source_note ?? project.source_note : undefined,
    gallery: project.gallery?.map((image, index) => ({ ...image, alt: ar.gallery[index]?.alt ?? image.alt, caption: ar.gallery[index]?.caption ?? image.caption })),
    film: project.film && { ...project.film, alt: ar.film?.alt ?? project.film.alt, caption: ar.film?.caption ?? project.film.caption },
  };
}

export const getProjects = (locale: Locale) => projects.map(project => localizeProject(project, locale));
export const getArchived = (locale: Locale) => archivedProjects.map(project => localizeProject(project, locale));
export const getAllProjects = (locale: Locale) => allProjects.map(project => localizeProject(project, locale));
