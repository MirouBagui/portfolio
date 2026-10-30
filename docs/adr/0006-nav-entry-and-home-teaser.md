# The architecture page gets a nav link, a phone menu and a home teaser after Projects

Visitors reach `/architecture` in two ways: an `Architecture` link in the main nav, and a teaser strip on the home page between Projects and Contact. Below 640px the nav links move behind a `$ menu` toggle, because the current row has no room for a fifth link. Decided in #14 (map #8).

## Decisions

- **Label: `Architecture`.** It matches the URL and the page's `// ARCHITECTURE` label. Rejected: **`Case studies`**, which doesn't match the URL or the page label; **`Systems`**, which is vague.
- **Order:** Home · Skills · Projects · Architecture · Blog · Services. The architecture page comes straight after the projects it backs up. Services stays in the last slot, where freelance clients look for it (they win ties, map #8). Rejected: Services before Architecture; Architecture last.
  - The Services link and page live on the unmerged `feat/security-audit-service` branch. Whichever of the two ships first adds its link at its slot in this order. Nothing about the Services page itself is decided here.
- **Phones (below `sm`, 640px): a `$ menu` toggle.** This replaces DESIGN.md's "same four links at every width, no hamburger" rule. Measured on the dev server: at 360–430px the four current links end 24px from the right edge. Adding `Architecture` pushes the row 50px past the edge, and adding `Services` as well makes it 130px. The nav is fixed, so the extra links are cut off without any sign. From 640px up all six fit inline.
  - The toggle is a mono `$ menu` button with `aria-expanded` and `aria-controls`. It opens a full-width list of every link, each row at least 44px tall (DESIGN.md's touch-target rule). The list closes on navigation, on Escape (focus returns to the button), and when the viewport grows past `sm`. From `sm` up the links stay inline, as today.
  - Rejected: **hiding the Home, Skills and Projects links on phones.** It needs no new code, but phone users lose three entries, and a seventh link would break the row again. Rejected: **a second link row that scrolls sideways**, which hides links off-screen, the same failure in a new place.
- **The active link is matched by path for page links.** Today a link counts as active only when pathname plus hash equals its `to`. That means `/architecture#event-pipeline`, which the header chips produce (ADR-0005), would highlight nothing. Page links (`/architecture`, `/blog`, `/services/…`) are active when the pathname matches. Hash links keep the exact match.
- **Teaser placement: between Projects and Contact.** The home page reads: the work, then how it was built, then the call to contact. Rejected: **between Skills and Projects**, where it comes before the work it explains; **a third hero button instead of a strip**, which gives the case studies no content on the home page.
- **Teaser shape:**
  - A section `#architecture` with the standard section header: the `// ARCHITECTURE` label, the architecture page's headline question as the h2, and a muted subtitle.
  - Then three rows in `caseStudies` order. Each row shows `NN // TAG`, the case-study title and its lead result figure, and the whole row links to `/architecture#<id>`.
  - Then a closing link to `/architecture`.
  - The rows read `caseStudies` and `figures` from the store, so the teaser cannot drift from the page (ADR-0002).
  - The lead figure is each case study's first `result.figures` key: 50k+ events/s, −40% deploy time, −30% bug reports.
  - **No diagram on the home page.** The teaser imports nothing from the diagram registry, so diagram code stays off the home bundle (ADR-0002).
  - Rejected: **the same rows without figures**, which drops the strongest hook for a skimming reader; **a one-line link**, which says nothing about what is behind it.

## Consequences

- The teaser shows 50k+ events/s and −40% a short scroll below the named Stellantis and EDF cards with the same values, so it makes it easier to match a case study to its card. ADR-0001 already accepts that matching, because those figures are public under the employer's name. The teaser adds no link, name or domain word.
- The teaser's exact words (subtitle, closing link) join the voice/copy pass on map #8. The section's structure is fixed here.
- The menu is the nav's first JavaScript state beyond hide-on-scroll. The nav still hides on scroll-down, so the open list is part of the nav and hides with it.
- On desktop the inline links stay 20px tall, below DESIGN.md's 44px touch-target rule. That gap existed before this decision and is outside the ticket. The phone menu meets the rule.
- `#architecture` becomes a home-page section id. It is not added to the nav as a hash link: the nav points at the page.
