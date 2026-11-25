import type { ReactNode } from 'react';
import { RootShell, siteMetadata } from '@/components/site/RootShell';

export { viewport } from '@/components/site/RootShell';
export const metadata = siteMetadata('en');

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
