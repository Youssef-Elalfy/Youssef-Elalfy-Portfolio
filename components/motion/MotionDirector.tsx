'use client';

import { useEffect } from 'react';
import { bindReveals, refreshMotion } from '@/lib/motion';

/** Mounted once per page: binds every page-level reveal and keeps trigger positions current. */
export function MotionDirector() {
  useEffect(() => {
    const unbind = bindReveals(document.body);
    let alive = true;
    // Webfonts change line breaks and heading heights; measure again once they are in.
    // (ScrollTrigger already refreshes on window load by itself.)
    document.fonts?.ready.then(() => { if (alive) refreshMotion(); });
    return () => {
      alive = false;
      unbind();
    };
  }, []);
  return null;
}
