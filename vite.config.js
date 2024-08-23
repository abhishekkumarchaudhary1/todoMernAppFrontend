import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BASE_URL = 'https://todomernappbackend-8fju.onrender.com'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/myApi': {
        target: `${BASE_URL}/api/v1`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/myApi/, ''),
      },
    },
  },
});
