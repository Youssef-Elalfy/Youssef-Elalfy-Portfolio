import type { ReactNode } from 'react';
import { RootShell, siteMetadata } from '@/components/site/RootShell';

export { viewport } from '@/components/site/RootShell';
export const metadata = siteMetadata('ar');

export default function ArabicLayout({ children }: { children: ReactNode }) {
  return <RootShell locale="ar">{children}</RootShell>;
}
