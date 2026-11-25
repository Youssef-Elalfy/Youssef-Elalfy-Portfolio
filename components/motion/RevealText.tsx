import type { HTMLAttributes } from 'react';

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'blockquote';

/**
 * Server-rendered word split for the GSAP heading reveal (lib/motion.ts).
 *
 * The words are real text in the HTML, so search engines, screen readers and visitors
 * without JavaScript read the heading normally. Splitting happens on spaces only, never
 * inside a word, which keeps joined Arabic letters intact.
 */
export function RevealText({ as: Component = 'h2', text, ...rest }: { as?: Tag; text: string } & HTMLAttributes<HTMLElement>) {
  const parts = text.split(/(\s+)/);
  return (
    <Component data-reveal="words" {...rest}>
      {parts.map((part, index) => {
        if (!part) return null;
        if (/^\s+$/.test(part)) return ' ';
        return <span className="rw" key={index}><span className="rw-i">{part}</span></span>;
      })}
    </Component>
  );
}
