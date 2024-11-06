import { basename, resolve } from 'path'
import { defineConfig } from 'vite'
import { browser, name } from './package.json'

const resolvePath = (str: string) => resolve(__dirname, str)

export default defineConfig({
  server: {
    port: 3303,
  },
  build: {
    target: 'es2015',
    lib: {
      formats: ['umd'],
      fileName: (format) => {
        if (format === 'umd')
          return basename(browser)
        return `${name}.${format}`
      },
      entry: resolvePath('./src/index.ts'),
      name: name.replace(/-(\w)/g, (_, v) => v.toUpperCase()),
    },
  },
  test: {
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
})
