import type { Metadata } from 'next';
import { allProjects } from '@/data/projects';
import { ProjectPage, projectMetadata } from '@/components/site/ProjectPage';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return allProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return projectMetadata((await params).slug, 'ar');
}

export default async function Page({ params }: PageProps) {
  return <ProjectPage slug={(await params).slug} locale="ar" />;
}
