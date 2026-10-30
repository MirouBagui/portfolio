# Case-study content is typed data in portfolio config; figures are a keyed map

Case studies are a typed `caseStudies` list in `client/src/portfolio.config.ts`, which the store exposes the same way it exposes `projects`. The canonical figures from ADR-0001 move into a keyed `figures` map in that same file. Case studies and project cards both read figures by key. Diagrams are referenced by id through a registry of lazy-loaded components. Decided in #12 (map #8).

```ts
type FigureId = 'pipelineThroughput' | 'pipelineLatency' | 'pipelineUptime'
  | 'deployTime' | 'testCoverage' | 'bugReports' | 'sprintAcceptance';
interface Figure { value: string; label: string }          // '50k+', 'events/s'

type DiagramId = 'event-pipeline' | 'cicd-pipeline' | 'strangler-fig';
interface CaseStudyConfig {
  id: string;
  title: string;
  problem: string;
  decisions: { term: string; text: string }[];             // term renders as a bold lead
  roleLine: string;                                        // role title + scope, no employer
  result: { figures: FigureId[]; text: string };
  diagram: DiagramId;
  diagramText: string;                                     // required text alternative
}
```

The shape is illustrative. Implementation may rename fields, but the decisions below hold.

## Decisions

- **Typed data, not markdown or one TSX module per case study.** Data keeps the content independent of the page layout (#13, still open) and adds no dependencies. Rejected: **raw markdown plus a parser**. That adds a new dependency, the Mermaid blocks would have to be stripped, and a card couldn't share a figure without parsing prose. Rejected: **one TSX module per case study**. The content would be tied to a layout that hasn't been chosen yet.
- **The store's type comes from the config type.** `Project` and `ProjectConfig` are already two hand-kept copies of the same type. Case studies don't add a third.
- **Diagrams are referenced by id.** A registry `Record<DiagramId, LazyExoticComponent>` maps each id to a component, so diagram code stays off the home-page bundle. If #11 lands on the Mermaid fallback, only the registry entries change. Rejected: **Mermaid source as a string in the data**, which ties the content to Mermaid against #9's leading option. Rejected: **the config importing components**, which would stop it being plain data.
- **Every diagram carries a required text alternative.** Whether it renders as visible text or a collapsible `<details>` block stays with the open accessibility item on the map.
- **No `projectId`.** Case studies are anonymous and unlinked (ADR-0001), so nothing needs the join. The role line is written as text. The shared figure keys are the only coupling to a card.
- **Decisions are `{ term, text }` pairs.** Rejected: an inline `**x**` parser, and plain text. The three decisions in the source with the bold word mid-sentence (message queue, event orchestrator, shared component library) get reworded to lead with the term during the copy pass.
- **The figures live in one map.** `FeaturedCard`'s hard-coded stats array and the EDF "−40%" badge read from it. A card **may override a figure's label but never its value**: the Stellantis card keeps `RACE UPTIME`, and the case study says "uptime". Card descriptions stay plain sentences. Decorative readouts (telemetry, the pipeline log and its 82%) stay as literals, bound by ADR-0001's do-not-contradict rule. Rejected: **literals plus an equality test**, because the client has no test runner. Rejected: **literals with review only**, because that is how 94% vs 80%+ happened.
- **The typed keys are the guarantee.** A `FigureId` or `DiagramId` that doesn't exist fails `tsc`. Neither runtime checks nor review are the guard.

## Consequences

- `docs/case-studies/source-architecture-portfolio.md` gets a "superseded" banner. It is the original import, not the build input, and it still contains values that were dropped (99.99%). ADR-0001 is amended to point here for storage.
- Card prose and the figures map can still drift: the EDF description says "by 40%" as a sentence. That is accepted. Only the stat and badge surfaces are bound to the map.
- `portfolio.config.ts` is public. The figure keys show which card each case study corresponds to, the same matching ADR-0001 already accepted.
