// PROTOTYPE — throwaway (#13). Three layouts for /architecture, switchable via ?variant=A|B|C,
// on a dev-only /prototype/architecture route inside the real RootLayout (navbar + footer).
// ADR-0003 spec tokens applied in-scope since #17 hasn't landed.
import type { CSSProperties } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PrototypeSwitcher } from '../PrototypeSwitcher';
import { VariantA } from './VariantA';
import { VariantB } from './VariantB';
import { VariantC } from './VariantC';

const SPEC_TOKENS = {
  '--color-text-muted': '#94a3b8',
  '--color-text-faint': '#475569',
  '--color-status-pass': '#10b981',
  '--color-status-fail': '#ef4444',
} as CSSProperties;

export function ArchitecturePrototype() {
  const [params] = useSearchParams();
  const v = params.get('variant') ?? 'A';
  return (
    <main style={SPEC_TOKENS} className="relative z-[1] min-h-screen pb-32 pt-28">
      {v === 'A' && <VariantA />}
      {v === 'B' && <VariantB />}
      {v === 'C' && <VariantC />}
      <PrototypeSwitcher
        variants={[
          { key: 'A', name: 'Long read' },
          { key: 'B', name: 'ls -l index' },
          { key: 'C', name: 'Result-first spreads' },
        ]}
      />
    </main>
  );
}
