// PROTOTYPE — throwaway. Floating variant switcher for ?variant= prototypes.
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export function PrototypeSwitcher({ variants }: { variants: { key: string; name: string }[] }) {
  const [params, setParams] = useSearchParams();
  const current = params.get('variant') ?? variants[0].key;
  const i = Math.max(0, variants.findIndex((v) => v.key === current));

  const go = (d: number) => {
    const next = variants[(i + d + variants.length) % variants.length];
    const p = new URLSearchParams(params);
    p.set('variant', next.key);
    setParams(p, { replace: true });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('input,textarea,[contenteditable]')) return;
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!import.meta.env.DEV) return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-full border-2 border-yellow-300 bg-yellow-200 px-3 py-1.5 font-sans text-sm font-semibold text-black shadow-xl">
      <button onClick={() => go(-1)} className="px-2" aria-label="Previous variant">←</button>
      <span>PROTOTYPE · {variants[i].key} ({variants[i].name})</span>
      <button onClick={() => go(1)} className="px-2" aria-label="Next variant">→</button>
    </div>
  );
}
