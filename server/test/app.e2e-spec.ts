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
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
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
});

describe('AppModule (e2e) without route-meta.json', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    plantFixtures(false);
    app = await NestFactory.create(AppModule, { logger: false });
    await app.init();
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
