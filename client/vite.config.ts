import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { routeMeta } from './src/routeMeta'

// Writes the route-meta source next to index.html for the server (ADR-0008).
function routeMetaJson(): Plugin {
  return {
    name: 'route-meta-json',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'route-meta.json', source: `${JSON.stringify(routeMeta, null, 2)}\n` })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), routeMetaJson()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  // Builds to client/dist; `npm run build:all` at the root copies it into
  // server/dist/public afterwards so the live site only sees a fast swap.
})
