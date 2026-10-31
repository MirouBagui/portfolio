# Case studies are anonymous and unlinked; the source doc holds the canonical figures

The three case studies on the architecture page name no employer, and no project card links to them. Visitors reach them only through the nav entry and the home-page teaser. The figures in `docs/case-studies/source-architecture-portfolio.md` are canonical: project cards must agree with them, and every figure on the site has to be one the author can defend in an interview. Decided in #10 (map #8).

> **Amended:** storage was settled in ADR-0002 (#12). The canonical values in the table below now live in the `figures` map in `client/src/portfolio.config.ts`. The source doc is superseded and is no longer the canonical store.

## Attribution

- **No employer or client name** appears on the architecture page. Each case study gets one line naming the author's **role and scope** (role title only, e.g. "Senior Full Stack Engineer — built ingest to dashboard end to end"). The exact wording belongs to the voice/copy pass.
- **No card links.** This amends the shape chosen in the map (P5). The `→ architecture` links from the Stellantis and EDF cards are dropped. The legacy-modernization case study (from the AIA Sports engagement) gets no link either.
- Rejected: **naming the employer**, which would match the cards. Rejected: **domain only, with card links**, because the link reveals the employer anyway. Rejected: **an anonymous page whose cards still link in**, because the anonymity would only be cosmetic.

## Canonical figures

| Case study | Metric | Canonical value | Card / decoration |
|---|---|---|---|
| Event pipeline | throughput | 50k+ events/s | card stat `50k+ EVENTS/S`; description says "per second", not "concurrent" |
| Event pipeline | latency | <50 ms average end-to-end | card stat `<50ms AVG LATENCY` |
| Event pipeline | availability | 24/7 uptime | card keeps `24/7 RACE UPTIME`; the source's "99.99% availability" is dropped |
| CI/CD | deploy time | −40% | card already agrees |
| CI/CD | test coverage | 80%+ | the EDF card's decorative log stops saying 94% and shows a value consistent with 80%+ (e.g. 82%) |
| Legacy modernization | bug reports / acceptance | −30% / >95% sprint acceptance | no card counterpart |

Decorative readouts (the telemetry panel, the pipeline log, its run number and duration) may show illustrative values. They must never contradict a canonical figure.

- Rejected: **99.99% availability**. It is a measured-SLA claim, so it needs a measurement method behind it; "24/7" is the figure being kept.
- Rejected: **the live cards as canonical (94% coverage)**.

## Tool lists

A card's tech list and the tools its case study names are **independent**. Datadog stays in the CI/CD diagram even though it is listed only on the Stellantis card. Jest and Mocha are not added to the EDF card. Rejected: making each card's list include its case study's tools.

## Consequences

- Anonymity means "not named, not linked". It is not unlinkability. The pipeline figures (50k+ events/s, <50 ms) and the −40% also appear on the named cards, so a reader can match a case study to its employer. That was accepted: those figures are already public under the employer's name, and the diagrams are generic reconstructions.
- Case-study copy must not mention the domain either. The source pipeline's wording ("sensors & feeds", "operator dashboards") is already domain-neutral. The motorsport vocabulary (race, pit wall, F1) stays on the card only.
- Both the card and the case study read the same metric. Where the canonical value is stored, so they cannot drift, is #12's content model.
