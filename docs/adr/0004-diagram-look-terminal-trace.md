# Case-study diagrams are terminal traces

Each case-study diagram on `/architecture` is drawn as terminal output: line-drawing characters (`│ ▼ ├──▶ └──▶ ◀──`) inside a terminal card, not a box-and-arrow chart. Decided in #11 (map #8) after comparing three rough versions of the event-pipeline diagram. The prototype is kept on the throwaway branch `prototype/diagram-look` (29bb9b0) and is never merged.

## Decisions

- **Look: terminal trace (prototype variant B).** Each diagram is a `$ <command>` prompt, then the flow, then a closing `✓` status line, in a terminal card that matches the hero card. It's authored as typed lines of segments, each segment carrying a role: node, sub-label, connector, figure or status. Each role maps to a theme token (ADR-0003), so no colours appear in the diagram content. The diagram is `aria-hidden`; `diagramText` (ADR-0002) is the accessible version. Rejected:
  - **Lane graph (A):** an SVG with measured edges. It was the most diagram-like, but the layout code can break and the stacked arrows were busy on phones.
  - **Stage rail (C):** semantic prose with no arrows. It was the most readable, but the least like a diagram.
- **This replaces #9's leading option (hand-built SVG).** Diagrams need no rendering library and no SVG layout. The Mermaid fallback in ADR-0003 doesn't apply. The `DiagramId` registry from ADR-0002 still holds; each entry is just a lines definition plus the shared trace component.
- **The other two diagrams follow the same grammar.** The CI/CD flow ends in two branches: `✓ pass → production` in `status-pass` and `✗ fail → auto-rollback` in `status-fail`, each with its label (ADR-0003). The strangler-fig loop uses a back-edge (`└──▶ next component ─┐` returning up), shown with connectors, not a state chart.
- **Motion: lines appear once when the diagram scrolls into view, then it stays still.** There are no continuous effects: no flowing dots, and the cursor stops blinking once the trace finishes. With reduced motion on, the finished trace shows immediately. Rejected: continuous motion, and no motion at all.
- **Each diagram fits 360px wide with no sideways scrolling.** Lines are written to about 40 monospace columns at the phone font size. Long labels are shortened or moved to their own line rather than scrolled. Rejected: sideways scrolling inside the card.

## Consequences

- Each diagram is a hand-written character layout, so connectors must line up by column count. Changing a label means re-aligning its line. That's acceptable for three static diagrams.
- How `diagramText` is presented (always visible, or in a collapsible block) is still the open accessibility question on map #8. The prototype's screen-reader-only caption doesn't settle it. *Amended (#13): ADR-0005 settles it with a `<details>` block labelled `$ cat diagram.txt` under the trace.*
- Figures in a trace come from the `figures` map by key (ADR-0002), never as literals.
