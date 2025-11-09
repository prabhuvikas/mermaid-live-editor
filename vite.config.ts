import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    // Exclude mermaid and all its dependencies from pre-bundling
    // Mermaid uses dynamic imports which are incompatible with Vite's optimizer
    exclude: ['mermaid'],
  },
  server: {
    port: 3000,
    // Disable dependency optimization caching to avoid stale issues
    fs: {
      strict: false,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure dynamic imports work properly in production
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
