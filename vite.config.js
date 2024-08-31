import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/myApi': {
        target: `https://todomernappbackend-8fju.onrender.com/api/v1`,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/myApi/, ''),
      },
    },
  },
});
