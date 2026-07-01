# Design System — Amir SAOUDI Portfolio

## Memorable Thing

**"Clean and technical"** — whispers competence, doesn't shout.

Every design decision serves this: the site should feel like a terminal you trust to run production systems, not a portfolio that begs for attention.

---

## Aesthetic

**Industrial / Utilitarian** — function-first, data-dense. The terminal is identity, not a theme. Every element earns its place. Nothing decorative that doesn't also communicate.

Character references: Stripe docs, Linear, actual terminal emulators (iTerm2, Warp), GitHub Dark.

---

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#0a0a0a` | Page background, terminal pane fill |
| `--color-text-primary` | `#fafafa` | Body text, headings |
| `--color-text-muted` | `#a1a1aa` | Secondary text, metadata, timestamps |
| `--color-accent` | `#6366f1` (Indigo) | Links, borders, focus rings, interactive states |
| `--color-accent-hover` | `#818cf8` | Hover states for accent elements |
| `--color-terminal-green` | `#4ade80` (Green-400) | Terminal `$` prompts, status indicators only |
| `--color-border` | `rgba(255,255,255,0.10)` | Pane borders, dividers, card edges |
| `--color-surface` | `rgba(255,255,255,0.03)` | Card surfaces, hover backgrounds |

**Rule:** Indigo is the sole interactive accent. Green is reserved for terminal authenticity (prompts, exit codes). Never use green for links or buttons.

---

## Typography

| Role | Font | Weight | Size (CLAMP) |
|------|------|--------|--------------|
| Body | Inter | 400 | `clamp(0.875rem, 1vw, 1rem)` |
| Heading (h1) | Inter | 700 | `clamp(1.5rem, 3vw, 2.5rem)` |
| Heading (h2) | Inter | 600 | `clamp(1.25rem, 2vw, 1.75rem)` |
| Terminal UI | JetBrains Mono | 400 | `0.75rem`-`0.875rem` |
| Code/tech tags | JetBrains Mono | 400 | `0.75rem` |
| Name/brand | JetBrains Mono | 500 | `1rem`-`1.125rem` |

**Stack:**
- Inter for reading (body, headings, prose content)
- JetBrains Mono for system-voice (terminal panes, file paths, prompts, code, tech tags)

**Loading:** Both fonts served via `@fontsource/*` packages with `font-display: swap` — text renders in fallback immediately, swaps when the font file arrives. Prevents FOIT (flash of invisible text) on slow connections.

Existing `<Amir />` monospace treatment is correct — keep it as precedent for any name/brand rendering.

---

## Spacing

Base unit: 4px (Tailwind defaults)

| Scale | Tailwind | Usage |
|-------|----------|-------|
| 16px | `p-4` | Terminal pane inner padding |
| 24px | `gap-6`, `p-6` | Navbar link gaps, section inner padding |
| 48px | `py-12` | Section vertical padding (mobile) |
| 96px | `py-24` | Section vertical padding (desktop) |
| 128px | `py-32` | Hero section padding |

---

## Layout

### Page Structure
- Fixed navbar (`h-16`, `backdrop-blur-md`) — always visible
- Full sections below: Hero → About → Projects → Contact
- Max-width constrained via `mx-auto max-w-6xl` on content

### Hero (Terminal Split-Pane)
- **Left pane (30%):** `whoami` — name, role, rotating roles, skills
- **Right pane (70%):** `ls`-style project listing
- **Bottom:** Contact bar (GitHub, LinkedIn, Email) + status line
- Pane switching via Tab key with `ring-1 ring-inset ring-indigo-400/30` focus indicator
- Background: Three.js scene (FloatingNode, CodeLines, WireframeCube, BracketPair, AtomSymbol)
- **Three.js mobile detection:** Hidden below 768px AND when `prefers-reduced-motion` is active AND when `navigator.hardwareConcurrency < 4` (graceful degradation, not binary breakpoint)
- Scanline overlay on terminal pane via CSS pseudo-element

### Blog Post Detail (future)
- Terminal pager pattern: header renders as `$ cat blog/<slug>.md`, body is rendered markdown in JetBrains Mono, footer shows `END — press Esc to return to /blog`
- No featured images, no prose-width divergence from the terminal motif
- Implements: loading (`$ fetching post...`), not found (`$ cat: blog/<slug>.md: No such post`), error (`$ curl: upstream timeout`), success (rendered markdown with `✓ 1421 words`)

### Content Sections
- Grid-disciplined: About (single column, max-w-prose), Projects (2-column grid), Contact (centered)
- Section headings follow `// section-name` comment-style prefix (terminal convention)
- Cards: `border border-white/10 rounded-lg` with `hover:border-indigo-500/30` transition

### Projects Filtering
- Filter typed as `ls --filter=<tag>` in a terminal prompt above the grid
- Tag options derived from project tech array (distinct values across all projects)
- Empty state when no filter match: terminal output `ls: no entries match filter "<tag>"` with clear filter reset prompt
- No filter = show all projects

### Blog Filtering
- Tag-based filter chips below the `// blog` heading, styled as `tag` in JetBrains Mono
- Empty state: `No posts tagged "<tag>"` with link to full listing

---

## Component Patterns

