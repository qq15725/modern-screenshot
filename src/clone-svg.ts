import { cloneNode } from './clone-node'
import type { Context } from './context'

export async function cloneSvg<T extends SVGElement>(
  node: T,
  context: Context,
): Promise<SVGElement> {
  const { ownerDocument, svgDefsElement } = context

  const uses = node.querySelectorAll?.('use') ?? []

  if (uses.length) {
    for (let len = uses.length, i = 0; i < len; i++) {
      const use = uses[i]

      const id = use.getAttribute('xlink:href')
        ?? use.getAttribute('href')

      if (id && id.startsWith('#')) { // the href attribute (probably) really is a query selector string
        const definition = ownerDocument?.querySelector(`svg ${ id }`)

        if (!definition || svgDefsElement?.querySelector(id)) continue

        svgDefsElement?.appendChild(await cloneNode(definition, context))
      } else if (id) {
        // TODO somehow handle xlink:href and href that is a URL with id-anchor
        // ( see test/fixtures/svg.externalsymbol.html )
      }
    }
  }

  return node.cloneNode(false) as T
}
