# Design System — Amir SAOUDI Portfolio

> Describes the site as rebuilt in July 2026 (`aa75065`). Colour and type are canonical per [ADR-0003](docs/adr/0003-canonical-colour-tokens.md). Anything the live code doesn't do yet is marked **→ #17**.

## Memorable Thing

**"Clean and technical"** — whispers competence, doesn't shout.

Every design decision serves this: the site should feel like a terminal you trust to run production systems, not a portfolio that begs for attention.

---

## Aesthetic

**Industrial / Utilitarian** — function-first, data-dense. The terminal is identity, not a theme. Decoration is allowed when it also communicates (telemetry bars, pipeline logs, live dots).

Character references: Stripe docs, Linear, actual terminal emulators (iTerm2, Warp), GitHub Dark.

---

## Color System

Tokens live in `client/src/index.css` under `@theme`, so Tailwind exposes them as utilities (`text-accent`, `bg-surface`, …). Contrast ratios are measured against `--color-bg-primary`.

| Token | Value | Contrast | Usage |
|-------|-------|----------|-------|
| `--color-bg-primary` | `#050a14` | — | Page background |
| `--color-surface` | `rgba(10,16,28,0.85)` | — | Card and pane surfaces |
| `--color-border` | `rgba(6,182,212,0.12)` | — | Card edges, dividers |
| `--color-text-primary` | `#e2e8f0` | 16.07:1 | Body text, headings |
| `--color-text-muted` | `#94a3b8` **→ #17** (live: `#64748b`, 4.16:1) | 7.73:1 | Secondary text, captions, tags, metadata |
| `--color-text-faint` | `#475569` **→ #17** | 2.61:1 | **Only** text marked `aria-hidden="true"`, i.e. decorative readouts. Never content. |
| `--color-accent` | `#06b6d4` (cyan) | 8.16:1 | Links, focus, buttons, section labels |
| `--color-accent-hover` | `#22d3ee` | 10.96:1 | Hover state of accent elements |
| `--color-status-pass` | `#10b981` **→ #17** (live as `--color-terminal-green`) | 7.81:1 | Pass / healthy / available |
| `--color-status-fail` | `#ef4444` **→ #17** | 5.26:1 | Fail / rollback / error |

**Rules**
- **Cyan is the only interactive accent.** Anything clickable or focusable uses it, and nothing else does.
- **Status colours mean status.** Pass and fail only, always next to a text label (✓/✗, `PASS`/`FAIL`, a path name). Colour is never the only signal, and status colours are never used for links or buttons.
- **Project hues are identity only.** `components/accents.ts` gives each project card a hue (cyan, blue, green, violet, orange) for its bar, glow and visual. They never mark something as interactive. The `/architecture` page uses **no** project hue, because a hue would match an anonymous case study to its card (ADR-0001).
- **Every text colour passes WCAG AA** (4.5:1 body, 3:1 large), unless it's decorative and `aria-hidden`.
- **New code uses tokens only.** No hex or `rgba()` values in components. The existing components hold about 205 colour literals, a legacy that #17 reduces. The `/architecture` page and its diagrams use tokens only.

---

## Typography

| Role | Font | Weight | Size |
|------|------|--------|------|
| Body | Space Grotesk | 400 | `1rem` |
| Display (h1, hero) | Space Grotesk | 700 | `clamp(38px, 3.2vw, 52px)`, tracking `-2.5px` |
| Section heading (h2) | Space Grotesk | 700 | `clamp(34px, 3.5vw, 52px)`, tracking `-1.5px` |
| Section label | JetBrains Mono | 400 | `text-xs`, tracking `2.5px`, accent, `// UPPERCASE` |
| Terminal UI, readouts | JetBrains Mono | 400 | `10px`–`0.875rem` |
| Tech tags | JetBrains Mono | 400 | `10px` |
| Name/brand | Space Grotesk | 700 | `text-lg`, `<Amir />` with accent brackets |

**Stack**
- **Space Grotesk** for reading: body, headings, prose.
- **JetBrains Mono** for the system voice: terminal cards, prompts, labels, readouts, tags, code. Applied via `.font-mono` and `code, kbd, pre, samp`.

**Loading:** both fonts are served by `@fontsource/*` with `font-display: swap`, latin subset. JetBrains Mono is loaded. Space Grotesk is declared but not yet loaded, so it currently falls back to the system font **→ #17**.

---

## Spacing & Layout

Base unit: 4px (Tailwind defaults).

| Element | Value |
|---------|-------|
| Content width | `mx-auto max-w-[1200px]` (hero: `max-w-[1320px]`) |
| Horizontal gutter | `px-6` → `sm:px-12` → `lg:px-[72px]` |
| Section padding | `py-[120px]` (Contact `py-[140px]`), with `scroll-mt-16` for the fixed nav |
| Card grid gap | `gap-5` (projects), `gap-7` (skills) |

