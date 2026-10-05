import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const shouldServeReactRoute = (req) => req.headers.accept?.includes('text/html')

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Encaminha chamadas de API para o backend, mas deixa recarregamentos de páginas
      // públicas/protegidas serem atendidos pelo React Router no dev server.
      '^/(vagas|candidato|empresa|empresas/publicas|areas|docs|auth|consentimentos)(/|$)': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        bypass: (req) => {
          if (shouldServeReactRoute(req)) return req.url
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 35,
        functions: 30,
        branches: 45,
        statements: 35
      }
    }
  }
})
