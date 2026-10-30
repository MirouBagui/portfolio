# Architecture page layout: results-first sections

`/architecture` is a single scrolling page. A headline question opens it, then one full-width section per case study. Each section opens with its result figures, and the terminal-trace diagram stays pinned beside the problem and decisions as you scroll. Decided in #13 (map #8) after comparing three layouts built with the real content and the ADR-0004 trace. The prototype is variant C on the throwaway branch `prototype/architecture-layout` (7a472cc), which is never merged.

## Decisions

- **Layout: results first (prototype variant C).**
  - **Header:** a `// ARCHITECTURE` label, the headline "What breaks first under pressure?", a one-line intro, and a row of tag chips linking to each section.
  - **Each section:** number and tag label, title and role line on the left, result figures in large type on the right. Below that, on desktop, the trace is pinned in the left column beside the problem and decisions; on a phone everything stacks.
  - **Close:** the source document's closing line.
  - Rejected: **long read (A)**, one column ending in results; it's long and the outcome comes last. Rejected: **`ls -l` index (B)**, one study open at a time; two of the three are hidden until clicked, and on a phone the diagram ends up far down.
- **Reading order differs from the source document.** The order is result → problem → decisions, with the diagram alongside. The source runs problem → decisions → diagram → result. The page is written for a recruiter skimming, who should see the outcome first. The content model (ADR-0002) is unaffected: the layout chooses the order.
- **`diagramText` goes in a collapsible block.** A `<details>` labelled `$ cat diagram.txt` sits under the trace. It's real page content, so screen readers reach it whether or not it's expanded. This settles the open accessibility item on map #8 and ADR-0004. Rejected: an always-visible paragraph, which repeats the diagram for sighted readers.
- **A tag on each case study:** Performance, Reliability, Architect. It appears as the section label and on the header chips. Each section has a stable id so links can jump to it: `#event-pipeline`, `#cicd-pipeline`, `#strangler-fig` (the `DiagramId` values). This needs a `tag` field on `CaseStudyConfig` (ADR-0002, amended). Rejected: no tags.
- **Order: pipeline → CI/CD → migration,** as in the source document (scale, then reliability, then architecture). The order of the `caseStudies` list is the page order. Rejected: leading with the migration.

## Consequences

- The section ids are a public URL contract. The home-page teaser may link to `/architecture#<id>`. Hash scrolling already works through `useHashScroll` in `RootLayout`.
- The pinned diagram assumes a trace is no taller than the problem and decisions beside it. The CI/CD trace, the tallest at about 18 lines, fits at 1440×1000. Check it again once the copy pass is done.
- The headline replaces the source document's "Architecture" title and emoji header. Final wording belongs to the voice/copy pass.
