import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
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

/** index.html with the head filled in for one route; anything the entry lacks keeps the template default. */
function renderHead(template: string, entry: RouteMeta): string {
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
  return html;
}

/**
 * Per-route head for link-preview bots that don't run JavaScript (ADR-0008). Runs ahead of
 * serve-static: a GET/HEAD for an HTML route (not under /assets, no file extension) gets
 * index.html with the route-meta entry's title and description; unknown paths get the
 * default head plus noindex (status stays 200, the client 404 page renders). Both files are
 * read once at boot; if either is missing every request passes through to serve-static.
 */
@Injectable()
export class RouteHeadMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RouteHeadMiddleware.name);
  private readonly pages = new Map<string, string>();
  private notFoundPage?: string;

  constructor() {
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
    for (const entry of entries)
      this.pages.set(entry.path, renderHead(template, entry));
    this.notFoundPage = template.replace('</head>', `  ${NOINDEX}\n  </head>`);
    this.logger.log(`Per-route head for ${entries.length} routes`);
  }

  use(req: Request, res: Response, next: NextFunction) {
    // Nest mounts middleware with app.use(path), so req.path is relative to the mount;
    // the full path comes from originalUrl.
    const fullPath = req.originalUrl.split('?')[0];
    const isHtmlRoute =
      (req.method === 'GET' || req.method === 'HEAD') &&
      !fullPath.startsWith('/assets/') &&
      !/\.[^/]*$/.test(fullPath);
    if (!this.notFoundPage || !isHtmlRoute) return next();

    const path = fullPath.length > 1 ? fullPath.replace(/\/$/, '') : fullPath;
    res.setHeader('Cache-Control', 'no-cache');
    res.type('html').send(this.pages.get(path) ?? this.notFoundPage);
  }
}
