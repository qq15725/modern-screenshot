import { Window } from 'happy-dom'
import { describe, expect, it } from 'vitest'
import { domToForeignObjectSvg, loadMedia } from '../src'

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

  it('loadMedia with timeout 0 resolves immediately instead of waiting forever', async () => {
    const window = new Window()
    const document = window.document
    document.write('<html><body></body></html>')
    // happy-dom never loads image resources, so without a timer this media
    // would never fire `load`/`error` and the promise would hang
    const img = document.createElement('img') as unknown as HTMLImageElement
    img.src = 'http://localhost/never-loads.png'
    const result = await Promise.race([
      loadMedia(img, { timeout: 0 }).then(() => 'resolved'),
      new Promise(resolve => setTimeout(() => resolve('hung'), 1000)),
    ])
    expect(result).toBe('resolved')
  })
})
