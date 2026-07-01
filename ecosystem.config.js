// PM2 process config — `pm2 start ecosystem.config.js`
// Runs the NestJS server, which also serves the built React client from dist/public.
module.exports = {
  apps: [
    {
      name: 'portfolio',
      cwd: __dirname,
      script: 'server/dist/main.js',
      instances: 1,
      autorestart: true,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
