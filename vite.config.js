import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Em desenvolvimento (npm run dev), redireciona /api/diario
      // para o servidor Vercel local (vercel dev na porta 3000)
      // Se usar apenas `npm run dev`, o proxy não funciona —
      // nesse caso use VITE_USE_MOCK=true ou rode `vercel dev`
    }
  }
})
