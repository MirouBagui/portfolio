// PROTOTYPE — throwaway. Case study 1 (event pipeline) from the superseded source doc,
// anonymised per ADR-0001. Figures hard-coded here; the real `figures` map is ADR-0002.

export type NodeId = 'producers' | 'gateway' | 'queue' | 'orchestrator' | 'cache' | 'ws' | 'api' | 'client';

export interface PNode { id: NodeId; label: string; sub?: string; stage: string; role: string }

export const STAGES = ['Sources', 'Ingestion', 'Processing', 'Delivery', 'Client'] as const;

export const NODES: PNode[] = [
  { id: 'producers', stage: 'Sources', label: 'Data Producers', sub: 'sensors & feeds', role: 'Emit raw events continuously from the field.' },
  { id: 'gateway', stage: 'Ingestion', label: 'Ingest Gateway', role: 'Single entry point; validates and normalises incoming events.' },
  { id: 'queue', stage: 'Ingestion', label: 'Message Queue', sub: 'RabbitMQ', role: 'Absorbs bursts so producers never wait on consumers.' },
  { id: 'cache', stage: 'Processing', label: 'Cache Layer', sub: 'historical lookups', role: 'Serves history to enrich live events without hitting storage.' },
  { id: 'orchestrator', stage: 'Processing', label: 'Event Orchestrator', sub: 'transform · aggregate · fan-out', role: 'Transforms, aggregates and fans events out to every consumer.' },
  { id: 'ws', stage: 'Delivery', label: 'WebSocket Gateway', role: 'Pushes live state to connected dashboards.' },
  { id: 'api', stage: 'Delivery', label: 'REST API', sub: 'replay & simulation', role: 'Replays past sessions and runs what-if simulations.' },
  { id: 'client', stage: 'Client', label: 'Operator Dashboards', sub: 'React / TypeScript', role: 'Where operators read the stream and act on it.' },
];

export const EDGES: { from: NodeId; to: NodeId; label?: string }[] = [
  { from: 'producers', to: 'gateway', label: '50k+ events/s' },
  { from: 'gateway', to: 'queue' },
  { from: 'queue', to: 'orchestrator' },
  { from: 'cache', to: 'orchestrator' },
  { from: 'orchestrator', to: 'ws' },
  { from: 'orchestrator', to: 'api' },
  { from: 'ws', to: 'client' },
  { from: 'api', to: 'client' },
];

export const FIGURES = [
  { value: '50k+', label: 'events/s' },
  { value: '<50ms', label: 'avg latency' },
  { value: '24/7', label: 'uptime' },
];

export const DIAGRAM_TEXT =
  'Data producers send 50k+ events per second to an ingest gateway, which hands them to a message queue. ' +
  'An event orchestrator consumes the queue, enriches events from a cache of historical lookups, and fans out to two delivery paths: ' +
  'a WebSocket gateway for live state and a REST API for replay and simulation. Both feed the operator dashboards.';

export const byId = (id: NodeId) => NODES.find((n) => n.id === id)!;
