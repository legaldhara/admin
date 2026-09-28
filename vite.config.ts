import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',          // expose to Docker network
    port: 5173,                // change per app
    strictPort: true,
    watch: {
      usePolling: process.env.DOCKER === 'true',  // hot reload inside Docker
    },
  },
  base: '/',
})
