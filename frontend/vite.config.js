import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const rootPath = process.env.ROOT_PATH || '/';

export default defineConfig({
  base: rootPath,
  plugins: [react()],
  server: {
    proxy: {
      '/-api': 'http://127.0.0.1:3000',
      '/api': 'http://127.0.0.1:3000',
      '/token': 'http://127.0.0.1:3000',
      '/trace': 'http://127.0.0.1:3000',
    },
  },
});
