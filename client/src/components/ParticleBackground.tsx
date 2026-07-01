import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  dir: number;
  speed: number;
}

/** Faint blueprint grid + slowly twinkling stars (design background). */
export function ParticleBackground({ quantity = 90 }: { quantity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const stars: Star[] = Array.from({ length: quantity }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.3 + 0.2,
      alpha: Math.random() * 0.5 + 0.1,
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: Math.random() * 0.004 + 0.002,
    }));

    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 40) return; // ~25fps cap
      last = t;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const step = 64;
      ctx.strokeStyle = 'rgba(59,130,246,0.035)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      for (const s of stars) {
        s.alpha += s.dir * s.speed;
        if (s.alpha > 0.65) s.dir = -1;
        if (s.alpha < 0.08) s.dir = 1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [quantity]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    />
  );
}
