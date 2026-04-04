import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', 
  
  plugins: [react()],
  build: {
    outDir: 'lab7', 
    emptyOutDir: true, 
    rollupOptions: {
      output: {
        entryFileNames: 'js/index.js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'css/index.css';
          }
          return 'img/[name].[ext]';
        },
      },
    },
  },
})