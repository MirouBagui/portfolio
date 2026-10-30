// PROTOTYPE — throwaway (#11). Three variants of case-study diagram 1 (event pipeline),
// switchable via ?variant=A|B|C, on a throwaway /prototype/diagram route (dev only).
// Hosted in a rough /architecture-like section so variants are judged in context, not a vacuum.
// Tokens: ADR-0003 spec values are applied in-scope (muted #94a3b8, faint, status) since #17 hasn't landed.
import type { CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PrototypeSwitcher } from '../PrototypeSwitcher';
import { FIGURES } from './data';
import { VariantA } from './VariantA';
import { VariantB } from './VariantB';
import { VariantC } from './VariantC';

const VARIANTS = [
  { key: 'A', name: 'Lane graph' },
  { key: 'B', name: 'Terminal trace' },
  { key: 'C', name: 'Stage rail' },
];

const SPEC_TOKENS = {
  '--color-text-muted': '#94a3b8',
  '--color-text-faint': '#475569',
  '--color-status-pass': '#10b981',
  '--color-status-fail': '#ef4444',
} as CSSProperties;

export function DiagramPrototype() {
  const [params] = useSearchParams();
  const v = params.get('variant') ?? 'A';

  return (
    <div style={SPEC_TOKENS} className="relative z-[1] min-h-screen pb-32 pt-28">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-12 lg:px-[72px]">
        <p className="mb-3.5 font-mono text-xs tracking-[2.5px] text-accent">// CASE STUDY 01</p>
        <h2 className="mb-4 text-[clamp(30px,3.5vw,46px)] font-bold tracking-[-1.5px]">Real-time event pipeline</h2>
        <p className="mb-8 max-w-[640px] text-base leading-relaxed text-text-muted">
          A live system had to ingest a continuous high-rate event stream, enrich it with history, and push it to
          operator dashboards fast enough to act on — without the producers ever waiting on the consumers.
        </p>
        <div className="mb-10 flex flex-wrap gap-3">
          {FIGURES.map((f) => (
            <div key={f.label} className="rounded-lg border border-border bg-surface px-4 py-2.5">
              <p className="font-mono text-lg font-semibold text-text-primary">{f.value}</p>
              <p className="font-mono text-[10px] tracking-[1.5px] text-text-muted">{f.label.toUpperCase()}</p>
            </div>
          ))}
        </div>

        {v === 'A' && <VariantA />}
        {v === 'B' && <VariantB />}
        {v === 'C' && <VariantC />}

        <p className="mt-10 max-w-[640px] text-sm leading-relaxed text-text-muted">
          <span className="font-semibold text-text-primary">Role</span> — Senior Full Stack Engineer, built ingest to dashboard end to end.
        </p>
      </div>
      <PrototypeSwitcher variants={VARIANTS} />
    </div>
  );
}
