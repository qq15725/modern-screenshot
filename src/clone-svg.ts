import { cloneNode } from './clone-node'
import { consoleWarn } from './utils'
import type { Context } from './context'

export async function cloneSvg<T extends SVGElement>(
  node: T,
  context: Context,
): Promise<SVGElement> {
  const { ownerDocument, svgDefsElement } = context

  // Make a deep clone first so that we can safely modify any children
  const clone = node.cloneNode(true) as T

  const uses = clone.querySelectorAll?.('use') ?? []

  for (let len = uses.length, i = 0; i < len; i++) {
    const use = uses[i]

    const href = use.getAttribute('href') // check href first as this is preferred and will be used if both are set
      ?? use.getAttribute('xlink:href')

    if (!href) continue // skip blank hrefs

    const [svgUrl, id] = href.split('#')

    if (id) {
      const query = `#${ id }`
      const definition = ownerDocument?.querySelector(`svg ${ query }`)

      if (svgUrl) {
        // change the href attribute to use a local symbol on this cloned use-node
        use.setAttribute('href', query)
        // No need to set xlink:href since this is ignored when href is set
      }

      if (svgDefsElement?.querySelector(query)) continue // already exists in defs

      if (definition) { // found local embedded definition
        svgDefsElement?.appendChild(await cloneNode(definition, context))
      } else if (svgUrl) { // no local definition but found an url
        // try to fetch the svg and append it to the svgDefsElement
        try { // wrapped in try/catch since this is network calls that is likely to fail
          const response = await fetch(svgUrl)
          const svgData = await response.text()
          svgDefsElement?.insertAdjacentHTML('beforeend', svgData)
        } catch (error) {
          consoleWarn(`Failed to fetch svg from ${ svgUrl }`, error)
        }
      }
    }
  }

  return clone
}
