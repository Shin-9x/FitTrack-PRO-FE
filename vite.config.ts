import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: './',
  build: {
    outDir: 'dist-react',
    rollupOptions: {
      external: ['keytar'], // Escludi keytar dal bundle
    }
  },
  server: {
    port: 5123,
    strictPort: true
  }
})
