// PROTOTYPE — throwaway. Variant C: "Stage rail" — no boxes, no arrows. A numbered rail of
// stages; each node is a short prose entry. The diagram is semantic HTML, so it is its own
// text alternative. Horizontal rail on desktop, vertical rail on mobile.
import { NODES, STAGES } from './data';

const NOTE: Partial<Record<string, string>> = {
  producers: '50k+ events/s →',
  orchestrator: '↳ enriched from cache',
  cache: '↳ feeds orchestrator',
  ws: '↳ live state',
  api: '↳ on demand',
};

export function VariantC() {
  return (
    <figure className="m-0">
      <ol className="relative grid list-none grid-cols-1 gap-0 p-0 lg:grid-cols-5">
        {STAGES.map((stage, i) => (
          <li key={stage} className="relative border-l border-border pb-10 pl-7 lg:border-l-0 lg:border-t lg:pb-0 lg:pl-0 lg:pr-6 lg:pt-7">
            <span className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full border border-accent bg-bg-primary lg:-top-[5px] lg:left-0" />
            <p className="mb-4 font-mono text-[10px] tracking-[2px] text-accent">
              {String(i + 1).padStart(2, '0')} <span className="text-text-muted">// {stage.toUpperCase()}</span>
            </p>
            <ul className="flex list-none flex-col gap-5 p-0">
              {NODES.filter((n) => n.stage === stage).map((n) => (
                <li key={n.id}>
                  <p className="text-[15px] font-semibold text-text-primary">{n.label}</p>
                  {n.sub && <p className="font-mono text-[10px] text-text-muted">{n.sub}</p>}
                  <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{n.role}</p>
                  {NOTE[n.id] && <p className="mt-1.5 font-mono text-[11px] text-accent">{NOTE[n.id]}</p>}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </figure>
  );
}
