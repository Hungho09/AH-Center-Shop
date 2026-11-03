import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ql/contracts': path.resolve(__dirname, '../../libs/contracts/src'),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});

