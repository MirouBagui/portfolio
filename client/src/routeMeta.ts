import config from './portfolio.config';

/**
 * Route meta (ADR-0008): one title/description per route, read by `usePageMeta` on navigation
 * and written out as `route-meta.json` by the build for the server. Plain data from
 * `portfolio.config` only (no DOM, no store), so vite.config.ts can import it at build time.
 * A missing description falls back to the `index.html` default.
 * Services joins when feat/security-audit-service merges.
 */
export interface RouteMeta {
  path: string;
  title: string;
  description?: string;
}

const { name, role } = config.meta;

export const routeMeta: RouteMeta[] = [
  { path: '/', title: `${name} — ${role}` },
  { path: '/architecture', title: `Architecture — ${name}`, description: config.architecturePage.intro },
  {
    path: '/blog',
    title: `Blog — ${name}`,
    description: 'Thoughts on software engineering, real-time systems, and DevOps.',
  },
  ...config.projects.map((p) => ({ path: `/projects/${p.id}`, title: `${p.title} — ${name}`, description: p.description })),
];

/** Exact match after stripping one trailing slash (`/blog/` → `/blog`). */
export function findRouteMeta(pathname: string): RouteMeta | undefined {
  const path = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  return routeMeta.find((r) => r.path === path);
}
