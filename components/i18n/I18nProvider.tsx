'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n';

type I18n = { locale: Locale; dict: Dictionary; dir: 'ltr' | 'rtl' };

const I18nContext = createContext<I18n | null>(null);

export function I18nProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: ReactNode }) {
  return <I18nContext.Provider value={{ locale, dict, dir: locale === 'ar' ? 'rtl' : 'ltr' }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside <I18nProvider>');
  return value;
}
