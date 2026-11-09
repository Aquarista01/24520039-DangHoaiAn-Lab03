import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      input: {
        drum: fileURLToPath(new URL('./index.html', import.meta.url)),
        piano: fileURLToPath(new URL('./piano.html', import.meta.url)),
        arena: fileURLToPath(new URL('./arena.html', import.meta.url)),
      },
    },
  },
});