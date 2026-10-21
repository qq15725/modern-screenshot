import type { Options } from '../src/options'
import { Window } from 'happy-dom'
import { describe, expect, it, vi } from 'vitest'
import { domToForeignObjectSvg } from '../src'
import { compactStyles } from '../src/compact-styles'
import { createContext, createStyleElement } from '../src/create-context'
import { destroyContext } from '../src/destroy-context'
import * as utils from '../src/utils'

const cssText = 'color: red !important; padding: 10px; border: 1px solid blue; background-color: white;'

function fixture() {
  const window = new Window()
  const document = window.document as unknown as Document
  const source = document.createElement('div')
  source.setAttribute('style', cssText)
  for (let i = 0; i < 4; i++) {
    const child = document.createElement('div')
    child.setAttribute('style', cssText)
    child.className = 'existing'
    source.append(child)
  }
  document.body.append(source)
  const clone = source.cloneNode(true) as HTMLElement
  const stylesheet = createStyleElement(document)!
  return { source, clone, stylesheet }
}

describe('compact inline styles', () => {
  it('shares identical root and descendant styles without changing the source or existing rules', () => {
    const { source, clone, stylesheet } = fixture()
    const before = source.outerHTML
    const existingRules = stylesheet.textContent
    compactStyles(clone, stylesheet)
    const className = clone.classList[0]
    expect(clone.hasAttribute('style')).toBe(false)
    expect(clone.querySelectorAll('[style]')).toHaveLength(0)
    expect(clone.querySelectorAll(`.existing.${className}`)).toHaveLength(4)
    expect(stylesheet.textContent).toBe(`${existingRules}.${className}{${cssText}}\n`)
    expect(stylesheet.textContent).toContain('!important')
    expect(source.outerHTML).toBe(before)
    expect(clone.outerHTML.length + stylesheet.textContent!.length).toBeLessThan(before.length)
  })

  it('keeps unique declarations and image sources intact', () => {
    const { clone, stylesheet } = fixture()
    const image = clone.ownerDocument.createElement('img')
    image.src = 'data:image/png;base64,unchanged'
    image.style.cssText = 'object-fit: cover; width: 32px; height: 32px;'
    clone.append(image)
    const before = image.outerHTML
    compactStyles(clone, stylesheet)
    expect(image.outerHTML).toBe(before)
  })

  it('does not grow small repeated declaration blocks', () => {
    const { clone, stylesheet } = fixture()
    clone.innerHTML = '<i style="x:y"></i><i style="x:y"></i>'
    clone.removeAttribute('style')
    const before = clone.outerHTML
    const rules = stylesheet.textContent
    compactStyles(clone, stylesheet)
    expect(clone.outerHTML).toBe(before)
    expect(stylesheet.textContent).toBe(rules)
  })

  it('avoids class names already present on unstyled nodes', () => {
    const { clone, stylesheet } = fixture()
    const child = clone.ownerDocument.createElement('span')
    child.className = 'collision'
    clone.append(child)
    const uuid = vi.spyOn(utils, 'uuid').mockReturnValueOnce('collision').mockReturnValue('available')
    try {
      compactStyles(clone, stylesheet)
      expect(clone.classList.contains('available')).toBe(true)
      expect(child.className).toBe('collision')
      expect(stylesheet.textContent).not.toContain('.collision{')
    }
    finally {
      uuid.mockRestore()
    }
  })

  it('preserves SVG namespaces and important declaration text', () => {
    const { clone, stylesheet } = fixture()
    const svg = clone.ownerDocument.createElementNS(utils.XMLNS, 'svg')
    for (let i = 0; i < 4; i++) {
      const path = clone.ownerDocument.createElementNS(utils.XMLNS, 'path')
      path.setAttribute('style', 'fill: red !important; stroke: blue; stroke-width: 2; opacity: 0.8;')
      svg.append(path)
    }
    clone.append(svg)
    compactStyles(clone, stylesheet)
    expect(svg.querySelectorAll('[style]')).toHaveLength(0)
    expect(Array.from(svg.children).every(child => child.namespaceURI === utils.XMLNS)).toBe(true)
    expect(stylesheet.textContent).toContain('fill: red !important;')
  })

  it('handles non-elements and missing stylesheets without changing anything', () => {
    const { clone } = fixture()
    const before = clone.outerHTML
    compactStyles(clone)
    compactStyles(clone.ownerDocument.createTextNode('text'), createStyleElement(clone.ownerDocument))
    expect(clone.outerHTML).toBe(before)
  })
})

describe('compactStyles feature', () => {
  it.each([undefined, true, false, {}, { compactStyles: false }] as Options['features'][])(
    'requires explicit opt-in with features %j',
    async (features) => {
      const { source } = fixture()
      const context = await createContext(source, { features })
      expect(context.isEnable('compactStyles')).toBe(false)
      destroyContext(context)
    },
  )

  it('compacts after the embed hook and before the final SVG hook', async () => {
    const { source } = fixture()
    const before = source.outerHTML
    const svg = await domToForeignObjectSvg(source, {
      features: { compactStyles: true },
      onEmbedNode(clone) {
        for (const element of (clone as Element).children)
          element.setAttribute('style', cssText)
      },
      onCreateForeignObjectSvg(svg) {
        expect(svg.querySelector('foreignObject')!.querySelectorAll('div[style]')).toHaveLength(1)
      },
    })
    expect(svg.querySelector('style')!.textContent).toContain(cssText)
    expect(source.outerHTML).toBe(before)
  })

  it('does not mutate the source when targeting an SVG', async () => {
    const { source } = fixture()
    const svg = source.ownerDocument.createElementNS(utils.XMLNS, 'svg')
    const before = svg.outerHTML
    await domToForeignObjectSvg(svg, { features: { compactStyles: true } })
    expect(svg.outerHTML).toBe(before)
  })
})
