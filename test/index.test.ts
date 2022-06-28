import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { preview } from 'vite'
import puppeteer from 'puppeteer'
import indexHtml from './index.html'
import * as tests from './tests'

import type { PreviewServer } from 'vite'
import type { Browser, ElementHandle, Page } from 'puppeteer'

describe('dom to image', async () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page
  let appEl: ElementHandle<HTMLDivElement>
  let styleEl: ElementHandle<HTMLStyleElement>

  beforeAll(async () => {
    process.env.devicePixelRatio = '1'
    server = await preview({ preview: { port: 3000 } })
    browser = await puppeteer.launch()
    page = await browser.newPage()
    await page.setContent(indexHtml)
    appEl = (await page.$('#app'))!
    styleEl = (await page.$('style#style'))!
  })

  afterAll(async () => {
    delete process.env.devicePixelRatio
    await browser.close()
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close(error => error ? reject(error) : resolve())
    })
  })

  Object.keys(tests).forEach(key => {
    // eslint-disable-next-line import/namespace
    const { name, image, node, style } = tests[key as keyof typeof tests]
    test(name, async () => {
      await appEl.evaluate(
        (el, val) => el.innerHTML = val,
        node,
      )
      await styleEl.evaluate(
        (el, val) => el.innerHTML = val,
        style
          .replace('<style>', '')
          .replace('</style>', ''),
      )
      const png = await appEl.evaluate(el => (window as any).egami.dom2png(el))
      try {
        expect(png).toBe(image)
      } catch (e) {
        console.error(e)
        expect(e).toBeUndefined()
      }
    }, 60_000)
  })
})
