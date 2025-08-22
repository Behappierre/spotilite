import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    https: false // Set to true if you need HTTPS locally
  },
  resolve: {
    extensions: ['.ts', '.js']
  }
});
