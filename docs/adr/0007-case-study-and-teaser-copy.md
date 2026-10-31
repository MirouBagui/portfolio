# Case-study copy: real role titles, measured claims, first person only in the role line

The architecture page and its home teaser use the copy below. Each role line names the title the author actually held. Every result note states what was measured, not an absolute. Decided in #18 (map #8).

## Decisions

- **Role lines use the real title plus the scope owned.** The prototype's draft lines named titles that were never held: CI/CD (held: Backend Developer) said "Senior Full Stack Engineer", and the legacy migration (held: Full Stack Developer) said "Senior Frontend Engineer". ADR-0001 requires a role title the author can defend in an interview, and a CV check would expose either inflation. Rejected: **scope without a title**, which reads as evasive next to a CV; **the draft titles**.
  - A role title on a page with a matching figure makes the employer easier to infer (Backend Developer + −40% → the EDF card). ADR-0001 already accepts this kind of matching.
- **First person in the role line only.** The role line says what the author did. The problem, decisions and results stay impersonal, like a design doc, so the page is about the systems. Rejected: impersonal everywhere (the reader can't tell what the author owned); first person everywhere (reads like a CV, not a design doc).
- **Result notes state what was measured.** The drafts claimed "no dropped messages at peak", "regression-free releases since" and "migrated without a single release freeze". One counterexample in an interview undoes an absolute claim. Each note is now limited to what was observed. The author confirms each note is defensible before it ships; any note he can't defend is struck, not softened further. Rejected: keeping the drafts; dropping the notes (the figures lose their context).
- **Header and close.** The 📐 emoji is dropped. The headline stays the question "What breaks first under pressure?", the one-line intro goes beneath it, and the page closes on the source document's closing line. Rejected: **"Architecture" as the headline**, which repeats the `// ARCHITECTURE` label; **no closing line**, which leaves the headline question unanswered.
- **Teaser.** Subtitle "Three systems, and how each one holds up." Closing link "Read the case studies →". Rejected: **the page's closing line as the subtitle**, which gives away the page's last line before the reader gets there; **a `$ cd architecture` link**, which doesn't say what the link leads to.
- **Where page-level copy lives** (settled while writing, not asked): the headline, intro, closing line and teaser strings sit in `portfolio.config.ts` next to `caseStudies`, as `architecturePage: { headline, intro, closing, teaser: { subtitle, linkText } }`. Both the page and the teaser read them, as ADR-0002 does for case studies.

## Copy

**Page**
- headline: What breaks first under pressure?
- intro: Three architectures for three recurring engineering problems: high-throughput real-time data, unreliable releases, and legacy erosion.
- closing: Every design here started from one question: what breaks first under pressure? The pipeline absorbs it, the release gate prevents it, the migration isolates it.

**Teaser**
- subtitle: Three systems, and how each one holds up.
- linkText: Read the case studies →

**event-pipeline · Performance · High-throughput real-time event pipeline**
- problem: Deliver live data from thousands of concurrent sources to operator dashboards with sub-50ms end-to-end latency, and drop nothing under peak load.
- decisions:
  - Message queue: decouples producers from consumers, so load spikes never push back on the ingest layer.
  - Event orchestrator: fans processed events out over WebSockets; each client subscribes only to its scope, keeping payloads small.
  - Horizontal consumers: throughput scales by adding instances, not by re-architecting.
- figures: 50k+ events/s · <50ms avg latency · 24/7 uptime
- result.text: No message loss in peak-load tests.
- roleLine: Senior Full Stack Engineer — I built it ingest to dashboard, end to end.

**cicd-pipeline · Reliability · Industrialised CI/CD delivery pipeline**
- problem: Manual deployments were slow and error-prone. Every release was a risk event.
- decisions:
  - Parallel stages: lint, type-check and unit tests run concurrently, cutting pipeline wall time.
  - One container image: promoted through every environment, so what you test is what you ship.
  - Prod-like staging: de-risks each release before it touches production.
- figures: −40% deploy time · 80%+ test coverage
- result.text: No rollback-causing regressions after rollout.
- roleLine: Backend Developer — I designed the pipeline and rolled it out.

**strangler-fig · Architect · Incremental legacy modernisation**
- problem: A weakly typed, heterogeneous legacy frontend kept generating bugs and slowing the team. A full rewrite was impossible: the system had to keep serving users throughout.
- decisions:
  - Strangler fig: new features ship in the new stack and old components migrate opportunistically — no big-bang rewrite, no feature freeze.
  - TypeScript: strict typing catches whole bug classes at compile time instead of in production.
  - Shared component library: Storybook makes the new path the easiest path for every developer.
- figures: −30% bug reports · >95% sprint acceptance
- result.text: No release freeze during the migration.
- roleLine: Full Stack Developer — I set the migration strategy and built its tooling.

## Consequences

- The problem statements keep the goal "drop nothing under peak load". It is a requirement, not a result. The measured claim sits in the result note.
- No domain vocabulary (race, F1, pit wall, energy) appears in this copy, as ADR-0001 requires.
- The diagram text alternatives (`diagramText`) and the trace labels are not part of this copy. They follow ADR-0004's trace format and are written with the diagrams.
- ADR-0005's pinned-diagram height check ("check again once the copy pass is done") applies now. The copy is about the same length as the prototype's, so no change is expected, but the build must check it at 1440×1000.
