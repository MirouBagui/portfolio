import { useEffect, useRef, useState } from 'react';

/**
 * Reveal-on-scroll: returns a ref and a `shown` flag that flips true (after
 * `delay` ms) the first time the element scrolls into view. Mirrors the design's
 * IntersectionObserver settings.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          timer = setTimeout(() => setShown(true), delay);
          obs.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );
    obs.observe(el);
    return () => {
      clearTimeout(timer);
      obs.disconnect();
    };
  }, [delay]);

  return [ref, shown] as const;
}

/** Tailwind classes for the fade-up reveal, respecting reduced-motion. */
export const revealClass = (shown: boolean) =>
  `transition-all duration-700 motion-reduce:transition-none motion-reduce:translate-y-0 motion-reduce:opacity-100 ${
    shown ? 'translate-y-0 opacity-100' : 'translate-y-9 opacity-0'
  }`;
