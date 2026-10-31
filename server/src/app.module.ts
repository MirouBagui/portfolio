import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import type { ServerResponse } from 'http';
import { publicDir, RouteHeadMiddleware } from './route-head.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, '..', '..', '.env'),
    }),
    ServeStaticModule.forRoot({
      // No serveRoot: with serveRoot '/' the SPA fallback route becomes
      // '//{*any}' under Express 5 and every deep link (/projects/1) 404s.
      rootPath: publicDir,
      // Missing hashed assets must 404, not fall back to index.html —
      // otherwise stale clients get HTML for JS and white-screen silently.
      exclude: ['/assets/{*rest}'],
      serveStaticOptions: {
        setHeaders: (res: ServerResponse, path: string) => {
          // Hashed bundles are immutable; index.html must revalidate so
          // deploys propagate.
          res.setHeader(
            'Cache-Control',
            path.includes('/assets/')
              ? 'public, max-age=31536000, immutable'
              : 'no-cache',
          );
        },
      },
    }),
  ],
})
export class AppModule implements NestModule {
  // Nest middleware binds before ServeStatic's routes, so HTML routes get their head here first.
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RouteHeadMiddleware).forRoutes('{*path}');
  }
}