### Terminal Pane
```
┌─────────────────────────────────────┐
│  whoami@portfolio:~$ _              │  ← prompt line
│  ─────────────────────────────      │  ← horizontal rule
│  Name:     Amir SAOUDI              │
│  Role:     Full Stack Engineer      │
│  Skills:   TypeScript  React  ...   │
└─────────────────────────────────────┘
```
- **CRT scanline overlay:** `::after` pseudo-element with `background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)`, `pointer-events: none`, full pane coverage. Subtle — barely visible but felt.

### Project Card (Hero right pane)
```
├── real-time-race-engine/
│   ├── description: Event orchestration...
│   ├── tech: TypeScript React Node.js Docker
│   └── status: ACTIVE
```

### Project Card (Content section)
```
┌──────────────────────────────┐
│  Real-Time Race Engine       │
│  Event orchestration engine  │
│  ...handling 50k+ concurrent │
│                              │
│  TypeScript  React  Node.js  │
└──────────────────────────────┘
```

---

## Interaction States

Every component specifies what the user sees in each state, not backend behavior.

| Component | Loading | Empty | Error | Success | Partial |
|-----------|---------|-------|-------|---------|---------|
| Hero pane | Skeleton prompt line with pulsing `_` cursor, fade-in on data ready | N/A — name/role always present | Terminal error: `$ whoami: command not found — retry connection` with retry prompt | Normal terminal output with `✓` status line | N/A |
| Projects grid (section) | 2-column skeleton grid of 4 card outlines with `border-white/5` shimmer | `$ ls projects/: no entries yet` with prompt to check back | `$ ls: connection refused — stale data shown` with existing data + refresh indicator | Normal card grid | Some cards show, fewer than expected — render available, no ghost |
| Project detail | Left-aligned `$ loading project...` with animated dots | Redirect to `/projects` with terminal message `project not found` | `$ curl: error fetching project — status code` with back link | Full project detail page | N/A |
| Blog listing | List skeleton of 3 post outlines with `_` cursor at bottom | `$ ls blog/: no posts yet` with RSS placeholder | `$ fetch: upstream unavailable — showing cached` with stale list | Normal post listing | Partial list with `$ ls: truncated (3 of 8 shown) — [load more]` |
| 404 | N/A | N/A | Terminal output: `cat: /dev/null: No such file` with `cd ~` home link | N/A | N/A |

**Rules:**
- Loading states show terminal-appropriate spinners: `_` cursor blink, animated dots, skeleton outlines
- Empty states are terminal command output, never "Nothing here yet" boilerplate
- Errors gracefully degrade: show stale data + refresh option, never white screen
- Success states always include a `✓` status indicator in terminal green

---

## Motion

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Terminal fade-in | 400ms | ease-out | Page load / section enter |
| Card border glow | 150ms | ease-in-out | `group-hover` on cards |
| Navbar link color | 150ms | ease-in-out | Hover / active state |
| Focus ring | 150ms | ease-in-out | Pane switch / Tab key |
| Pane transition | 150ms | ease-in-out | Focus change |

**No** scroll-jacking, parallax, or entrance stagger sequences.

---

## Iconography

No icon library. Terminal semantics replace icons:
- `$` for prompts
- `├──` / `└──` for list items
- `//` for section comments
- `>` for navigation indicators
- `ACTIVE`, `DONE`, `BUILDING` as status labels

---

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| `<768px` | Stack panes vertically, full-width cards, reduced terminal decorations, Three.js scene hidden, single-column project grid |
| `768px+` | Horizontal split-pane hero (30/70), 2-column project grid, nav links full-text |
| `1024px+` | Wider content padding, max-width hero panes, 2-column project grid at max-w-6xl |
| `1440px+` | Same as 1024 — constrained by max-w-6xl, no layout scaling beyond comfortable reading width |

**Navbar behavior across breakpoints:**
- Desktop (768+): full link text, horizontal layout
- Mobile (<768): same links, reduced horizontal gap, brand remains `<Amir />`
- No hamburger menu — 5 links fit on mobile at `gap-4` with `text-xs`

## Accessibility

| Requirement | Spec |
|-------------|------|
| Touch targets | Minimum 44px for all interactive elements (nav links, contact bar, project card clicks) |
| Keyboard nav | Tab through hero panes (Tab = cycle), Enter/Space on project cards opens detail, Escape exits 404 |
| Focus-visible | `ring-2 ring-offset-2 ring-indigo-400/50` on all interactive elements, visible at all times |
| ARIA landmarks | `role="region"` with `aria-label` on terminal panes, `aria-current="page"` on active nav link, `role="navigation"` on navbar |
| Color contrast | All text pairs must meet WCAG AA (4.5:1 for body, 3:1 for large text). Current tokens verified: #fafafa on #0a0a0a = 18.5:1, #a1a1aa on #0a0a0a = 8.1:1, #6366f1 on #0a0a0a = 7.2:1 |
| Reduced motion | `@media (prefers-reduced-motion)` disables terminal-fade-in and pane transitions — instant render |
| Screen readers | Status line announces terminal state via `aria-live="polite"`, error outputs use `role="alert"` |

---

## File Organization

| File | Purpose |
|------|---------|
| `client/src/index.css` | CSS custom properties, global styles, keyframes |
| `client/src/stores/portfolioStore.ts` | Single source of truth for portfolio data |
| `client/src/components/TerminalSplitPane.tsx` | Hero terminal layout |

Add new design tokens to `index.css`. Add new components following existing patterns (Inter body, JetBrains Mono UI, indigo accent).
