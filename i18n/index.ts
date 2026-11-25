import type { Locale } from './config';
import { en, type Dictionary } from './dictionaries/en';
import { ar } from './dictionaries/ar';

export type { Dictionary };

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

/** Fills {placeholders}; unknown placeholders are left visible rather than silently dropped. */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}
