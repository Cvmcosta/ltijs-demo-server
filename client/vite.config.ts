import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const BACKEND_ROUTES = ['/grade', '/members', '/resources', '/deeplink', '/info', '/lti']

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: Object.fromEntries(BACKEND_ROUTES.map(route => [route, 'http://localhost:3000'])),
  },
})
