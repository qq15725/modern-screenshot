import type { Browser, Page } from 'puppeteer'
import type { PreviewServer } from 'vite'
import { join } from 'node:path'
import puppeteer from 'puppeteer'
import { preview } from 'vite'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('compact styles in a browser', () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    server = await preview({
      build: { outDir: join(__dirname, '..') },
      preview: { port: 3012, strictPort: true },
    })
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
    page = await browser.newPage()
    await page.goto('http://localhost:3012')
    await page.addScriptTag({ url: 'http://localhost:3012/dist/index.js' })
  })

  afterAll(async () => {
    await browser?.close()
    if (server)
      await new Promise<void>((resolve, reject) => server.httpServer.close(error => error ? reject(error) : resolve()))
  })

  it('reduces repeated embedded background data without changing pixels or source nodes', async () => {
    const result = await page.evaluate(async () => {
      const texture = document.createElement('canvas')
      texture.width = texture.height = 64
      const ctx = texture.getContext('2d')!
      const noise = ctx.createImageData(64, 64)
      for (let i = 0; i < noise.data.length; i += 4) {
        noise.data[i] = (i * 17) % 251
        noise.data[i + 1] = (i * 29) % 241
        noise.data[i + 2] = (i * 43) % 239
        noise.data[i + 3] = 255
      }
      ctx.putImageData(noise, 0, 0)
      const scene = document.createElement('div')
      scene.style.cssText = 'display:flex;flex-wrap:wrap;width:240px;height:240px;background:white;'
      for (let i = 0; i < 36; i++) {
        const tile = document.createElement('div')
        tile.style.cssText = `width:40px;height:40px;background-image:url("${texture.toDataURL()}");background-size:cover;border-radius:4px;`
        scene.append(tile)
      }
      document.body.append(scene)
      const before = scene.outerHTML
      const screenshot = (window as any).modernScreenshot
      const original = await screenshot.domToForeignObjectSvg(scene, { font: false })
      const compact = await screenshot.domToForeignObjectSvg(scene, { font: false, features: { compactStyles: true } })
      const pixels = async (svg: SVGElement) => {
        const image = new Image()
        image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(svg))}`
        await image.decode()
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = 240
        const context = canvas.getContext('2d')!
        context.drawImage(image, 0, 0)
        const data = context.getImageData(0, 0, 240, 240).data
        canvas.width = canvas.height = 0
        image.src = ''
        return data
      }
      const a = await pixels(original)
      const b = await pixels(compact)
      const unchanged = scene.outerHTML === before
      scene.remove()
      return {
        original: original.outerHTML.length,
        compact: compact.outerHTML.length,
        equal: a.every((value, index) => value === b[index]),
        unchanged,
      }
    })
    expect(result.compact).toBeLessThan(result.original / 5)
    expect(result.equal).toBe(true)
    expect(result.unchanged).toBe(true)
  })

  it('preserves pseudo-elements, important declarations, nested SVGs and hook changes', async () => {
    const result = await page.evaluate(async () => {
      const style = document.createElement('style')
      style.textContent = '.compact-test-tile::before{content:"";display:block;width:8px;height:8px;background:blue;}'
      document.head.append(style)
      const scene = document.createElement('div')
      scene.style.cssText = 'width:120px;height:120px;display:flex;flex-wrap:wrap;background:white;'
      for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div')
        tile.className = 'compact-test-tile'
        tile.style.cssText = 'width:40px;height:40px;background:red !important;color:green;'
        tile.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M0 0H20V20H0Z" style="fill:green;stroke:blue;stroke-width:2"/></svg>'
        scene.append(tile)
      }
      document.body.append(scene)
      const screenshot = (window as any).modernScreenshot
      const options = {
        font: false,
        onEmbedNode(clone: Element) {
          clone.setAttribute('data-hook', 'embedded')
        },
      }
      const original = await screenshot.domToPng(scene, options)
      const compact = await screenshot.domToPng(scene, { ...options, features: { compactStyles: true } })
      const directSvg = scene.querySelector('svg')!
      const before = directSvg.outerHTML
      const directOutput = await screenshot.domToForeignObjectSvg(directSvg, { features: { compactStyles: true } })
      scene.remove()
      style.remove()
      return { equal: original === compact, sameSvg: directOutput === directSvg, unchangedSvg: directSvg.outerHTML === before }
    })
    expect(result).toEqual({ equal: true, sameSvg: true, unchangedSvg: true })
  })
})
