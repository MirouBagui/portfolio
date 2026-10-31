// Build-output check (ADR-0008): dist/route-meta.json exists next to index.html and lists
// every route: the static pages plus one /projects/:id per project in portfolio.config.
// The config is read straight from source (Node strips the types), not from the JSON.
import { existsSync, readFileSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const file = new URL('route-meta.json', dist);
const fail = (msg) => {
  console.error(`check-route-meta: ${msg}`);
  process.exit(1);
};

if (!existsSync(new URL('index.html', dist))) fail('dist/index.html missing — run vite build first');
if (!existsSync(file)) fail('dist/route-meta.json missing');

const entries = JSON.parse(readFileSync(file, 'utf8'));
if (!Array.isArray(entries)) fail('route-meta.json is not an array');

const { default: config } = await import('../src/portfolio.config.ts');
const expected = ['/', '/architecture', '/blog', ...config.projects.map((p) => `/projects/${p.id}`)];
const paths = entries.map((e) => e.path);

const missing = expected.filter((p) => !paths.includes(p));
const extra = paths.filter((p) => !expected.includes(p));
const dupes = paths.filter((p, i) => paths.indexOf(p) !== i);
const bad = entries.filter(
  (e) => typeof e.title !== 'string' || !e.title || (e.description !== undefined && (typeof e.description !== 'string' || !e.description)),
);

if (missing.length) fail(`missing routes: ${missing.join(', ')}`);
if (extra.length) fail(`unexpected routes: ${extra.join(', ')}`);
if (dupes.length) fail(`duplicate routes: ${dupes.join(', ')}`);
if (bad.length) fail(`entries without a title or with an empty description: ${bad.map((e) => e.path).join(', ')}`);

console.log(`check-route-meta: ${entries.length} routes ok`);
