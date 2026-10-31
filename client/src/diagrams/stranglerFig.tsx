import { Trace } from './Trace';
import { con, fig, node, pass, sub, type TraceDefinition } from './types';

// ≤ 40 columns per line so the trace fits 360px with no sideways scroll (ADR-0004).
// The loop is a back-edge drawn in connectors, not a state chart.
const stranglerFig: TraceDefinition = {
  command: 'migrate --strategy strangler-fig',
  lines: [
    [node('audit codebase'), sub('      bug hotspots')],
    [con('  │')],
    [con('  ▼')],
    [node('types & contracts'), sub('   defined first')],
    [con('  │')],
    [con('  ▼')],
    [node('build in new stack'), con(' ◀────────┐')],
    [con('  │                         │')],
    [con('  ▼                         │')],
    [node('run in parallel'), con('             │')],
    [con('  │ '), sub('real traffic'), con('            │')],
    [con('  ▼                         │')],
    [node('retire legacy part'), con('          │')],
    [con('  │                         │')],
    [con('  └──▶ '), node('next component'), con(' ──────┘')],
    [],
    [pass('✓ migrated'), sub(' · no release freeze')],
    [con('  '), fig('bugReports'), sub(' · '), fig('sprintAcceptance', 'sprints')],
  ],
};

export default function StranglerFigTrace() {
  return <Trace {...stranglerFig} />;
}
