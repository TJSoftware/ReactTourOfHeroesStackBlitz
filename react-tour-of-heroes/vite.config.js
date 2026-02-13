import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom', // Simulates a browser in Node.js
    setupFiles: './src/setupTests.js', // Where we put the "expect" extensions
  },
})