### Page Structure
- **Navbar:** fixed, `backdrop-blur-md`, bottom border. It hides on scroll-down and shows on scroll-up (`useScrollDirection`). Links: Home, Skills, Projects (hash links), Blog. The active link has `aria-current="page"`.
- **Home** (`/`) is a single scroll page: Hero (`#home`) → Skills (`#skills`) → Projects (`#projects`) → Contact (`#contact`) → Footer.
- **Other routes:** `/projects/:id` (project detail), `/blog` (placeholder), `*` (404).
- **Background:** `ParticleBackground` is a 2D canvas behind all content, and it renders statically under reduced motion. On pointer-fine devices, `CustomCursor` replaces the native cursor.

### Hero
- Two columns from `lg` (single column below):
  - **Left:** the status pill, specialisation label, name (h1), typed role (`useTypingEffect`) and calls to action.
  - **Right:** a terminal card (`portfolio@dev — zsh`) with boot lines and a blinking cursor.
- The status pill ("AVAILABLE FOR WORK") uses `status-pass` with a `glowPulse` dot.
- Floating geometric shapes are decorative.

### Section header pattern
A centred block: an accent mono label (`// EXPERTISE`), then the h2, then a muted subtitle (`max-w-[520px]`).

---

## Component Patterns

### Skill card
A category card with a title, per-skill progress bars (`TelemetryBar`, width animates in on reveal) and tech tags. Two columns from `md`.

### Project cards
- **Featured card** (one, full width): a two-pane layout from `lg`. The left pane holds the description and a project-specific visual. The right pane (`360px`, mono) holds stat boxes and live readouts.
- **Grid cards:** 1 → 2 (`md`) → 3 (`lg`) columns. Each has a project visual on top (AIA video tiles, the EDF pipeline log, the knowledge-expert flow, and so on), then the title, description and tech tags.
- Cards are `rounded-lg`, with a thin border and a translucent surface. The project hue (`accents.ts`) drives the bar gradient and glow.
- **Figures:** stat boxes and badges read canonical figures by key from the `figures` map in config, never literals (ADR-0002; implementation pending). Decorative readouts may be literal but must not contradict a canonical figure (ADR-0001).

### Terminal surfaces
- These are the hero terminal card, the pipeline log and the 404 page.
- Prompt pattern: `user@portfolio:$ command`. The user is in `status-pass`, the host in accent, and the separators are muted.
- Output follows terminal conventions: `✓` lines in `status-pass`, errors in `status-fail`.
- The hero card carries a decorative 1px accent sweep (`scanline`, 5s, `aria-hidden`).

### Architecture diagram (terminal trace, ADR-0004)
- Each diagram is terminal output in a terminal card: a `$ <command>` prompt, then the flow, then a closing `✓` status line.
- **Connectors:** `│ ▼ ├──▶ └──▶ ◀──` in accent.
- **Segment roles and tokens:** node names in `text-primary`, sub-labels in muted, figures in `accent-hover` (from the `figures` map), and status in `status-pass`/`status-fail` with a `✓`/`✗` label.
- **Width:** fits 360px, about 40 monospace columns, with no sideways scroll. Shorten long labels or move them to their own line.
- **Motion:** lines appear once when the diagram scrolls into view, then it stays still; the cursor stops once the trace finishes. With reduced motion, the full trace shows immediately.
- **Accessibility:** the trace is `aria-hidden`, and `diagramText` is the accessible version, in a `<details>` labelled `$ cat diagram.txt` under the trace.

### Architecture page (results first, ADR-0005)
- **Header:** a `// ARCHITECTURE` label, a headline question, a one-line intro, and tag chips that link to `#<id>` (rounded-full, border, mono; hover in accent).
- **Case-study section:** full width with a top border. Its head row has `NN // TAG` above the title and role line on the left, and the result figures in large mono (`clamp(36px,4.5vw,60px)`) on the right.
- **Body (desktop):** two columns. The trace is pinned in the left column (`max 460px`, sticky `top-24`); the problem (17px, primary) and decisions run on the right. On a phone they stack in this order: figures, trace, problem, decisions.
- **Order:** pipeline → CI/CD → migration. Each section has a stable `id` (`event-pipeline`, `cicd-pipeline`, `strangler-fig`) and scrolls with `scroll-mt` so the fixed navbar doesn't cover it.

---

