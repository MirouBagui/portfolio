import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join, resolve } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(__dirname, '..', '..', '.env'),
    }),
    ServeStaticModule.forRoot({
      // No serveRoot: with serveRoot '/' the SPA fallback route becomes
      // '//{*any}' under Express 5 and every deep link (/projects/1) 404s.
      rootPath: join(__dirname, 'public'),
      // Missing hashed assets must 404, not fall back to index.html —
      // otherwise stale clients get HTML for JS and white-screen silently.
      exclude: ['/assets/{*rest}'],
      serveStaticOptions: {
        setHeaders: (res, path) => {
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
export class AppModule {}
