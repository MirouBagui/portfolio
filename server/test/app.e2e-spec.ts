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

describe('AppModule (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    mkdirSync(publicDir, { recursive: true });
    writeFileSync(
      join(publicDir, 'index.html'),
      '<!doctype html><title>spa</title>',
    );
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
});
