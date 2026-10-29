# Portfolio (NestJS)

## Commands

```
npm run start:dev   # watch mode (primary dev loop)
npm run build        # build client + server, copy client/dist → server/dist/public
npm run start:prod   # node server/dist/main
npm run test         # unit tests (Jest, rootDir=server, *.spec.ts)
npm run test:e2e     # e2e tests (Jest, config=server/test/jest-e2e.json, *.e2e-spec.ts)
npm run lint         # eslint --fix (flat config, eslint.config.mjs)
npm run format       # prettier --write
```

## Architecture

- **Client**: `client/` — React 19 + Vite + Tailwind v4 + Three.js SPA
- **Server entry**: `server/src/main.ts` → listens on `PORT` or `3000`, serves the built client from `server/dist/public`
- **Module**: `server/src/app.module.ts`
- Two packages (`client/`, `server/`) driven by root `package.json` scripts, no database, no external services

## Available skills

- **react** — React best practices (hooks, components, state, performance)
- **typescript** — Strict typing, generics, utility types, safe patterns
- **nestjs** — Modules, DI, validation, testing, architecture
- **mongodb** — Schema design, queries, indexes, aggregation, Mongoose

## Tooling quirks

- **TypeScript**: `module: "nodenext"`, `moduleResolution: "nodenext"` — use `import`/`export` ESM syntax in source, but compiled output runs as CommonJS via `ts-jest`
- **ESLint**: flat config (`eslint.config.mjs`) with `@typescript-eslint/recommendedTypeChecked`; `no-explicit-any` is off, `no-floating-promises` and `no-unsafe-argument` are warnings
- **Prettier**: `singleQuote: true`, `trailingComma: "all"`, ESLint rule enforces `endOfLine: "auto"` (Windows/Unix newline tolerant)
- **Jest**: unit tests use root `package.json` jest config with `rootDir: "server"`; e2e tests use separate `server/test/jest-e2e.json`

## Design System

See [DESIGN.md](./DESIGN.md) for the full system. Key tokens:

- **Aesthetic**: Industrial/Utilitarian — terminal is identity, not theme
- **Memorable**: "Clean and technical" — whispers competence, doesn't shout
- **Colors**: bg `#0a0a0a`, accent `#6366f1` (indigo), terminal-green `#4ade80`, border `rgba(255,255,255,0.10)`
- **Fonts**: Inter (body/headings), JetBrains Mono (terminal UI, code, tags)
- **Motion**: terminal-fade-in `400ms ease-out`, hover transitions `150ms ease-in-out`, no scroll-jacking
- **Layout**: Terminal split-pane hero (30/70), 2-column project grid, fixed navbar with backdrop-blur


## Agent skills

Skills installed via `npx skills@latest add mattpocock/skills`. Run once per session if needed.

- **[issue-tracker](docs/agents/issue-tracker.md)** — GitHub Issues on `MirouBagui/portfolio` (public); `gh` commands and wayfinding operations (map, sub-issues, blocking)
- **[triage-labels](docs/agents/triage-labels.md)** — five canonical triage states used by `/triage`
- **[domain](CONTEXT.md)** — shared glossary and key files; read this before touching any component
- **ADRs** — `docs/adr/` — architectural decisions; create one when making a non-obvious design choice

### Available skills (invoke by name)

| Skill | When to use |
|-------|-------------|
| `/grill-with-docs` | Before starting any feature — sharpens plan, updates CONTEXT.md |
| `/grill-me` | Stress-test a plan before coding |
| `/to-spec` | Turn conversation into a spec |
| `/to-tickets` | Break a spec into GitHub issues |
| `/implement` | Build from an existing spec or issue files |
| `/tdd` | Red-green-refactor loop |
| `/code-review` | Review changes vs main |
| `/diagnosing-bugs` | Disciplined debug loop |
| `/improve-codebase-architecture` | Scan for deepening opportunities |
| `/triage` | Move GitHub issues through triage states |
| `/wayfinder` | Plan large multi-session work |
