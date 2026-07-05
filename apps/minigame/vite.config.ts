import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2018',
    minify: false,
    lib: {
      entry: 'src/game.ts',
      name: 'LifeSim2014Minigame',
      formats: ['iife'],
      fileName: () => 'game.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
