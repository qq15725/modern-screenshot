import path from 'path'
import { defineConfig } from 'vite'
import { browser, module, name } from './package.json'

const resolvePath = (str: string) => path.resolve(__dirname, str)

export default defineConfig({
  build: {
    lib: {
      formats: ['es', 'cjs', 'umd'],
      fileName: format => {
        if (format === 'es') return path.basename(module)
        if (format === 'umd') return path.basename(browser)
        return `${ name }.cjs`
      },
      entry: resolvePath('./src/index.ts'),
      name: 'egami',
    },
  },
  test: {
    testTimeout: 10_000,
    hookTimeout: 10_000,
  },
})
