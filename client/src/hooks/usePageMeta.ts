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

function setContent(selectors: string[], value: string) {
  for (const selector of selectors) document.querySelector(selector)?.setAttribute('content', value);
}

/**
 * Sets the head from the route-meta entry for the current path (ADR-0008). Anything the entry
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
  }, [pathname, fallbackTitle]);
}
