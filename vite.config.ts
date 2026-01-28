import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use relative base so the app works at any subpath (e.g. candiceshen.com/spot-the-differences/)
// or at repo root on GitHub Pages (candiceshen.com/spot-the-differences/).
export default defineConfig({
  plugins: [react()],
  base: './',
})
