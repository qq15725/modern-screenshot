import { Window } from 'happy-dom'
import { describe, expect, it } from 'vitest'
import { domToForeignObjectSvg } from '../src'

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
