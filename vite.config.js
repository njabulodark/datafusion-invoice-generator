import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/datafusion-invoice-generator/',
  server: {
    allowedHosts: [/.*/],
  },
})
