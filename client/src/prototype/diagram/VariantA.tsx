// PROTOTYPE — throwaway. Variant A: "Lane graph" — boxed nodes in stage lanes,
// hand-built SVG edges measured from the DOM so the graph reflows (LR desktop, stacked mobile).
import { useLayoutEffect, useRef, useState } from 'react';
import { DIAGRAM_TEXT, EDGES, NODES, STAGES, type NodeId } from './data';

type Path = { d: string; mx: number; my: number; label?: string };

function route(c: DOMRect, s: DOMRect, t: DOMRect): { d: string; mx: number; my: number } {
  const L = (r: DOMRect) => ({ l: r.left - c.left, r: r.right - c.left, t: r.top - c.top, b: r.bottom - c.top, cx: r.left - c.left + r.width / 2, cy: r.top - c.top + r.height / 2 });
  const a = L(s), b = L(t);
  if (b.l >= a.r - 4) {
    // left-to-right
    const dx = Math.max(24, (b.l - a.r) / 2);
    return { d: `M${a.r},${a.cy} C${a.r + dx},${a.cy} ${b.l - dx},${b.cy} ${b.l},${b.cy}`, mx: (a.r + b.l) / 2, my: (a.cy + b.cy) / 2 };
  }
  // top-to-bottom
  const dy = Math.max(16, (b.t - a.b) / 2);
  return { d: `M${a.cx},${a.b} C${a.cx},${a.b + dy} ${b.cx},${b.t - dy} ${b.cx},${b.t}`, mx: (a.cx + b.cx) / 2, my: (a.b + b.t) / 2 };
}

export function VariantA() {
  const box = useRef<HTMLDivElement>(null);
  const refs = useRef<Partial<Record<NodeId, HTMLDivElement | null>>>({});
  const [paths, setPaths] = useState<Path[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    const measure = () => {
      const c = box.current?.getBoundingClientRect();
      if (!c) return;
      setSize({ w: c.width, h: c.height });
      setPaths(EDGES.map((e) => {
        const s = refs.current[e.from]!.getBoundingClientRect();
        const t = refs.current[e.to]!.getBoundingClientRect();
        return { ...route(c, s, t), label: e.label };
      }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    return () => ro.disconnect();
  }, []);

  return (
    <figure className="m-0">
      <div ref={box} aria-hidden className="relative rounded-lg border border-border bg-surface p-5 sm:p-8">
        <svg className="pointer-events-none absolute inset-0" width={size.w} height={size.h}>
          <defs>
            <marker id="arrA" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M0,0 L8,4 L0,8 z" fill="var(--color-accent)" />
            </marker>
          </defs>
          {paths.map((p, i) => (
            <g key={i}>
              <path id={`eA${i}`} d={p.d} fill="none" stroke="var(--color-accent)" strokeOpacity={0.45} strokeWidth={1.25} markerEnd="url(#arrA)" />
              {!reduced && (
                <circle r={2.5} fill="var(--color-accent-hover)">
                  <animateMotion dur={`${1.6 + (i % 3) * 0.4}s`} repeatCount="indefinite"><mpath href={`#eA${i}`} /></animateMotion>
                </circle>
              )}
              {p.label && (
                <text x={p.mx} y={p.my - 10} textAnchor="middle" className="font-mono" fontSize={9.5} fill="var(--color-accent)" stroke="var(--color-bg-primary)" strokeWidth={4} paintOrder="stroke">{p.label}</text>
              )}
            </g>
          ))}
        </svg>

        <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-20">
          {STAGES.map((stage) => (
            <div key={stage} className="flex flex-col gap-3 lg:justify-center">
              <p className="font-mono text-[10px] tracking-[2px] text-text-muted">// {stage.toUpperCase()}</p>
              <div className="grid grid-cols-2 gap-6 lg:grid-cols-1 lg:gap-10">
                {NODES.filter((n) => n.stage === stage).map((n) => (
                  <div
                    key={n.id}
                    ref={(el) => { refs.current[n.id] = el; }}
                    className={`rounded-md border border-border bg-bg-primary px-3 py-2.5 ${NODES.filter((m) => m.stage === stage).length === 1 ? 'col-span-2 lg:col-span-1' : ''}`}
                  >
                    <p className="font-mono text-xs text-text-primary">
                      <span className="text-accent">▸ </span>{n.label}
                    </p>
                    {n.sub && <p className="mt-1 font-mono text-[10px] text-text-muted">{n.sub}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <figcaption>
        <details className="mt-3 font-mono text-xs text-text-muted">
          <summary className="cursor-pointer text-accent">$ cat diagram.txt</summary>
          <p className="mt-2 max-w-prose font-sans text-sm leading-relaxed">{DIAGRAM_TEXT}</p>
        </details>
      </figcaption>
    </figure>
  );
}
