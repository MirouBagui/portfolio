import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

// ServeStatic resolves public/ relative to the compiled module dir; under
// ts-jest that's server/src/public, so plant a fixture index.html there.
// Boot via NestFactory (not Test.createTestingModule) so the ServeStatic
// routes register exactly as they do in production.
const publicDir = join(__dirname, '..', 'src', 'public');

// Same head tags, same attribute order as client/index.html.
const DEFAULT_TITLE = 'Default Title';
const DEFAULT_DESCRIPTION = 'Default description.';
const indexHtml = `<!doctype html>
<html>
  <head>
    <title>${DEFAULT_TITLE}</title>
    <meta name="description" content="${DEFAULT_DESCRIPTION}" />
    <meta property="og:title" content="${DEFAULT_TITLE}" />
    <meta property="og:description" content="${DEFAULT_DESCRIPTION}" />
    <meta name="twitter:title" content="${DEFAULT_TITLE}" />
    <meta name="twitter:description" content="${DEFAULT_DESCRIPTION}" />
  </head>
  <body><div id="root">spa</div></body>
</html>`;

const STATIC_ROBOTS = 'User-agent: *\nAllow: /\n';

/** Boots the real app, with SITE_URL set to `siteUrl` or unset. */
async function boot(siteUrl?: string) {
  if (siteUrl) process.env.SITE_URL = siteUrl;
  else delete process.env.SITE_URL;
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();
  return app as INestApplication<App>;
}

const routeMeta = [
  { path: '/', title: DEFAULT_TITLE },
  {
    path: '/architecture',
    title: 'Architecture — Test',
    description: 'Three architectures.',
  },
  {
    path: '/projects/1',
    title: 'Project One — Test',
    description: 'The first project.',
  },
  {
    path: '/projects/2',
    title: 'Fish & <Chips> "Ltd"',
    description: "It's <b>bold</b> & new",
  },
];

function plantFixtures(withRouteMeta: boolean) {
  rmSync(publicDir, { recursive: true, force: true });
  mkdirSync(publicDir, { recursive: true });
  writeFileSync(join(publicDir, 'index.html'), indexHtml);
  writeFileSync(join(publicDir, 'robots.txt'), STATIC_ROBOTS);
  if (withRouteMeta)
    writeFileSync(
      join(publicDir, 'route-meta.json'),
      JSON.stringify(routeMeta),
    );
}

