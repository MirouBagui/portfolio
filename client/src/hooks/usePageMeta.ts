import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { findRouteMeta } from '../routeMeta';

const DESCRIPTION_TAGS = ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]'];
const TITLE_TAGS = ['meta[property="og:title"]', 'meta[name="twitter:title"]'];

// index.html's head is the default; read it once, before any page changes it.
const defaults = {
  title: document.title,
  description: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
};

// The server adds an absolute og:image to every page only when SITE_URL is set (ADR-0008),
// so its origin is the site origin; without it the client never writes absolute URLs.
const siteOrigin = (() => {
  const image = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
  try {
    return image ? new URL(image).origin : undefined;
  } catch {
    return undefined;
  }
})();

function setContent(selectors: string[], value: string) {
  for (const selector of selectors) document.querySelector(selector)?.setAttribute('content', value);
}

/** Points canonical and og:url at `url`, creating them if the first page had none; removes them when `url` is undefined. */
function setPageUrl(url: string | undefined) {
  const tags: [string, () => HTMLElement, string][] = [
    ['link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href'],
    ['meta[property="og:url"]', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'og:url');
      return meta;
    }, 'content'],
  ];
  for (const [selector, create, attribute] of tags) {
    let el = document.querySelector<HTMLElement>(selector);
    if (!url) {
      el?.remove();
      continue;
    }
    if (!el) el = document.head.appendChild(create());
    el.setAttribute(attribute, url);
  }
}

/**
 * Sets the head from the route-meta entry for the current path (ADR-0008), plus canonical and
 * og:url when the site origin is known (same values the server sends; unknown paths get none). Anything the entry
 * lacks resets to the index.html default, so no page keeps the previous page's values.
 * `fallbackTitle` is only for paths with no entry (the 404 page).
 */
export function usePageMeta(fallbackTitle?: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    const entry = findRouteMeta(pathname);
    const title = entry?.title ?? fallbackTitle ?? defaults.title;
    const description = entry?.description ?? defaults.description;

    document.title = title;
    setContent(TITLE_TAGS, title);
    setContent(DESCRIPTION_TAGS, description);
    if (siteOrigin) setPageUrl(entry ? siteOrigin + entry.path : undefined);
  }, [pathname, fallbackTitle]);
}
