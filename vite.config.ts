import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

export default defineConfig(({ command }) => {
  return {
    base: command === 'build' ? './' : '/',
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url))
      }
    },
    server: {
      // HMR is disabled in AI Studio preview environment to prevent websocket errors
      hmr: false,
      watch: null
    }
  };
});
