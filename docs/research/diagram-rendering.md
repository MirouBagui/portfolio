# Research: diagram rendering options (#9)

> Ticket: [#9 Diagram rendering options](https://github.com/MirouBagui/portfolio/issues/9) (map: #8; blocks #11, #12).
> Date: 2026-10-29. Scope: facts and costs only. The decision belongs to the prototype/grilling tickets.

## Question

Which ways of rendering the three case-study diagrams in
`docs/case-studies/source-architecture-portfolio.md` are viable in this client
(React 19.2, Vite 8, Tailwind v4, react-router 7), and what does each cost? Cost here means
route/bundle weight, build deps and CI/Docker impact, theming to `DESIGN.md`, accessibility,
mobile behaviour, maintenance and licence.

The three diagrams:

1. `flowchart LR` with 4 subgraphs, 8 nodes, `<br/>` labels and one edge label. It is wide.
2. `flowchart TD` with 9 nodes, 2 edge labels and two `style … fill:` directives (green PROD, red ROLL).
3. `stateDiagram-v2` with 6 states, labelled transitions, a cycle and a multi-line `note right of`.

## How this was measured

- Versions current on npm on 2026-10-29: `mermaid` 12.2.0, `@mermaid-js/mermaid-cli` 12.0.0,
  `beautiful-mermaid` 1.1.3, `@dagrejs/dagre` 3.1.3, `elkjs` 0.12.1, `@xyflow/react` 12.12.0,
  `puppeteer` 25.16.0. Each was checked with `npm view <pkg> version license`.
- A throwaway Vite 8.3.5 + React 19.2 app lived in a scratch dir (not in this repo). For each
  library, one dynamic `import()` was added behind a button and the app was built with
  `vite build`. Sizes are Vite's reported raw size plus gzip level 9 computed per file.
- **"Fetched" sizes** come from loading the built app in headless Chrome (puppeteer 25), rendering
  all three real diagrams, and summing the files listed in `performance.getEntriesByType('resource')`.
- For reference, the current client (`origin/main`) builds to **one JS chunk of 335.8 kB, or
  104.5 kB gzip**, plus 40.3 kB CSS (7.9 kB gzip). There is no route-level code splitting today
  (`client/src/router.tsx` imports every page eagerly).

## Headline numbers (measured)

| Option | JS fetched for the 3 diagrams (raw / gzip) | Build-time deps | Notes |
|---|---|---|---|
| (a) Mermaid 12.2.0 runtime, **default layout (ELK)** | **2.36 MB / 692 kB** (30 requests; the ELK chunk alone is 447 kB gzip) | none | The build emits 90 chunks totalling 5.3 MB / 1.53 MB gzip. Only the ones used are fetched. |
| (a') Mermaid 12.2.0 runtime, **`layout: 'dagre'`** | **929 kB / 255 kB** (30 requests) | none | Same output quality for these 3 diagrams (screenshot-checked) |
| (b) Pre-rendered SVG via mermaid-cli, inlined | **0 kB JS**; SVG markup 22.2 + 19.3 + 19.9 kB raw (4.1 + 3.4 + 4.0 kB gzip) | mermaid-cli + puppeteer: 454 MB `node_modules`, plus a Chrome download (403 MB `chrome` + 274 MB `chrome-headless-shell`) | About 0.7 s per diagram locally |
| (b'') beautiful-mermaid 1.1.3 (runtime) | 1.52 MB / 470 kB (bundles elkjs) | none | **Misrenders diagram 3's note**; see below |
| (c) Hand-built React/SVG | Estimated low single-digit kB gzip per diagram (not measured; comparable to the existing `Projects.tsx` visuals) | none | |
| (d) dagre 3.1.3 + custom React | 46.9 kB / 16.1 kB for dagre, plus your renderer | none | |
| (d) elkjs 0.12.1 (bundled) + custom React | 1.46 MB / 452 kB | none | |
| (d) React Flow (`@xyflow/react` 12.12.0) | 181.4 kB / 58.9 kB JS + 15.4 kB / 2.6 kB CSS (React deduped); a layout lib comes on top | none | |

To put these in context: option (a) with its defaults would load about 6.6× today's entire app JS
on `/architecture`. With dagre it is about 2.4×.

---

## (a) Mermaid lazy-loaded at runtime on `/architecture`

**What it is.** Call `const { default: mermaid } = await import('mermaid')` inside the route
component (or use react-router's route `lazy`, or `React.lazy`), then
`mermaid.initialize({ startOnLoad: false, … })` and `await mermaid.render(id, text)`. That
returns `{ svg }`, which you inject into the page. The render API is documented in the
[Mermaid usage docs](https://mermaid.js.org/config/usage.html). Route-level splitting is
supported by [react-router route `lazy`](https://reactrouter.com/start/data/route-object#lazy)
and [`React.lazy`](https://react.dev/reference/react/lazy). SSR is not needed.

**Weight and chunking**
- Mermaid's ESM build lazy-loads each diagram type and layout engine. Vite emitted 90 chunks,
  and the browser fetched 30 of them for these 3 diagrams (measured).
- **Mermaid 12 bundles ELK and makes it the default layout** for flowchart and state diagrams.
  The docs say: "ELK is bundled and default from v12.0.0 … `elk` is the new default layout for
  these diagrams: Flowchart, State … To go back to the previous layout, use `layout: dagre`."
  ([Layouts](https://mermaid.js.org/config/layouts.html)). With the defaults, the browser fetched
  the 1.46 MB / 447 kB gzip ELK chunk. Setting `layout: 'dagre'` in `initialize` dropped the
  route cost from 692 kB to 255 kB gzip (both measured).
- `@mermaid-js/tiny` drops ELK, but it is "designed to be used in the browser via CDN", is "not
  meant to be installed directly from npm", and does **not** support lazy loading
  ([tiny README](https://github.com/mermaid-js/mermaid/blob/develop/packages/tiny/README.md)).
  So it is not a good fit for a Vite bundle.
- Render time on localhost in headless Chrome was about 240 ms with dagre and about 520 ms with
  ELK, including chunk fetches. Expect more on real networks and mobile CPUs. This adds a
  loading state and some layout shift unless you reserve space.

**Theming to DESIGN.md**
- Only the `base` theme can be customised through `themeVariables`
  ([Theming](https://mermaid.js.org/config/theming.html)). There is a `darkMode` flag that
  "affects how derived colors are calculated" (same page).
- "The theming engine will only recognize hex colors and not color names" (same page). The
  DESIGN.md tokens `--color-border: rgba(255,255,255,0.10)` and `--color-surface: rgba(…0.03)`
  must therefore be flattened to hex equivalents, and they have to be duplicated in JS. You
  cannot pass `var(--color-accent)`. One workaround is reading `getComputedStyle` at runtime.
- `fontFamily: 'JetBrains Mono, monospace'` works as a theme variable. The `@fontsource` font is
  already loaded on the page, so inline SVG picks it up (verified in the screenshot).
- The per-node `style PROD fill:#2e7d32` directives are honoured, but they are hard-coded colours
  in the diagram source and do not follow tokens. DESIGN.md also reserves green for terminal
  prompts and status, so the diagram source may need to change regardless.

**Security.** `securityLevel` defaults to `strict`, which means "HTML tags in the text are
encoded and click functionality is disabled"
([securityLevel](https://mermaid.js.org/config/usage.html#securitylevel)). The `<br/>` line
breaks in these diagrams still rendered correctly under `strict` (verified). The diagram text is
authored by us, so there is no untrusted input anyway. Mermaid depends on `dompurify`
(`npm view mermaid dependencies`).

**Accessibility**
- Mermaid sets `aria-roledescription` to the diagram type. If the source contains
  `accTitle:` / `accDescr:`, it also adds `<title>`/`<desc>` and
  `aria-labelledby`/`aria-describedby` ([Accessibility](https://mermaid.js.org/config/accessibility.html)).
  The rendered SVGs had `role="graphics-document document"` (measured).
- Labels are HTML inside `<foreignObject>` (11–14 per diagram, measured). A screen reader can
  read them, but in DOM order and with no edges, so the flow is lost. WAI's guidance for complex
  images is a short alt plus a long description
  ([WAI complex images](https://www.w3.org/WAI/tutorials/images/complex/)). In practice that
  means adding a visible or `<details>` text version next to the diagram regardless of renderer.

**Mobile.** By default the SVG gets `width="100%"` and `style="max-width: <natural>px"`
(measured). Diagram 1's natural width is 1727 px. At a 375 px viewport it scales to about 20%,
so 13 px text renders at about 2–3 px. That is unreadable (verified by screenshot). Diagrams 2
and 3 (360 px and 540 px wide) stay readable. To fix diagram 1 you would need to either set
`useMaxWidth: false` and put it in a horizontally scrollable container, or keep a separate `TD`
variant for small screens.

**Maintenance.** This is the cheapest option to change: edit the Mermaid text and it renders.
Visual styling, though, is limited to what `themeVariables`/`themeCSS` expose.

**Licence.** Mermaid is MIT ([npm](https://www.npmjs.com/package/mermaid)). Its bundle also
contains `elkjs` (`EPL-2.0`, a mermaid dependency at ^0.9.3), `dompurify`
(`MPL-2.0 OR Apache-2.0`), `d3` (ISC), and `katex`/`cytoscape`/`marked`/`roughjs` (MIT). These
were read from each installed `package.json`. EPL-2.0 is a weak-copyleft licence, so check for
notice obligations if ELK ships.

**Reduced motion.** The generated CSS contains an `edge-animation-frame` keyframe, but it only
applies if a diagram opts into edge animation (observed in the output). Nothing animates by
default.

## (b) Build-time pre-rendered SVG

### (b1) `@mermaid-js/mermaid-cli` (`mmdc`)

- **What it is.** A CLI that renders `.mmd` to SVG/PNG/PDF using headless Chrome via puppeteer.
  It is MIT, v12.0.0, and depends on `mermaid ^12`
  ([README](https://github.com/mermaid-js/mermaid-cli), `npm view`). **Puppeteer is a peer
  dependency** (`"puppeteer": "^25.0.0"`), and the engine requirement is `node >=22.13.0`
  ([package.json](https://github.com/mermaid-js/mermaid-cli/blob/master/package.json)).
- **Install footprint (measured).** `npm i @mermaid-js/mermaid-cli puppeteer` produced 454 MB of
  `node_modules`. The puppeteer browser install then downloaded Chrome for Testing (403 MB) and
  chrome-headless-shell (274 MB).
- **npm 12 blocks install scripts by default.** With npm 12.0.2, puppeteer's postinstall did not
  run and npm printed `npm install-scripts approve`. Puppeteer's docs confirm this: "Many modern
  package managers (such as npm under the new RFC …) block dependency install scripts by default
  … running Puppeteer will throw … `Could not find Chrome`". The fix is `allowScripts` in
  `package.json` or an explicit browser install
  ([Puppeteer installation](https://pptr.dev/guides/installation)).
- **Docker impact (this repo).** The client stage is `FROM node:22-alpine`. Puppeteer says
  "Chrome does not support Alpine out of the box". You would have to install Alpine's `chromium`
  package and point `executablePath` at it, and Puppeteer warns that "Puppeteer is only
  guaranteed to work with the bundled Chromium"
  ([Troubleshooting → Running on Alpine](https://pptr.dev/troubleshooting#running-on-alpine);
  [mermaid-cli: already-installed chromium](https://github.com/mermaid-js/mermaid-cli/blob/master/docs/already-installed-chromium.md)).
  Supported Linux platforms are Debian/Ubuntu and openSUSE/Fedora
  ([System requirements](https://pptr.dev/guides/system-requirements)). Another route is the
  official image `minlag/mermaid-cli`
  ([README → Docker](https://github.com/mermaid-js/mermaid-cli#use-dockerpodman)) as a separate
  build stage.
- **`.dockerignore` excludes `*.md`** (repo root). Diagram sources inside markdown are therefore
  not in the Docker build context. Rendering at build time inside Docker needs the sources as
  `.mmd` files or a `.dockerignore` exception.
- **There is no CI workflow in the repo today** (no `.github/workflows`), so the build-time cost
  falls entirely on the Docker build or the developer's machine.
- **Cheapest variant: render locally and commit the SVGs.** This has zero CI/Docker impact. The
  catch is that a committed SVG can drift from its `.mmd` source. A check script (re-render and
  diff) would catch that, but it brings back the Chromium dependency wherever it runs.
- **Output (measured).** Each SVG has `width="100%"`, `max-width` set to its natural width, and a
  `<style>` scoped to `#my-svg`. **All files get the same `id="my-svg"` unless you pass
  `-I/--svgId`.** If you inline three of them on one page, their CSS will collide unless you set
  unique ids. Labels are HTML in `<foreignObject>`.
- **Fonts.** If you embed the SVG via `<img src>`, page fonts are not available: "External
  resources (e.g., images, stylesheets) cannot be loaded"
  ([MDN: SVG as an image](https://developer.mozilla.org/en-US/docs/Web/SVG/Guides/SVG_as_an_image)).
  So inline it instead (e.g. Vite `?raw` + `dangerouslySetInnerHTML`, or an SVGR-style
  component). *Inference, not tested:* node boxes are sized with whatever fonts the headless
  build browser has. If JetBrains Mono is not installed there, the boxes may not match the
  page's font. A `--cssFile` with `@font-face` can mitigate this.
- **Theming, accessibility, mobile.** Same as (a): `-c config.json` takes the same
  `theme: 'base'` + `themeVariables` (used in the test). Same `accTitle`/`accDescr` support,
  same mobile problem with diagram 1. Colours are frozen at build time.
- **Licence.** mermaid-cli is MIT. Puppeteer is Apache-2.0 (`npm view`). The Chrome binary is a
  build tool only and does not ship.

### (b2) Other build-time paths checked

- **`vite-plugin-mermaid` does not exist on npm** (`npm view` returned E404). No maintained,
  Mermaid-specific Vite plugin was found.
- **`rehype-mermaid` 3.0.0 / `mermaid-isomorphic` 3.1.0** (MIT) render in Node via **Playwright**
  ("you need to install Playwright and a Playwright browser … `npx playwright install --with-deps
  chromium`") ([rehype-mermaid](https://github.com/remcohaszing/rehype-mermaid),
  [mermaid-isomorphic](https://github.com/remcohaszing/mermaid-isomorphic)). They only make sense
  with a unified/rehype markdown pipeline, which this SPA does not have. They also pin
  `mermaid ^11` (`npm view mermaid-isomorphic dependencies`). The headless-browser cost is the
  same as b1.
- **`beautiful-mermaid` 1.1.3** (MIT, lukilabs) is real and pure-JS. It describes itself as
  "zero DOM dependencies" and "fully synchronous", runs ELK in-process, and supports flowchart
  and state diagrams ([README](https://github.com/lukilabs/beautiful-mermaid)). It can run in
  plain Node at build time **without Chromium** (verified: 13–127 ms per diagram). Colours can be
  CSS variables ("Pass `var(--background)` … The SVG inherits from your app's CSS"), so tokens
  could stay in CSS. Caveats found in testing:
  - **Diagram 3's `note right of ParallelRun` renders wrongly.** It became a stray node labelled
    "strict lint," and the rest of the note text was dropped (verified by screenshot). The
    package's parser has no handling for state notes (`src/parser.ts` contains no `note`).
  - Its output had **no `role`/`aria-*`/`<title>`** (grep on the output).
  - Text widths are estimated heuristically (`src/text-metrics.ts`), not measured.
  - Bundled at runtime it weighs 470 kB gzip (elkjs). It is young: first published Feb 2026,
    last npm publish 2026-02-26, last push 2026-05-06
    (`npm view beautiful-mermaid time`; GitHub API).
  - It bundles `elkjs` ^0.11 (EPL-2.0 OR GPL-3.0-or-later).

## (c) Hand-built React/SVG (or HTML/CSS) components per diagram

- **Precedent.** `client/src/components/Projects.tsx` already draws flow diagrams in plain
  Tailwind/HTML: `FlowNode` boxes joined by divs in `KnowledgeExpertVisual`, and a stage row in
  `EDFVisual`.
- **Weight.** No new dependency; just a few kB of component code (estimate, not measured).
  Nothing loads on demand and there is no loading state.
- **Build/CI/Docker.** No impact.
- **Theming.** Uses Tailwind utilities and `@theme` tokens directly, exactly like the rest of the
  site, and covers JetBrains Mono, indigo accent and border tokens. Hover/focus states can use
  the indigo accent. This is the only option where tokens are shared rather than copied.
- **Accessibility.** This option gives the best result because the structure can be semantic HTML:
  - The pipeline (diagram 2) as an `<ol>`, with the fail/pass branch as nested items.
  - The state machine as a list of transitions.
  - The SVG/connector decoration `aria-hidden`.

  The text alternative *is* the diagram, so it cannot drift. WAI
  ([complex images](https://www.w3.org/WAI/tutorials/images/complex/)) only requires the
  structure to be available as text, which this does.
- **Mobile.** Can reflow with breakpoints, e.g. diagram 1 switches `flex-row` to `flex-col`
  below `md`. This is the only option that adapts layout instead of scaling.
- **Reduced motion.** Under your control. The existing visuals animate connectors with
  `connGlow … infinite`, and `index.css` has `prefers-reduced-motion` blocks. Any new animation
  should follow DESIGN.md's "no gratuitous motion".
- **Maintenance.** This is the highest cost per change: the diagram is code, so edits need a
  developer and the `.md` source and component can drift. The diagrams are small (6–9 nodes) and
  change rarely, so the absolute cost is low. The routing of non-linear edges by hand (the cache
  feeding the orchestrator in 1, the `Retired → Increment` cycle in 3) is the hardest part.

## (d) Layout library + custom React rendering, or React Flow

- **dagre** (`@dagrejs/dagre` 3.1.3, MIT, active; last push 2026-10-24, GitHub API): 16 kB gzip
  at runtime (measured). It computes node/edge coordinates and you render the SVG yourself with
  Tailwind tokens. The diagrams are static, so the layout could also be computed once (in a
  script or test) and hard-coded. That collapses this option into (c) with auto-layout as a dev
  aid.
- **elkjs** (0.12.1, `EPL-2.0 OR GPL-3.0-or-later`, `npm view`): 452 kB gzip bundled
  (measured). It is too heavy for 3 static diagrams at runtime.
- **React Flow** (`@xyflow/react` 12.12.0, MIT): 59 kB gzip JS + 2.6 kB CSS (measured). It is
  built for interactive node editors. By default "all nodes and edges are keyboard-focusable and
  operable", with tab focus and arrow-key node moving
  ([React Flow accessibility](https://reactflow.dev/learn/advanced-use/accessibility)), so
  read-only use means turning those off. It shows an attribution link unless
  `proOptions.hideAttribution` is set, and the project asks commercial users to support it
  ([remove attribution](https://reactflow.dev/learn/troubleshooting/remove-attribution);
  [README](https://github.com/xyflow/xyflow/blob/main/packages/react/README.md)). It brings its
  own `zustand ^4`, while the app has `zustand ^5` (`npm view`). It does no automatic layout, so
  you would add dagre or ELK. That makes it over-engineered for static diagrams.

---

## Comparison

| | (a) Mermaid runtime | (b1) mmdc pre-render | (b2) beautiful-mermaid build-time | (c) Hand-built | (d) dagre + React |
|---|---|---|---|---|---|
| Route JS (gzip) | 255 kB (dagre) / 692 kB (default ELK) | 0 (≈11.5 kB SVG markup) | 0 (SVG markup) | few kB (est.) | ~16 kB + renderer |
| Build/CI/Docker | none | Chromium; Alpine-incompatible as-is; npm 12 script approval; `*.md` dockerignored | Node script only | none | none |
| Tokens | hex copied into JS config | hex frozen at build | CSS vars possible | native Tailwind tokens | native Tailwind tokens |
| Fidelity to the 3 sources | full (verified) | full (verified) | **note broken** (verified) | whatever you build | whatever you build |
| Accessibility | `accTitle`/`accDescr` + separate text alt | same as (a) | none built in | semantic HTML is the diagram | as (c) |
| Mobile | diagram 1 unreadable at 375 px unless scroll/variant | same | same (wide LR) | reflows | reflows if laid out per breakpoint |
| Change cost | edit text | edit text + re-render | edit text + re-render | edit JSX | edit graph data |
| Licence | MIT (+EPL-2.0 elkjs, MPL/Apache dompurify inside) | MIT + Apache-2.0 tooling | MIT (+EPL elkjs) | n/a | MIT |

## Recommendation (for the prototype/grilling tickets to confirm or reject)

**Lean towards (c): hand-built React components.** The only exception would be if diagrams
need to be authored or changed often by non-developers.

Reasons:
- It is the only option that uses DESIGN.md tokens natively.
- It reflows on mobile (diagram 1 is otherwise unreadable on phones).
- It turns the text alternative into semantic HTML that cannot drift.
- It adds no route weight and no build dependencies.

Its cost is per-edit developer time, which is low for 3 small, rarely changing diagrams.
Optionally, use dagre (16 kB) as a dev-time aid to get coordinates, without shipping it.

**If Mermaid authoring is a must, prefer (a) with `layout: 'dagre'`.** That means a dynamic
import on `/architecture` only, `theme: 'base'` with hex tokens, `securityLevel: 'strict'`,
`accTitle`/`accDescr` plus a visible text version, and a scroll container (or TD variant) for
diagram 1. It costs about 255 kB gzip on that route and nothing elsewhere.

**Avoid (b1) inside the current Docker build.** Alpine, Chromium and npm 12 install-script
blocking all work against it. If pre-rendering is wanted, render locally and commit the SVGs
(with unique `--svgId`s).

**Do not adopt beautiful-mermaid as-is.** It drops the state-diagram note.

## Open questions for the human

1. **Who edits the diagrams, and how often?** "Rarely, by me" favours (c). "Often / from
   markdown" favours (a).
2. **Is `/architecture` a new lazy route?** Today the router imports every page eagerly. Any
   option except (c) needs route-level splitting to keep the home page weight unchanged.
3. **Which tokens are canonical?** `client/src/index.css` `@theme` currently says bg `#050a14`,
   accent cyan `#06b6d4`, green `#10b981`. `DESIGN.md` says `#0a0a0a`, indigo `#6366f1`,
   `#4ade80`. The diagrams must target one of them.
4. **What should the PROD/ROLL colours be?** The source hard-codes `#2e7d32`/`#c62828`, but
   DESIGN.md reserves green for terminal prompts/status. Should pass/fail map to tokens instead?
5. **Mobile for diagram 1:** horizontal scroll, a stacked TD variant, or a reflowed layout?
6. **Should the markdown file stay the source of truth?** If yes, note it is `.dockerignore`d
   (`*.md`) and lives only on the local `main` checkout (not yet on `origin/main` at the time of
   writing).
7. **Is EPL-2.0 code (elkjs inside Mermaid 12 or beautiful-mermaid) acceptable in the shipped
   bundle, or should ELK stay out?** Note that with dagre layout it is not fetched, though it is
   still emitted as a chunk.

## Appendix: reproduce

```sh
# scratch dir, outside the repo
npm i mermaid@12.2.0 beautiful-mermaid@1.1.3 @dagrejs/dagre@3.1.3 elkjs@0.12.1 \
      @xyflow/react@12.12.0 react@19.2 react-dom@19.2 vite@8 @vitejs/plugin-react@6
# per variant: src/variant.ts does `await import('<lib>')` and renders the 3 diagrams; `vite build`
# then serve dist/ and record performance.getEntriesByType('resource') in headless Chrome
npm i @mermaid-js/mermaid-cli@12.0.0 puppeteer@25   # then: node node_modules/puppeteer/install.mjs
mmdc -i d0.mmd -o d0.svg -c cfg.json -b '#0a0a0a'   # cfg.json = { theme: 'base', themeVariables: {...} }
```
