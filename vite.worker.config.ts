import { resolve } from 'path'
import { defineConfig } from 'vite'

const resolvePath = (str: string) => resolve(__dirname, str)

export default defineConfig({
  build: {
    target: 'es2015',
    emptyOutDir: false,
    lib: {
      name: 'worker',
      formats: ['iife'],
      fileName: () => 'worker.js',
      entry: resolvePath('./src/worker.ts'),
    },
  },
})
