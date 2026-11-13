import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    allowedHosts: ['.manus.computer', 'localhost']
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['.vercel.run', 'localhost']
  }
});
