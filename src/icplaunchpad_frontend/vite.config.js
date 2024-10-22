import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  build: {
    emptyOutDir: true,
  },
  optimizeDeps: {
    esbuildOptions: {
      // Ensure that globalThis is defined in the browser
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: {
      // Polyfill Node.js core modules for browser compatibility
      util: 'util',  // Alias for util module
      buffer: 'buffer/',  // Alias for buffer module
      stream: 'stream-browserify',  // Alias for stream module
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4943',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    environment('all', { prefix: 'CANISTER_' }),
    environment('all', { prefix: 'DFX_' }),
  ],
});
