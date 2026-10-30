# The live cyan palette is canonical; every text token passes AA

The colour tokens in `client/src/index.css` (`@theme`) are the canonical palette. `DESIGN.md` is rewritten to describe the site as it was rebuilt in July (`aa75065`). Before that rewrite it still described the May indigo design, and both the doc and the live CSS were each treated as the reference in different places. Decided in #15 (map #8). Code changes for the existing site are tracked in #17, which sits outside the map.

## Decisions

- **Cyan, not indigo.** The live site has been cyan since July, and `DESIGN.md`'s indigo predates that rebuild. Rejected: **repainting to indigo** (about 205 hard-coded colour values), and **a hybrid**. `DESIGN.md` claimed indigo `#6366f1` on `#0a0a0a` was 7.2:1. The measured ratio is 4.43:1, which fails AA.
- **Cyan is the only interactive accent.** It's used for links, focus and buttons. The five project hues in `components/accents.ts` are card identity only and never mark something as interactive. **The `/architecture` page uses no project hue**, because a hue would match a case study to its card, which ADR-0001 rules out. Rejected: case studies taking their project's hue.
- **Status colours mean status and nothing else.** `--color-status-pass` is `#10b981` (7.81:1) and is the existing `--color-terminal-green` renamed. A new `--color-status-fail` is `#ef4444` (5.26:1). Diagrams may use them only for pass/fail meaning, and always next to a text label (✓/✗, pass/fail, a path name), so colour is never the only signal. Rejected: monochrome diagrams, and unrestricted colour.
- **Every text token passes WCAG AA** (4.5:1 body, 3:1 large text), measured against `--color-bg-primary` `#050a14`.
  - `--color-text-muted` changes from `#64748b` (4.16:1) to `#94a3b8` (7.73:1).
  - A new `--color-text-faint` (`#475569`, 2.61:1) is allowed **only** on text marked `aria-hidden="true"`, such as decorative readouts. It's never used for content.
  - Rejected: fixing the whole site inside the map's spec, and accepting the current contrast.
- **The architecture page and its diagrams use tokens only.** That means Tailwind theme utilities or `var(--color-*)`, with no hex or `rgba()` values in their components. Hand-built SVG diagrams pick up tokens directly. If #11 ends up on the Mermaid fallback, it reads the tokens at runtime through `getComputedStyle` and passes them to `themeVariables`. Rejected: following the existing hard-coded style.
- **The body font is Space Grotesk.** It was already the body font in the live CSS but was never loaded, so it falls back to the system font. It gets loaded through `@fontsource/space-grotesk`, and the unused `@fontsource/inter` is removed (#17). JetBrains Mono stays the system-voice font. Rejected: Inter, which `DESIGN.md` had and the live CSS did not.
- **`DESIGN.md` is fully resynced in this decision.** Its hero, background, icon, layout and accessibility sections all described the May build. Features that were specified but never built (project filtering, blog filtering, the interaction-state table, the blog pager) move to a "Not built" appendix rather than being deleted. Rejected: deleting them, and leaving them inline as "planned".

## Consequences

- Until #17 lands, `index.css` and the component colours lag behind the spec. `DESIGN.md` marks each token that isn't live yet with "→ #17".
- The `/architecture` work (#11, #13, #14) builds against the spec, not the current home page. Muted text there is `#94a3b8` even while the home page still shows `#64748b`.
- Focus is already compliant: `index.css` has had a global cyan `*:focus-visible` outline since `aa75065`, and no component overrides it. New pages must not override it either.

> **Amended (2026-10-30, #11):** an earlier version of this ADR said no focus style existed. That came from searching components only and missing the global rule in `index.css`. Verified in the browser: Tab gives a 2px solid `#06b6d4` outline.
