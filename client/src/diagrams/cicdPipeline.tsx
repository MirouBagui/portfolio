import { Trace } from './Trace';
import { con, fail, fig, node, pass, sub, type TraceDefinition } from './types';

// ≤ 40 columns per line so the trace fits 360px with no sideways scroll (ADR-0004).
// Pass/fail colour always sits next to ✓/✗ and its path name (ADR-0003).
const cicdPipeline: TraceDefinition = {
  command: 'deploy --env production',
  lines: [
    [node('git push')],
    [con('  │')],
    [con('  ├──▶ '), node('lint'), con('      ─┐')],
    [con('  ├──▶ '), node('type-check'), con('─┤'), sub(' parallel')],
    [con('  └──▶ '), node('tests'), con('     ─┤')],
    [con('  ┌───────────────┘')],
    [con('  ▼')],
    [node('docker build'), sub('      one image')],
    [con('  │')],
    [con('  ▼')],
    [node('staging'), sub('           prod-like')],
    [con('  │ '), sub('smoke · acceptance')],
    [con('  ├──▶ '), pass('✓ pass → production')],
    [con('  │      '), sub('zero-downtime · monitor')],
    [con('  └──▶ '), fail('✗ fail → auto-rollback')],
    [con('         '), sub('alert')],
    [],
    [pass('✓ released')],
    [con('  '), fig('deployTime'), sub(' · '), fig('testCoverage', 'coverage')],
  ],
};

export default function CicdPipelineTrace() {
  return <Trace {...cicdPipeline} />;
}
