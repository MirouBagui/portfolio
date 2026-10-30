// PROTOTYPE — throwaway (#13). Case-study content, anonymised and domain-neutral (ADR-0001),
// shaped like CaseStudyConfig (ADR-0002) but hard-coded. Copy is pre-voice-pass.
// Trace markup: {r|text} sets a segment role — n node, s sub-label, a connector,
// f figure, ok pass, no fail. Bare text = connector. Max 40 cols (ADR-0004).

export type Role = 'n' | 's' | 'a' | 'f' | 'ok' | 'no';

export interface CaseStudy {
  id: 'event-pipeline' | 'cicd-pipeline' | 'strangler-fig';
  tag: 'Performance' | 'Reliability' | 'Architect';
  title: string;
  problem: string;
  decisions: { term: string; text: string }[];
  results: { value: string; label: string }[];
  resultNote: string;
  role: string;
  command: string;
  trace: string[];
  diagramText: string;
}

export const INTRO = {
  prompt: 'cat architecture/README',
  title: 'Architecture',
  lede: 'Three architectures for three recurring engineering problems: high-throughput real-time data, unreliable releases, and legacy erosion.',
  closing: 'Every design here started from one question: what breaks first under pressure? The pipeline absorbs it, the release gate prevents it, the migration isolates it.',
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'event-pipeline',
    tag: 'Performance',
    title: 'High-throughput real-time event pipeline',
    problem:
      'Deliver live data from thousands of concurrent sources to operator dashboards with sub-50ms end-to-end latency, and drop nothing under peak load.',
    decisions: [
      { term: 'Message queue', text: 'decouples producers from consumers, so load spikes never push back on the ingest layer.' },
      { term: 'Event orchestrator', text: 'fans processed events out over WebSockets; each client subscribes only to its scope, keeping payloads small.' },
      { term: 'Horizontal consumers', text: 'throughput scales by adding instances, not by re-architecting.' },
    ],
    results: [
      { value: '50k+', label: 'events/s' },
      { value: '<50ms', label: 'avg latency' },
      { value: '24/7', label: 'uptime' },
    ],
    resultNote: 'No dropped messages at peak.',
    role: 'Senior Full Stack Engineer — ingest to dashboard, end to end.',
    command: 'trace event-pipeline',
    trace: [
      '{n|producers}         {s|sensors & feeds}',
      '  │ {f|50k+ events/s}',
      '  ▼',
      '{n|ingest-gateway}',
      '  ▼',
      '{n|message-queue}     {s|RabbitMQ}',
      '  ▼',
      '{n|orchestrator} ◀── {n|cache}',
      '  ├──▶ {n|websocket-gw} ──┐',
      '  └──▶ {n|rest-api} ──────┤',
      '                      ▼',
      '             {n|operator-dashboards}',
      '',
      '{ok|✓ streaming} {s|·} {f|<50ms avg} {s|·} {f|24/7}',
    ],
    diagramText:
      'Data producers send 50k+ events per second to an ingest gateway, which hands them to a message queue. An event orchestrator consumes the queue, enriches events from a cache, and fans out to a WebSocket gateway for live state and a REST API for replay. Both feed the operator dashboards.',
  },
  {
    id: 'cicd-pipeline',
    tag: 'Reliability',
    title: 'Industrialised CI/CD delivery pipeline',
    problem: 'Manual deployments were slow and error-prone. Every release was a risk event.',
    decisions: [
      { term: 'Parallel stages', text: 'lint, type-check and unit tests run concurrently, cutting pipeline wall time.' },
      { term: 'One container image', text: 'promoted through every environment: what you test is what you ship.' },
      { term: 'Prod-like staging', text: 'de-risks each release before it touches production.' },
    ],
    results: [
      { value: '−40%', label: 'deploy time' },
      { value: '80%+', label: 'test coverage' },
    ],
    resultNote: 'Regression-free releases since.',
    role: 'Senior Full Stack Engineer — pipeline design and rollout.',
    command: 'trace release-pipeline',
    trace: [
      '{n|push}',
      '  ▼',
      '{n|lint · type-check · tests}  {s|parallel}',
      '  ▼',
      '{n|docker build}      {s|one image}',
      '  ▼',
      '{n|staging}           {s|prod-like}',
      '  ▼',
      '{n|smoke & acceptance}',
      '  ├─ {ok|✓ pass} ─▶ {n|production}',
      '  │              {s|zero-downtime}',
      '  │              ▼',
      '  │            {n|monitoring}',
      '  └─ {no|✗ fail} ─▶ {n|auto-rollback} {s|+ alert}',
      '',
      '{ok|✓ shipped} {s|·} {f|−40% deploy} {s|·} {f|80%+ cov}',
    ],
    diagramText:
      'A push runs lint, type-check and tests in parallel, then builds one Docker image and deploys it to a prod-like staging environment. Smoke and acceptance tests decide: on pass, a zero-downtime production deploy followed by monitoring; on fail, an automatic rollback and an alert.',
  },
  {
    id: 'strangler-fig',
    tag: 'Architect',
    title: 'Incremental legacy modernisation',
    problem:
      'A weakly typed, heterogeneous legacy frontend kept generating bugs and slowing the team. A full rewrite was impossible: the system had to keep serving users throughout.',
    decisions: [
      { term: 'Strangler fig', text: 'new features ship in the new stack and old components migrate opportunistically — no big-bang rewrite, no feature freeze.' },
      { term: 'TypeScript', text: 'strict typing catches whole bug classes at compile time instead of in production.' },
      { term: 'Shared component library', text: 'Storybook makes the new path the easiest path for every developer.' },
    ],
    results: [
      { value: '−30%', label: 'bug reports' },
      { value: '>95%', label: 'sprint acceptance' },
    ],
    resultNote: 'Migrated without a single release freeze.',
    role: 'Senior Frontend Engineer — migration strategy and tooling.',
    command: 'trace legacy-migration',
    trace: [
      '{n|audit}             {s|bug hotspots}',
      '  ▼',
      '{n|types & contracts}',
      '  ▼',
      '┌─▶ {n|build in new stack}',
      '│     ▼',
      '│   {n|parallel run}    {s|real traffic}',
      '│     ▼',
      '│   {n|retire legacy part}',
      '│     │',
      '└─────┤ {s|next component}',
      '      ▼',
      '   {n|fully migrated}',
      '',
      '{ok|✓ done} {s|·} {f|−30% bugs} {s|·} {f|>95% accepted}',
    ],
    diagramText:
      'The codebase is audited for bug hotspots and its types and contracts defined. Then a loop: build the next component in the new stack, run it in parallel on real traffic, retire the legacy part, and repeat until everything is migrated.',
  },
];

export function parseLine(line: string): [string, Role][] {
  const out: [string, Role][] = [];
  const re = /\{(n|s|a|f|ok|no)\|([^}]*)\}/g;
  let last = 0;
  for (const m of line.matchAll(re)) {
    if (m.index! > last) out.push([line.slice(last, m.index), 'a']);
    out.push([m[2], m[1] as Role]);
    last = m.index! + m[0].length;
  }
  if (last < line.length) out.push([line.slice(last), 'a']);
  return out;
}