/** The six head values a link-preview bot reads. */
function head(html: string) {
  const meta = (key: string) =>
    new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`).exec(
      html,
    )?.[1];
  return {
    title: /<title>([^<]*)<\/title>/.exec(html)?.[1],
    description: meta('description'),
    ogTitle: meta('og:title'),
    ogDescription: meta('og:description'),
    twitterTitle: meta('twitter:title'),
    twitterDescription: meta('twitter:description'),
  };
}

const tagsFor = (title: string, description: string) => ({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterTitle: title,
  twitterDescription: description,
});

describe('AppModule (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    plantFixtures(true);
    app = await boot();
  });

  afterAll(async () => {
    await app.close();
    rmSync(publicDir, { recursive: true, force: true });
  });

  it('/ (GET) serves the SPA index', async () => {
    await request(app.getHttpServer()).get('/').expect(200);
  });

  it('deep links fall back to the SPA index (hard refresh on /projects/1)', async () => {
    const res = await request(app.getHttpServer())
      .get('/projects/1')
      .expect(200);
    expect(res.text).toContain('spa');
  });

  it('a missing hashed asset 404s instead of returning index.html', async () => {
    const res = await request(app.getHttpServer())
      .get('/assets/index-gone.js')
      .expect(404);
    expect(res.text).not.toContain('spa');
  });

  it.each([
    ['/architecture', 'Architecture — Test', 'Three architectures.'],
    ['/projects/1', 'Project One — Test', 'The first project.'],
  ])(
    '%s gets its own title and description in every head tag',
    async (path, title, description) => {
      const res = await request(app.getHttpServer())
        .get(path)
        .expect(200)
        .expect('Content-Type', /html/);
      expect(head(res.text)).toEqual(tagsFor(title, description));
      expect(res.text).not.toContain('noindex');
    },
  );

  it('an entry without a description keeps the default one', async () => {
    const res = await request(app.getHttpServer()).get('/').expect(200);
    expect(head(res.text)).toEqual(tagsFor(DEFAULT_TITLE, DEFAULT_DESCRIPTION));
  });

  it('escapes <, &, " and \' in titles and descriptions', async () => {
    const res = await request(app.getHttpServer())
      .get('/projects/2')
      .expect(200);
    expect(head(res.text)).toEqual(
      tagsFor(
        'Fish &amp; &lt;Chips&gt; &quot;Ltd&quot;',
        'It&#39;s &lt;b&gt;bold&lt;/b&gt; &amp; new',
      ),
    );
    expect(res.text).not.toContain('<Chips>');
  });

  it('a trailing slash matches the same entry', async () => {
    const res = await request(app.getHttpServer())
      .get('/architecture/')
      .expect(200);
    expect(head(res.text).title).toBe('Architecture — Test');
  });

  it('an unknown path gets the default head plus noindex, status 200', async () => {
    const res = await request(app.getHttpServer())
      .get('/no-such-page')
      .expect(200);
    expect(head(res.text)).toEqual(tagsFor(DEFAULT_TITLE, DEFAULT_DESCRIPTION));
    expect(res.text).toContain('<meta name="robots" content="noindex" />');
    expect(res.text).toContain('spa');
  });

  it('known routes are not noindexed and index.html revalidates', async () => {
    const res = await request(app.getHttpServer())
      .get('/projects/1')
      .expect(200);
    expect(res.headers['cache-control']).toBe('no-cache');
    expect(res.text).not.toContain('noindex');
  });

  it('with SITE_URL unset: no canonical, og:url or og:image; static robots.txt; no sitemap', async () => {
    const server = app.getHttpServer();
    for (const path of ['/', '/architecture', '/no-such-page']) {
      const res = await request(server).get(path).expect(200);
      expect(res.text).not.toMatch(/canonical|og:url|og:image/);
    }
    const robots = await request(server).get('/robots.txt').expect(200);
    expect(robots.text).toBe(STATIC_ROBOTS);
    await request(server).get('/sitemap.xml').expect(404);
  });
});

describe('AppModule (e2e) without route-meta.json', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    plantFixtures(false);
    app = await boot();
  });

  afterAll(async () => {
    await app.close();
    rmSync(publicDir, { recursive: true, force: true });
  });

  it.each(['/architecture', '/no-such-page'])(
    '%s gets the plain index.html',
    async (path) => {
      const res = await request(app.getHttpServer()).get(path).expect(200);
      expect(res.text).toBe(indexHtml);
    },
  );
});

describe('AppModule (e2e) with SITE_URL set', () => {
  let app: INestApplication<App>;
  const origin = 'https://example.test';

  beforeAll(async () => {
    plantFixtures(true);
    app = await boot(`${origin}/`); // trailing slash is normalised away
  });

  afterAll(async () => {
    await app.close();
    delete process.env.SITE_URL;
    rmSync(publicDir, { recursive: true, force: true });
  });

  const tag = (html: string, pattern: string) =>
    new RegExp(pattern).exec(html)?.[1];

  it.each([
    ['/', `${origin}/`],
    ['/architecture', `${origin}/architecture`],
    ['/architecture/', `${origin}/architecture`],
    ['/projects/1', `${origin}/projects/1`],
  ])('%s gets canonical and og:url %s', async (path, url) => {
    const res = await request(app.getHttpServer()).get(path).expect(200);
    expect(tag(res.text, '<link rel="canonical" href="([^"]*)"')).toBe(url);
    expect(tag(res.text, '<meta property="og:url" content="([^"]*)"')).toBe(
      url,
    );
  });

  it('every page gets the absolute og:image with alt and size', async () => {
    const res = await request(app.getHttpServer())
      .get('/architecture')
      .expect(200);
    expect(tag(res.text, '<meta property="og:image" content="([^"]*)"')).toBe(
      `${origin}/og-card.png`,
    );
    expect(
      tag(res.text, '<meta property="og:image:alt" content="([^"]*)"'),
    ).toBe(DEFAULT_TITLE);
    expect(res.text).toContain(
      '<meta property="og:image:width" content="1200" />',
    );
    expect(res.text).toContain(
      '<meta property="og:image:height" content="630" />',
    );
  });

  it('an unknown path gets noindex and og:image but no canonical or og:url', async () => {
    const res = await request(app.getHttpServer())
      .get('/no-such-page')
      .expect(200);
    expect(res.text).toContain('noindex');
    expect(res.text).toContain(`${origin}/og-card.png`);
    expect(res.text).not.toMatch(/canonical|og:url/);
  });

  it('/sitemap.xml lists every route-meta entry', async () => {
    const res = await request(app.getHttpServer())
      .get('/sitemap.xml')
      .expect(200)
      .expect('Content-Type', /xml/);
    const locs = [...res.text.matchAll(/<loc>([^<]*)<\/loc>/g)].map(
      (m) => m[1],
    );
    expect(locs).toEqual(routeMeta.map((e) => origin + e.path));
  });

  it('/robots.txt keeps the static rules and adds the Sitemap line', async () => {
    const res = await request(app.getHttpServer())
      .get('/robots.txt')
      .expect(200)
      .expect('Content-Type', /text\/plain/);
    expect(res.text).toBe(`${STATIC_ROBOTS}\nSitemap: ${origin}/sitemap.xml\n`);
  });

  it('a missing hashed asset still 404s', async () => {
    await request(app.getHttpServer()).get('/assets/index-gone.js').expect(404);
  });
});
