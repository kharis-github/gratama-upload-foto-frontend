﻿import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
	  https: false,
	host: '0.0.0.0', // 👈 Add this line
    port: 4173,       // optional: set your dev server port
  },
   build: {
    outDir: 'dist'
  }
  
})
