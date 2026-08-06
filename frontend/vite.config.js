import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Par défaut : stack Docker locale via Traefik (http://localhost, port 80) —
      // toujours disponible, identique à la prod. Pour un backend lancé à la main
      // (`npm run dev` sur :5000) : VITE_BACKEND_URL=http://localhost:5000 npm run dev
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost',
        changeOrigin: true,
      },
    },
  },
});
