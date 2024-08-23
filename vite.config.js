import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/myApi': {
        target: `${import.meta.env.VITE_BASE_URL}api/v1`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/myApi/, ''),
      },
    },
  },
});
