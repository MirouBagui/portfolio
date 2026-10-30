// PROTOTYPE — throwaway. Variant B: "Terminal trace" — the diagram IS terminal output:
// box-drawing flow inside a terminal card, revealed line by line. Narrow enough for phones.
import { useEffect, useState } from 'react';
import { DIAGRAM_TEXT } from './data';

type Seg = [string, 'n' | 's' | 'a' | 'f' | 'ok' | 'p' | ''];
const L = (...s: Seg[]) => s;

const LINES: Seg[][] = [
  L(['$ ', 'p'], ['trace pipeline --live', 'n']),
  L(['', '']),
  L(['producers', 'n'], ['      sensors & feeds', 's']),
  L(['  │ ', 'a'], ['50k+ events/s', 'f']),
  L(['  ▼', 'a']),
  L(['ingest-gateway', 'n']),
  L(['  │', 'a']),
  L(['  ▼', 'a']),
  L(['message-queue', 'n'], ['  RabbitMQ', 's']),
  L(['  │', 'a']),
  L(['  ▼', 'a']),
  L(['event-orchestrator', 'n'], [' ◀── ', 'a'], ['cache', 'n']),
  L(['  │ ', 'a'], ['transform · aggregate · fan-out', 's']),
  L(['  ├──▶ ', 'a'], ['websocket-gateway', 'n'], ['     ──┐', 'a']),
  L(['  └──▶ ', 'a'], ['rest-api', 'n'], [' replay/sim', 's'], ['  ──┤', 'a']),
  L(['                              ▼', 'a']),
  L(['                    ', ''], ['operator-dashboards', 'n']),
  L(['', '']),
  L(['✓ ', 'ok'], ['streaming', 'ok'], ['  ·  50k+ ev/s  ·  <50ms avg  ·  24/7', 's']),
];

const CLS: Record<Seg[1], string> = {
  n: 'text-text-primary',
  s: 'text-text-muted',
  a: 'text-accent',
  f: 'text-accent-hover',
  ok: 'text-[var(--color-status-pass)]',
  p: 'text-[var(--color-status-pass)]',
  '': '',
};

export function VariantB() {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [shown, setShown] = useState(reduced ? LINES.length : 0);
  useEffect(() => {
    if (shown >= LINES.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 300 : 70);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <figure className="m-0 mx-auto max-w-[560px]">
      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <div className="flex items-center gap-2 border-b border-white/[6%] bg-white/[3%] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          <span className="flex-1 text-center font-mono text-xs text-text-muted">case-study@portfolio — trace</span>
        </div>
        <pre aria-hidden className="m-0 overflow-x-auto p-5 font-mono text-[11px] leading-[1.7] sm:text-xs">
          {LINES.slice(0, shown).map((line, i) => (
            <div key={i}>
              {line.map(([t, k], j) => <span key={j} className={CLS[k]}>{t}</span>)}
              {i === shown - 1 && shown < LINES.length && <span className="cursor-blink text-accent">▌</span>}
            </div>
          ))}
          {shown >= LINES.length && <div><span className="text-[var(--color-status-pass)]">$ </span><span className="cursor-blink text-accent">▌</span></div>}
        </pre>
      </div>
      <figcaption className="sr-only">{DIAGRAM_TEXT}</figcaption>
    </figure>
  );
}
