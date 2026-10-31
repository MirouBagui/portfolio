import { useEffect, useState } from 'react';
import { usePortfolioStore } from '../stores/portfolioStore';
import { useReveal } from '../hooks/useReveal';
import type { Segment, TraceDefinition } from './types';

const ROLE_CLASS = {
  node: 'text-text-primary',
  sublabel: 'text-text-muted',
  connector: 'text-accent',
  figure: 'text-accent-hover',
  pass: 'text-status-pass',
  fail: 'text-status-fail',
} as const;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function Seg({ seg }: { seg: Segment }) {
  const figures = usePortfolioStore((s) => s.figures);
  if (seg.role === 'figure') {
    const f = figures[seg.id];
    const label = seg.label ?? f.label;
    return <span className={ROLE_CLASS.figure}>{label ? `${f.value} ${label}` : f.value}</span>;
  }
  if (seg.role === 'status') return <span className={ROLE_CLASS[seg.tone]}>{seg.text}</span>;
  return <span className={ROLE_CLASS[seg.role]}>{seg.text}</span>;
}

/**
 * Terminal-trace diagram (ADR-0004): reveals line by line once, the first time it
 * scrolls into view, then stays still. Reduced motion shows the finished trace.
 * Decorative: `diagramText` in the page's `$ cat diagram.txt` block is the accessible version.
 */
export function Trace({ command, lines }: TraceDefinition) {
  const total = lines.length + 2; // prompt line + blank line + body
  const [ref, inView] = useReveal<HTMLDivElement>();
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? total : 0));
  const done = shown >= total;

  useEffect(() => {
    if (!inView || done) return;
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 300 : 70);
    return () => clearTimeout(t);
  }, [inView, done, shown]);

  const rows = [[{ role: 'connector', text: '$ ' }, { role: 'node', text: command }], [], ...lines] as Segment[][];

  return (
    <div ref={ref} aria-hidden="true" className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="flex-1 text-center font-mono text-xs text-text-muted">case-study@portfolio — trace</span>
      </div>
      {/* Every row is laid out from the start (invisible until revealed), so the card never changes height. */}
      <pre className="m-0 overflow-hidden whitespace-pre px-4 py-5 font-mono text-[11px] leading-[1.7] sm:px-5 sm:text-xs">
        {rows.map((line, i) => (
          <div key={i} className={i < shown ? '' : 'invisible'}>
            {line.map((seg, j) => (
              <Seg key={j} seg={seg} />
            ))}
            {line.length === 0 && ' '}
            {!done && i === shown - 1 && <span className="cursor-blink text-accent">▌</span>}
          </div>
        ))}
        <div className={done ? '' : 'invisible'}>
          <span className="text-accent">$ </span>
          {/* Static once the trace finishes: no continuous motion (ADR-0004). */}
          <span className="text-accent">▌</span>
        </div>
      </pre>
    </div>
  );
}
