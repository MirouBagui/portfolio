import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

/** The client build output: index.html, assets/ and route-meta.json. */
export const publicDir = join(__dirname, 'public');

interface RouteMeta {
  path: string;
  title: string;
  description?: string;
}

const NOINDEX = '<meta name="robots" content="noindex" />';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Replaces the content of `<meta name|property="key" content="…">`, if the template has it. */
function setMeta(html: string, key: string, value: string): string {
  const tag = new RegExp(
    `(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`,
  );
  return html.replace(
    tag,
    (_m, open: string, close: string) => open + value + close,
  );
}

/** SITE_URL as a bare origin (`https://example.com`), or undefined when unset or not an http(s) URL. */
export function parseSiteUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.origin
      : undefined;
  } catch {
    return undefined;
  }
}

/** Absolute-URL tags (ADR-0008): only when SITE_URL is set. `path` is omitted for unknown routes. */
function absoluteTags(origin: string, imageAlt: string, path?: string): string {
  const tags = [
    `<meta property="og:image" content="${escapeHtml(`${origin}/og-card.png`)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escapeHtml(imageAlt)}" />`,
  ];
  if (path !== undefined) {
    const url = escapeHtml(origin + path);
    tags.unshift(
      `<link rel="canonical" href="${url}" />`,
      `<meta property="og:url" content="${url}" />`,
    );
  }
  return tags.map((tag) => `  ${tag}\n`).join('');
}

function insertBeforeHeadEnd(html: string, tags: string): string {
  return tags ? html.replace('</head>', () => `${tags}  </head>`) : html;
}

/** index.html with the head filled in for one route; anything the entry lacks keeps the template default. */
function renderHead(template: string, entry: RouteMeta, extra: string): string {
  const title = escapeHtml(entry.title);
  let html = template.replace(
    /<title>[^<]*<\/title>/,
    () => `<title>${title}</title>`,
  );
  html = setMeta(html, 'og:title', title);
  html = setMeta(html, 'twitter:title', title);
  if (entry.description) {
    const description = escapeHtml(entry.description);
    for (const key of [
      'description',
      'og:description',
      'twitter:description',
    ]) {
      html = setMeta(html, key, description);
    }
  }
  return insertBeforeHeadEnd(html, extra);
}

function sitemapXml(origin: string, entries: RouteMeta[]): string {
  const urls = entries
    .map((e) => `  <url><loc>${escapeHtml(origin + e.path)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * Per-route head for link-preview bots that don't run JavaScript (ADR-0008). Runs ahead of
 * serve-static: a GET/HEAD for an HTML route (not under /assets, no file extension) gets
 * index.html with the route-meta entry's title and description; unknown paths get the
 * default head plus noindex (status stays 200, the client 404 page renders).
 *
 * With SITE_URL set, known routes also get canonical + og:url, every page gets an absolute
 * og:image (alt = the home title, which is what the card shows), /sitemap.xml lists every
 * entry and /robots.txt gains a Sitemap line. Unset: none of that; /sitemap.xml is a 404 and
 * the static robots.txt is served.
 *
 * Everything is rendered once at boot; if index.html or route-meta.json is missing every
 * request passes through to serve-static.
 */
@Injectable()
export class RouteHeadMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RouteHeadMiddleware.name);
  private readonly pages = new Map<string, string>();
  private notFoundPage?: string;
  private sitemap?: string;
  private robots?: string;

  constructor(config: ConfigService) {
    const templateFile = join(publicDir, 'index.html');
    const metaFile = join(publicDir, 'route-meta.json');
    if (!existsSync(templateFile) || !existsSync(metaFile)) {
      this.logger.warn(
        `${existsSync(templateFile) ? 'route-meta.json' : 'index.html'} not found in ${publicDir}; serving index.html without per-route head`,
      );
      return;
    }
    const template = readFileSync(templateFile, 'utf8');
    const entries = JSON.parse(readFileSync(metaFile, 'utf8')) as RouteMeta[];

    const siteUrl = config.get<string>('SITE_URL');
    const origin = parseSiteUrl(siteUrl);
    if (siteUrl && !origin)
      this.logger.warn(`SITE_URL "${siteUrl}" is not an http(s) URL; ignored`);
    const imageAlt =
      entries.find((e) => e.path === '/')?.title ?? entries[0]?.title ?? '';

    for (const entry of entries) {
      const extra = origin ? absoluteTags(origin, imageAlt, entry.path) : '';
      this.pages.set(entry.path, renderHead(template, entry, extra));
    }
    this.notFoundPage = insertBeforeHeadEnd(
      template,
      `  ${NOINDEX}\n` + (origin ? absoluteTags(origin, imageAlt) : ''),
    );

    if (origin) {
      this.sitemap = sitemapXml(origin, entries);
      const robotsFile = join(publicDir, 'robots.txt');
      const robots = existsSync(robotsFile)
        ? readFileSync(robotsFile, 'utf8').trimEnd() + '\n'
        : 'User-agent: *\nAllow: /\n';
      this.robots = `${robots}\nSitemap: ${origin}/sitemap.xml\n`;
    }
    this.logger.log(
      `Per-route head for ${entries.length} routes; ${origin ? `SITE_URL ${origin}` : 'SITE_URL unset, no absolute URLs'}`,
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Nest mounts middleware with app.use(path), so req.path is relative to the mount;
    // the full path comes from originalUrl.
    const fullPath = req.originalUrl.split('?')[0];
    const isRead = req.method === 'GET' || req.method === 'HEAD';
    if (!this.notFoundPage || !isRead) return next();

    if (fullPath === '/sitemap.xml') {
      if (!this.sitemap) return res.sendStatus(404);
      return res.type('application/xml').send(this.sitemap);
    }
    if (fullPath === '/robots.txt' && this.robots) {
      return res.type('text/plain').send(this.robots);
    }
    if (fullPath.startsWith('/assets/') || /\.[^/]*$/.test(fullPath)) {
      return next();
    }

    const path = fullPath.length > 1 ? fullPath.replace(/\/$/, '') : fullPath;
    res.setHeader('Cache-Control', 'no-cache');
    res.type('html').send(this.pages.get(path) ?? this.notFoundPage);
  }
}
