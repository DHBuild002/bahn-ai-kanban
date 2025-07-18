import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@google/genai']
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
});