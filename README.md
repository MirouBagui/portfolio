# Portfolio

Personal portfolio of **Amir SAOUDI**, Full Stack Engineer. It's a React single-page app with a terminal look, served by a small NestJS server. There's no database: everything shown on the site comes from one config file.

Pages:

- `/`: hero, skills, projects and experience, a teaser for the architecture page, and contact.
- `/architecture`: three anonymous architecture case studies, each with a diagram.
- `/projects/:id`: detail page for one project.
- `/blog`: post listing with tag filter.
- Anything else gets a terminal-style 404 page.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Client | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| Routing / state | React Router v7 (data loaders), Zustand |
| Fonts | Space Grotesk (prose), JetBrains Mono (UI chrome); both self-hosted via `@fontsource` |
| Server | NestJS 11 + Express 5, `@nestjs/serve-static`, Helmet (CSP) |
| Tests | Jest + Supertest end-to-end tests for the server |

The server does three jobs:

- It serves the built client and falls back to `index.html` for client-side routes.
- It fills in each route's `<title>`, description and Open Graph tags for link-preview bots, because those bots don't run JavaScript.
- When `SITE_URL` is set, it also serves `/sitemap.xml` and adds the canonical and absolute-URL tags.

## Requirements

Node **22.18 or newer**. The client build runs `scripts/check-route-meta.mjs`, which loads a `.ts` file directly with Node's built-in type stripping.

## Getting started

```bash
# Install dependencies: root (server, hoisted) and client
npm ci
npm ci --prefix client

# Client dev server with hot reload: http://localhost:5173
npm run dev --prefix client
```

The Vite dev server is all you need for UI work. The NestJS server only matters for what it adds on top: per-route head tags, the sitemap, and the cache and security headers. To try those, build the site and run it:

```bash
npm run build            # client → client/dist, server → server/dist, then copies client into server/dist/public
npm run start:prod       # http://localhost:3000
```

## Configuration

Copy `.env.example` to `.env` at the repo root; the server reads it at startup.

| Variable | Default | Effect |
|----------|---------|--------|
| `PORT` | `3000` | Port the server listens on |
| `SITE_URL` | unset | Public origin, e.g. `https://example.com`. When set, every known route gets a canonical link and `og:url`, every page gets an absolute `og:image` (`/og-card.png`, 1200×630), `/sitemap.xml` lists every route, and `robots.txt` gains a `Sitemap:` line. When it's unset or invalid, none of that is output and `/sitemap.xml` returns 404. |

## Editing content

- **Projects, case studies, figures, skills, socials:** `client/src/portfolio.config.ts`. This is the single source; components read it through the Zustand store.
- **Page titles and descriptions:** `client/src/routeMeta.ts`. The client build emits it as `route-meta.json` for the server. The build fails if the router and this file disagree.
- **Case-study diagrams:** `client/src/diagrams/`, mapped by id in `registry.ts` and lazy-loaded.
- **Link-preview image:** `client/public/og-card.png`. Keep it at 1200×630.

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev --prefix client` | Vite dev server |
| `npm run build` | Full production build (client + server) |
| `npm run start:prod` | Run the built server |
| `npm run start:dev` | NestJS server in watch mode (needs a client build in `server/dist/public` to serve pages) |
| `npm run test:e2e` | Server end-to-end tests |
| `npm run lint` | ESLint on the server (`--fix`) |
| `npm run lint --prefix client` | ESLint on the client |
| `npm run format` | Prettier on the server |

## Deployment

**Docker** builds the client and server in separate stages and runs the server as the `node` user on port 3000:

```bash
docker build -t portfolio .
docker run -p 3000:3000 -e SITE_URL=https://example.com portfolio
```

**PM2**, after `npm run build`:

```bash
pm2 start ecosystem.config.js
```

`PORT` comes from the root `.env`, not from the PM2 config.

## Project structure

```
portfolio/
├── client/                      # React + Vite app
│   ├── public/                  # favicons, og-card.png, robots.txt, site.webmanifest
│   ├── scripts/
│   │   └── check-route-meta.mjs # build check: router ↔ routeMeta agree
│   └── src/
│       ├── components/          # Hero, Skills, Projects, ArchitectureTeaser, Contact, Navbar, …
│       ├── diagrams/            # case-study diagrams + registry
│       ├── hooks/               # usePageMeta, useReveal, …
│       ├── layouts/             # RootLayout (Navbar + Outlet + Footer)
│       ├── pages/               # Home, Architecture, ProjectDetail, Blog, NotFound
│       ├── stores/              # Zustand stores
│       ├── portfolio.config.ts  # all displayed content
│       ├── routeMeta.ts         # per-route title / description / path
│       └── router.tsx
├── server/
│   ├── src/
│   │   ├── main.ts              # bootstrap, Helmet CSP
│   │   ├── app.module.ts        # config, static serving, cache headers
│   │   └── route-head.middleware.ts  # per-route head, sitemap, robots
│   └── test/                    # e2e tests
├── docs/
│   ├── adr/                     # architecture decision records
│   └── case-studies/            # source notes for the case studies
├── DESIGN.md                    # design system: colour tokens, type, motion, accessibility
├── CONTEXT.md                   # glossary of project terms
├── Dockerfile
└── ecosystem.config.js          # PM2
```

## Design and decisions

- **`DESIGN.md`:** the design system. It covers the colour tokens with their contrast ratios, type, spacing, motion and accessibility rules. Every text colour meets WCAG AA unless it's decorative and `aria-hidden`.
- **`docs/adr/`:** one record per load-bearing decision. Topics include case-study attribution, the content model, colour tokens, diagram look, page layout, nav and teaser, copy, and route meta with link previews. A decision that later proves wrong is amended in place.
- **`CONTEXT.md`:** the shared vocabulary used in code, issues and ADRs.
