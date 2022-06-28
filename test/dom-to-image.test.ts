import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { preview } from 'vite'
import puppeteer from 'puppeteer'
import { toMatchImageSnapshot } from 'jest-image-snapshot'

import type { Browser, ElementHandle, Page } from 'puppeteer'
import type { PreviewServer } from 'vite'

describe('dom to image', () => {
  let server: PreviewServer
  let browser: Browser
  let page: Page
  // eslint-disable-next-line import/no-mutable-exports
  let node: ElementHandle<HTMLDivElement>
  // eslint-disable-next-line import/no-mutable-exports
  let style: ElementHandle<HTMLStyleElement>

  beforeAll(async () => {
    process.env.devicePixelRatio = '1'
    server = await preview({ preview: { port: 3000 } })
    browser = await puppeteer.launch()
    page = await browser.newPage()
    await page.setContent(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Puppeteer Vitest Test Page</title>
  <script type="module">
    import * as egami from 'http://localhost:3000/index.mjs'
    window.egami = egami
  </script>
  <style>
    * {
      box-sizing: border-box;
    }
  </style>
  <style id="style"></style>
</head>
<body>
<div id="node"></div>
</body>
</html>`)
    node = (await page.$('#node'))!
    style = (await page.$('#style'))!
  })

  afterAll(async () => {
    delete process.env.devicePixelRatio
    await browser.close()
    await new Promise<void>((resolve, reject) => {
      server.httpServer.close(error => error ? reject(error) : resolve())
    })
  })

  expect.extend({ toMatchImageSnapshot })

  async function setNode(nodeHTML: string) {
    await node.evaluate((el, HTML) => {
      el.innerHTML = HTML
    }, nodeHTML)
  }

  async function setStyle(styleHTML: string) {
    await style.evaluate((el, HTML) => {
      el.innerHTML = HTML
    }, styleHTML)
  }

  async function nodeToImageBuffer() {
    return Buffer.from(
      (await node.evaluate(el => (window as any).egami.dom2png(el)))
        .replace('data:image/png;base64,', ''),
      'base64',
    )
  }

  test('background color', async () => {
    await setStyle(`#node {
  height: 100px;
  width: 100px;
  background-color: #ff0000;
}
#content {
  height: 50px;
  width: 50px;
  background-color: black;
}`)

    await setNode('<div id="content"></div>')

    expect(await nodeToImageBuffer()).toMatchImageSnapshot()
  })

  test('bigger', async () => {
    await setStyle(`#node {
  width: 100px;
}

.child-node {
  height: auto;
}

.red {
  background-color: red;
}

.green {
  background-color: green;
}

.blue {
  background-color: blue;
}

.red,
.green,
.blue {
  height: 3px;
  border: 1px solid lightgrey;
}`)

    await setNode(`<div class="dom-child-node">
  <div class="red"></div>
  <div class="green"></div>
  <div class="blue"></div>
</div>`)

    expect(await nodeToImageBuffer()).toMatchImageSnapshot()
  })

  test('border', async () => {
    await setStyle(`#node {
  font-size: 16px;
  width: 100px;
  height: 100px;
  background-color: red;
  border-color: black;
  border: solid;
  border-width: 10px 10px 0.625em 10px;
}`)

    await setNode('')

    expect(await nodeToImageBuffer()).toMatchImageSnapshot()
  })

  test('svg-color', async () => {
    await setStyle(`#node {
  width: 120px;
  overflow: hidden;
}

.rect {
  fill: black;
}`)

    await setNode(`<svg
  width="120"
  height="120"
  viewBox="0 0 120 120"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect class="rect" x="10" y="10" fill="red" width="100" height="100" />
  <foreignObject
    x="20"
    y="20"
    width="120"
    height="120"
    requiredExtensions="http://www.w3.org/1999/xhtml"
  >
    <span
      style="display: inline-block; width: 32px; height: 32px; background: red;"
    />
  </foreignObject>
</svg>`)

    expect(await nodeToImageBuffer()).toMatchImageSnapshot()
  })

  test('svg-ns', async () => {
    await setStyle(`#node {
  width: 100px;
  overflow: hidden;
}

#root {
  border: 1px solid red;
  position: relative;
  height: 100px;
}

svg {
  position: absolute;
  left: 5px;
  top: 5px;
}`)

    await setNode(`<div id="root">
  <svg xmlns="http://www.w3.org/1999/xhtml" height="94px" width="94px">
    <path
      d="M10 10 H 90 V 90 H 10 L 10 10"
      transform="translate(1,1)"
      pointer-events="visibleStroke"
      version="1.1"
      xmlns="http://www.w3.org/1999/xhtml"
      fill="none"
      stroke="#456"
      stroke-width="4"
      shape-rendering="crispEdges"
    />
  </svg>
</div>`)

    expect(await nodeToImageBuffer()).toMatchImageSnapshot()
  })

  test('svg-rect', async () => {
    await setStyle(`#node {
  width: 120px;
  overflow: hidden;
}`)

    await setNode(`<svg
  width="120"
  height="120"
  viewBox="0 0 120 120"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect x="10" y="10" width="100" height="100" />
</svg>`)

    expect(await nodeToImageBuffer()).toMatchImageSnapshot()
  })

  test('text', async () => {
    await setStyle(`#node {
  background-color: white;
  font-family: sans-serif;
  font-size: 20px;
}`)

    await setNode(`<div>
  SOME TEXT
  <div>
    SOME MORE TEXT
  </div>
</div>`)

    expect(await nodeToImageBuffer()).toMatchImageSnapshot()
  })

  test('textarea', async () => {
    await setStyle(`#node {
  width: 400px;
  height: 200px;
  background-color: white;
  padding: 1em;
}
textarea {
  height: 100%;
  width: 100%;
  font-family: monospace;
  font-size: 20px;
  border: 1px solid grey;
  padding: 1em;
}`)

    await setNode('<textarea id="input"></textarea>')

    expect(await nodeToImageBuffer()).toMatchImageSnapshot()
  })
})
