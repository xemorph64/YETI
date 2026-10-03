"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll-reveal wrapper. Adds .is-in when the element enters the viewport.
 * Respects prefers-reduced-motion via the global CSS rules in globals.css.
 * Also exposes a tiny custom event bridge so GSAP timelines can reveal nodes.
 */
export function Reveal({
  children,
  delay = 0,
  as: As = "div",
  className,
  id,
}: {
  children: React.ReactNode;
  delay?: number;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.documentElement.getAttribute("data-reduced-motion") === "true") {
      el.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = As as React.ElementType;
  return (
    <Comp
      ref={ref}
      id={id}
      data-reveal=""
      style={{ "--reveal-delay": `${delay}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </Comp>
  );
}
