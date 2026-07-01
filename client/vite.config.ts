import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import obfuscator from 'vite-plugin-javascript-obfuscator'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Obfuscate our own source on production builds only. Vendor code
    // (node_modules) is excluded so React stays fast; settings are moderate
    // (string array + mangled names) — control-flow flattening / dead-code
    // injection are left off to avoid bloating and slowing the bundle.
    obfuscator({
      apply: 'build',
      exclude: [/node_modules/],
      options: {
        compact: true,
        identifierNamesGenerator: 'mangled',
        simplify: true,
        stringArray: true,
        stringArrayThreshold: 0.75,
        stringArrayEncoding: ['base64'],
        controlFlowFlattening: false,
        deadCodeInjection: false,
        selfDefending: false,
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: '../server/dist/public',
    emptyOutDir: true,
  },
})