## Motion

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Section reveal (fade + rise 36px) | 700ms | default | Enters viewport (`useReveal`), staggered 100ms per card |
| Telemetry bar fill | 1600ms | `cubic-bezier(.16,1,.3,1)` | On reveal |
| Navbar hide/show | 300ms | default | Scroll direction |
| Cursor blink | 1.06s steps | — | Continuous |
| Decorative loops (`float*`, `spinSlow`, `glowPulse`, `liveDot`, `dataBlip`, `connGlow`, `scanline`) | 2s+ | ease | Continuous |

**No** scroll-jacking or parallax. Entrance stagger is limited to card grids, at 100ms steps.

**Reduced motion:** `prefers-reduced-motion: reduce` turns off every CSS animation (`* { animation: none !important }`) and smooth scrolling. Reveal and bar transitions use `motion-reduce:` variants to render in their final state. JS-driven motion (the particle canvas and the custom cursor) checks the media query itself.

---

## Iconography

- **Terminal semantics first:** `$` for prompts, `//` for section labels, `├──`/`└──` for trees, `✓`/`✗` for status, and `ACTIVE`/`DONE`/`BUILDING` as labels.
- **`lucide-react`** is used sparingly for affordances text can't carry, such as the back arrow on project detail and the contact icons. Size them to the adjacent text, and keep them decorative (`aria-hidden`) whenever a visible label is next to them.

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| `<640px` | Single column everywhere, `px-6` gutter |
| `sm` 640px+ | `px-12` gutter |
| `md` 768px+ | Two-column skill and project grids |
| `lg` 1024px+ | Two-column hero, featured card splits into two panes, three-column project grid, `px-[72px]` gutter |
| Beyond | Constrained by `max-w-[1200px]`/`[1320px]`, no scaling past a comfortable reading width |

Navbar: the same four links at every width, with no hamburger menu.

---

## Accessibility

| Requirement | Spec |
|-------------|------|
| Contrast | Every text pair meets WCAG AA (4.5:1 body, 3:1 large) against `#050a14`; see the ratios in the Color System. Text below AA must be decorative and `aria-hidden`. Live violations: muted `#64748b`, and the literals `#334155`/`#475569`/`#1e293b` on real labels **→ #17** |
| Focus-visible | A visible outline on every interactive element: `outline: 2px solid var(--color-accent); outline-offset: 2px` on `:focus-visible`. Live: a global `*:focus-visible` rule in `index.css`. Components must not override it. |
| Touch targets | Minimum 44px for interactive elements |
| Landmarks | `<nav aria-label="Main navigation">`, `aria-current="page"` on the active nav link, one `<section id>` per home section |
| Colour as signal | Never the only signal: status colours always come with a text label or glyph |
| Diagrams | Every architecture diagram has a text alternative (`diagramText`, ADR-0002). Its presentation is open on map #8. |
| Reduced motion | See Motion |
| Errors | Terminal-style error output uses `role="alert"` (404) |

---

## File Organization

| File | Purpose |
|------|---------|
| `client/src/index.css` | `@theme` tokens, global styles, keyframes, reduced-motion rules |
| `client/src/portfolio.config.ts` | Single source of truth for displayed data: projects, case studies, figures, skills, socials, meta |
| `client/src/stores/portfolioStore.ts` | Exposes the config to components |
| `client/src/components/accents.ts` | Per-project identity hues |
| `client/src/components/*.tsx` | Home sections (Hero, Skills, Projects, Contact, Footer), Navbar, ParticleBackground, CustomCursor |

Add new design tokens to `index.css` `@theme`. New components use tokens, Space Grotesk for prose, JetBrains Mono for the system voice, and cyan as the only accent.

---

## Appendix — Not built

These patterns were specified in the May design and never built. Nothing schedules them, so they are ideas, not commitments. Pick one up through a ticket, not by assuming it's current.

- **Project filtering:** an `ls --filter=<tag>` prompt above the grid, with tags derived from the project tech arrays. Empty state: `ls: no entries match filter "<tag>"` with a reset prompt.
- **Blog filtering:** mono tag chips under `// blog`. Empty state: `No posts tagged "<tag>"` with a link back to the full listing.
- **Blog post detail (terminal pager):**
  - Header `$ cat blog/<slug>.md`, body as rendered markdown in mono, footer `END — press Esc to return to /blog`.
  - States: loading `$ fetching post...`, not found `$ cat: blog/<slug>.md: No such post`, error `$ curl: upstream timeout`.
- **Interaction-state table** (loading, empty, error, partial for data-backed views):
  - Loading: skeletons and a blinking `_`.
  - Empty and error: terminal command output, never boilerplate. Errors show stale data plus a refresh prompt.
  - It only matters once the content is fetched; today it is static config.
- **CRT scanline overlay** on terminal surfaces: an `::after` repeating gradient at 8% black over 2px bands. The live hero card has a single moving 1px accent sweep (`scanline` keyframe) instead.
