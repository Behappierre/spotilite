import { defineConfig } from 'vite'

// Check if we're building for production (Netlify) or development
const isProduction = process.env.NODE_ENV === 'production' || process.env.NETLIFY === 'true'

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    // Only use HTTPS in development
    ...(isProduction ? {} : {
      https: true,
      host: '127.0.0.1'
    })
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild', // Use esbuild instead of terser
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Optimize for production builds
  ...(isProduction && {
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  })
})
