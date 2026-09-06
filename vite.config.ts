import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // Caminho relativo: funciona tanto na raiz quanto em subpastas
  // (GitHub Pages de projeto serve em /cardapio-hambuguer/).
  base: './',
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
