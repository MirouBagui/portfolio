// PROTOTYPE — throwaway (#13). Terminal-trace diagram per ADR-0004: lines reveal once on
// first view, then still; reduced motion shows the full trace; aria-hidden, diagramText is the alternative.
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { parseLine, type CaseStudy, type Role } from './content';

const CLS: Record<Role, string> = {
  n: 'text-text-primary',
  s: 'text-text-muted',
  a: 'text-accent',
  f: 'text-accent-hover',
  ok: 'text-[var(--color-status-pass)]',
  no: 'text-[var(--color-status-fail)]',
};

export function Trace({ cs, className = '' }: { cs: CaseStudy; className?: string }) {
  const lines = [`{ok|$} {n|${cs.command}}`, '', ...cs.trace];
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(reduced);
  const [shown, setShown] = useState(reduced ? lines.length : 0);

  useEffect(() => {
    if (started || !ref.current) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && (setStarted(true), obs.disconnect()), { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started || shown >= lines.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 200 : 60);
    return () => clearTimeout(t);
  }, [started, shown, lines.length]);

  return (
    <div ref={ref} aria-hidden className={`overflow-hidden rounded-lg border border-border bg-surface ${className}`}>
      <div className="flex items-center gap-2 border-b border-white/[6%] bg-white/[3%] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <span className="flex-1 text-center font-mono text-[11px] text-text-muted">case-study@portfolio — trace</span>
      </div>
      <pre className="m-0 min-h-[1px] p-4 font-mono text-[11px] leading-[1.7] sm:p-5 sm:text-xs" style={{ minHeight: `${lines.length * 1.7 + 2}em` }}>
        {lines.slice(0, shown).map((l, i) => (
          <div key={i}>
            {parseLine(l).map(([t, r], j) => <span key={j} className={CLS[r]}>{t}</span>)}
            {l === '' && ' '}
            {i === shown - 1 && shown < lines.length && <span className="text-accent">▌</span>}
          </div>
        ))}
      </pre>
    </div>
  );
}

export function Figures({ cs, big = false }: { cs: CaseStudy; big?: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      {cs.results.map((r) => (
        <div key={r.label} className={big ? '' : 'rounded-lg border border-border bg-surface px-4 py-2.5'}>
          <p className={`font-mono font-semibold text-text-primary ${big ? 'text-[clamp(36px,4.5vw,60px)] leading-none tracking-[-2px]' : 'text-lg'}`}>{r.value}</p>
          <p className="mt-1 font-mono text-[10px] tracking-[1.5px] text-text-muted">{r.label.toUpperCase()}</p>
        </div>
      ))}
    </div>
  );
}

export function Decisions({ cs }: { cs: CaseStudy }) {
  return (
    <dl className="m-0 flex flex-col gap-3">
      {cs.decisions.map((d) => (
        <div key={d.term} className="text-[15px] leading-relaxed">
          <dt className="inline font-semibold text-text-primary">{d.term}</dt>{' '}
          <dd className="m-0 inline text-text-muted">{d.text}</dd>
        </div>
      ))}
    </dl>
  );
}

export const Label = ({ children }: { children: ReactNode }) => (
  <p className="mb-2.5 font-mono text-[10px] tracking-[2px] text-accent">{children}</p>
);
