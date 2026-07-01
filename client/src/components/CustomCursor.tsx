import { useEffect, useRef } from 'react';

/**
 * Trailing ring + dot cursor from the design. Only mounts where a precise
 * pointer exists and motion is allowed (body keeps the native cursor otherwise).
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    let mx = -100, my = -100, rx = -100, ry = -100;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    };
    document.addEventListener('mousemove', onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      raf = requestAnimationFrame(tick);
    };
    tick();

    const grow = () => {
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'rgba(6,182,212,1)';
    };
    const shrink = () => {
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'rgba(6,182,212,.75)';
    };
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element)?.closest('a, button')) grow();
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element)?.closest('a, button')) shrink();
    };
    document.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseout', onOut, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed z-[9999] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-[rgba(6,182,212,.75)] transition-[width,height,border-color] duration-200"
        style={{ left: -100, top: -100 }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed z-[9999] h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)]"
        style={{ left: -100, top: -100 }}
      />
    </>
  );
}
