import { Alexandria, Bricolage_Grotesque, Geist, Tajawal } from 'next/font/google';

// Latin display and text.
export const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', axes: ['opsz', 'wdth'], display: 'swap' });
export const sans = Geist({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

// Arabic: the subsets carry an Arabic-only unicode-range, so in mixed text the browser
// takes Arabic letters from these files and Latin letters from the fonts above.
// adjustFontFallback is off so no local Arial fallback steals the Latin or Arabic glyphs.
export const arabicDisplay = Alexandria({ subsets: ['arabic'], variable: '--font-ar-display', display: 'swap', preload: false, adjustFontFallback: false });
export const arabicText = Tajawal({ subsets: ['arabic'], weight: ['400', '500', '700', '800'], variable: '--font-ar-text', display: 'swap', preload: false, adjustFontFallback: false });

export const fontVariables = [display.variable, sans.variable, arabicDisplay.variable, arabicText.variable].join(' ');
