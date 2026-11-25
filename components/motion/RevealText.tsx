import type { HTMLAttributes, ReactNode } from 'react';

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'blockquote';

const ARABIC = /[؀-ۿ]/;

/**
 * Server-rendered word split for the GSAP heading reveal (lib/motion.ts).
 *
 * The words are real text in the HTML, so search engines, screen readers and visitors
 * without JavaScript read the heading normally. Splitting happens on spaces only, never
 * inside a word, which keeps joined Arabic letters intact.
 *
 * Each word is an inline-block, which the bidi algorithm treats as a neutral object. Inside an
 * Arabic page that would lay a Latin title such as "MASAR AI" out right-to-left ("AI MASAR"),
 * so text without Arabic letters is wrapped in an isolated left-to-right line. The wrapper is
 * inline, so the heading keeps the alignment of its own direction.
 */
export function RevealText({ as: Component = 'h2', text, suffix, ...rest }: { as?: Tag; text: string; suffix?: ReactNode } & HTMLAttributes<HTMLElement>) {
  const parts = text.split(/(\s+)/).filter(Boolean);
  const lastWord = parts.reduce((last, part, index) => (/^\s+$/.test(part) ? last : index), -1);
  const words = parts.map((part, index) => {
    if (/^\s+$/.test(part)) return ' ';
    return <span className="rw" key={index}><span className="rw-i">{part}{index === lastWord ? suffix : null}</span></span>;
  });
  return (
    <Component data-reveal="words" {...rest}>
      {ARABIC.test(text) ? words : <span className="rw-line" dir="ltr">{words}</span>}
    </Component>
  );
}
