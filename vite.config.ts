import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Use relative paths for assets in the build output. This is necessary
  // for the site to work correctly when deployed to a subdirectory on
  // shared hosting like Hostinger.
  base: '',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
