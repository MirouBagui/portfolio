# Portfolio (NestJS)

## Commands

```
npm run start:dev   # watch mode (primary dev loop)
npm run build        # nest build → dist/
npm run start:prod   # node dist/main
npm run test         # unit tests (Jest, rootDir=src, *.spec.ts)
npm run test:e2e     # e2e tests (Jest, config=test/jest-e2e.json, *.e2e-spec.ts)
npm run lint         # eslint --fix (flat config, eslint.config.mjs)
npm run format       # prettier --write
```

## Architecture

- **Entry**: `src/main.ts` → listens on `PORT` or `3000`
- **Module**: `src/app.module.ts` (single module, no imports yet)
- **Build output**: `dist/` (deleted on rebuild via `nest-cli.json`)
- Single app, no monorepo, no database, no external services

## Available skills

- **react** — React best practices (hooks, components, state, performance)
- **typescript** — Strict typing, generics, utility types, safe patterns
- **nestjs** — Modules, DI, validation, testing, architecture
- **mongodb** — Schema design, queries, indexes, aggregation, Mongoose

## Tooling quirks

- **TypeScript**: `module: "nodenext"`, `moduleResolution: "nodenext"` — use `import`/`export` ESM syntax in source, but compiled output runs as CommonJS via `ts-jest`
- **ESLint**: flat config (`eslint.config.mjs`) with `@typescript-eslint/recommendedTypeChecked`; `no-explicit-any` is off, `no-floating-promises` and `no-unsafe-argument` are warnings
- **Prettier**: `singleQuote: true`, `trailingComma: "all"`, ESLint rule enforces `endOfLine: "auto"` (Windows/Unix newline tolerant)
- **Jest**: unit tests use `package.json` jest config with `rootDir: "src"`; e2e tests use separate `test/jest-e2e.json` with `rootDir: "."`
