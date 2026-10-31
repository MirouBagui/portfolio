import { Trace } from './Trace';
import { con, fig, node, pass, sub, type TraceDefinition } from './types';

// ≤ 40 columns per line so the trace fits 360px with no sideways scroll (ADR-0004).
const eventPipeline: TraceDefinition = {
  command: 'trace pipeline --live',
  lines: [
    [node('producers'), sub('      sensors & feeds')],
    [con('  │ '), fig('pipelineThroughput')],
    [con('  ▼')],
    [node('ingest-gateway')],
    [con('  │')],
    [con('  ▼')],
    [node('message-queue')],
    [con('  │')],
    [con('  ▼')],
    [node('event-orchestrator'), con(' ◀── '), node('cache')],
    [con('  │ '), sub('transform · aggregate · fan-out')],
    [con('  ├──▶ '), node('websocket-gateway'), con('      ──┐')],
    [con('  └──▶ '), node('rest-api'), sub(' replay'), con('        ──┤')],
    [con('                                ▼')],
    [node('                     operator-dashboards')],
    [],
    [pass('✓ streaming')],
    [con('  '), fig('pipelineThroughput', 'ev/s'), sub(' · '), fig('pipelineLatency', 'avg'), sub(' · '), fig('pipelineUptime', '')],
  ],
};

export default function EventPipelineTrace() {
  return <Trace {...eventPipeline} />;
}
