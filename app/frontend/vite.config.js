import { defineConfig } from 'vite';

export default defineConfig({
  root: './frontend',
  build: {
    outDir: '../dist',
    rollupOptions: {
      input: {
        main: './frontend/index.html',
        login: './frontend/login.html',
        register: './frontend/register.html',
        dashboard: './frontend/dashboard.html',
        chat: './frontend/chat.html'
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
