import { Window } from 'happy-dom'
import { describe, expect, it } from 'vitest'
import { domToForeignObjectSvg } from '../src'
import { replaceCssUrlToDataUrl } from '../src/css-url'

describe('use happy-dom in nodejs', async () => {
  it('dom to svg', async () => {
    const window = new Window()
    const document = window.document
    document.write(`
<html>
  <body>
    <div style="display: flex; justify-content: center; align-items: center;">
      <span>test1</span>
      <span>test2</span>
    </div>
  </body>
</html>
`)
    const svg = await domToForeignObjectSvg(document.body as unknown as Node)
    expect(svg.toString()).not.toBeNull()
  })
})

describe('css url embedding', () => {
  it('preserves SVG fragment identifiers when replacing image URLs', async () => {
    const requestedUrls: string[] = []
    const context = {
      timeout: 0,
      acceptOfImage: 'image/*',
      requests: new Map(),
      fetchFn: async (url: string) => {
        requestedUrls.push(url)
        return 'data:image/svg+xml;base64,PHN2Zy8+'
      },
      fetch: {
        requestInit: {},
        bypassingCache: false,
        placeholderImage: '',
      },
      font: null,
      workers: [],
      fontFamilies: new Map(),
      log: {
        warn: () => {},
      },
    } as any

    const css = await replaceCssUrlToDataUrl(
      `url("https://example.com/image.svg#svgView(preserveAspectRatio(none))")`,
      null,
      context,
      true,
    )

    expect(requestedUrls).toEqual(['https://example.com/image.svg'])
    expect(css).toBe(
      `url("data:image/svg+xml;base64,PHN2Zy8+#svgView(preserveAspectRatio(none))")`,
    )
  })
})
