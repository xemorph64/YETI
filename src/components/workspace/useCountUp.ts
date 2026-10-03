"use client";

import { useEffect, useState } from "react";

/**
 * Finite one-shot count-up for stat reveal — starts when the value first
 * arrives, eases out, cancels itself. Never loops. Reduced motion jumps
 * straight to the final value.
 */
export function useCountUp(target: number, active = true): number {
  const [value, setValue] = useState(active ? 0 : target);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }
    const reduced =
      document.documentElement.getAttribute("data-reduced-motion") === "true" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const duration = 750;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);

  return value;
}
