import { useEffect, useState } from 'react';

/**
 * Lightweight count-up hook. Animates from 0 (or `from`) to `target` over
 * `durationMs` using an easeOutCubic curve. Honors `prefers-reduced-motion`
 * by snapping straight to the target. No framer-motion dependency.
 */
export function useCountUp(target: number, durationMs = 1200, from = 0): number {
  const [value, setValue] = useState(from);

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const delta = target - from;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(from + delta * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs]);

  return value;
}
