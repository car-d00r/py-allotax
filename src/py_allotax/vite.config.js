
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        runes: true,
        generate: 'ssr'  // Key: compile for server-side rendering
      }
    })
  ],
  build: {
    ssr: true,
    target: 'node18',
    rollupOptions: {
      input: 'dashboard-ssr-build.js',
      output: {
        format: 'es',
        entryFileNames: 'dashboard-ssr-compiled.js'
      }
    }
  }
});