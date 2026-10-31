# Each route gets its own head from the server, built from one route-meta source; the domain comes from SITE_URL

Link-preview bots (LinkedIn, Slack, WhatsApp, X) don't run JavaScript. Today every URL returns the same `index.html`, so a shared `/architecture` link shows the home card. The NestJS server now fills in the head for each known route before sending `index.html`, from a route-meta source that the client hook also reads. Absolute URLs come from a `SITE_URL` env variable. Decided in #19 (map #8).

## Decisions

- **The server fills in the head for each route.** A route-meta source gives each route its title, description and path:
  - Static routes: `/`, `/architecture`, `/blog`.
  - One entry per project (`/projects/:id`), built from `projects` in `portfolio.config.ts`.
  - The Services route joins when that branch merges.
  - The source is a TS module in the client. The client build writes it out as `route-meta.json` next to `index.html`, and the server loads it at boot. There is one source, and the JSON is a build artifact.
  - **How the server handles a request:** a GET for an HTML route that isn't under `/assets` gets the `index.html` template with these tags replaced: `<title>`, `description`, `og:title`/`og:description`/`og:url`, `twitter:title`/`twitter:description`, and `<link rel="canonical">`. Values are HTML-escaped. Paths are matched after stripping a trailing slash.
  - Unknown paths get the default head plus `<meta name="robots" content="noindex">`. The client 404 page still renders, and the status stays 200 as today. A real 404 status for unknown routes is out of scope.
  - Rejected: **one HTML file per route, written at build time**, which depends on how serve-static resolves directories and trailing slashes, and needs a separate path for project ids; **full pre-rendering** (vite-ssg or similar), a new dependency and a rendering mode the app doesn't need for a dozen routes; **accepting the home card**, which spoils the main way the page gets shared (a link on LinkedIn).
- **`usePageMeta` reads the same source.** It sets the same tags as the server, so client-side navigation and the first server response agree. This fixes two existing defects: a page without a description kept the previous page's (Home after a project page), and the `twitter:*` tags were never updated.
- **One site-wide og:image.**
  - A static `client/public/og-card.png`, 1200×630, showing name and role in the terminal look (DESIGN.md tokens), with `og:image:alt`.
  - `twitter:card` changes to `summary_large_image`.
  - Rejected: **a separate `/architecture` card**, a second asset to keep in sync for one route; **no image**, which gives small, easy-to-miss previews.
- **No new structured data.** The existing `Person` JSON-LD stays. Case studies aren't a schema.org type that earns rich results, and an `Article` per case study would add invented dates and authorship metadata. Rejected: `Article` per case study.
- **The domain comes from `SITE_URL`.**
  - When it is set, the server outputs `canonical`, `og:url` and an absolute `og:image`, and serves `/sitemap.xml` (every route-meta entry) and a `robots.txt` that names the sitemap.
  - When it is unset (local dev, before the domain is fixed), those absolute-URL tags are left out and the static `robots.txt` is served. Nothing in the code depends on the domain.
  - Rejected: hard-coding a domain that isn't settled yet (the `index.html` TODO).

## Consequences

- `index.html` stays the default head and the template. Its TODO comment is resolved by this ADR and removed at build.
- The server gains one middleware and a dependency on a client build artifact. If `route-meta.json` is missing, the server logs it and serves `index.html` unchanged, which is no worse than today.
- Project and page titles now reach the server through the build. Changing a title requires a rebuild, which a deploy already does.
- Google already renders JavaScript, so this mainly fixes previews. The canonical link and sitemap help indexing once the domain is set.
- The og-card image is a design asset. It has to be made once, and any change to the name or role means remaking it.
