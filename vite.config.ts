import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Repo: Naifcx47350/Portfolio → served at naifcx47350.github.io/Portfolio/
export default defineConfig({
  base: '/Portfolio/',
  plugins: [react()],
});
