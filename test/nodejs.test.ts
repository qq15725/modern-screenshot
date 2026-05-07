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

  it('preserves selected option state', async () => {
    const window = new Window()
    const document = window.document
    document.write(`
<html>
  <body>
    <select>
      <option value="first" selected>First</option>
      <option value="second">Second</option>
      <option value="third">Third</option>
    </select>
  </body>
</html>
`)
    const select = document.querySelector('select')!
    select.value = 'second'

    const svg = await domToForeignObjectSvg(document.body as unknown as Node)
    const clonedOptions = svg.querySelectorAll('option')

    expect(clonedOptions[0].hasAttribute('selected')).toBe(false)
    expect(clonedOptions[1].hasAttribute('selected')).toBe(true)
    expect(clonedOptions[2].hasAttribute('selected')).toBe(false)
  })
})
