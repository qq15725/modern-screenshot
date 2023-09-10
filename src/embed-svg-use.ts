import { cloneNode } from './clone-node'
import { contextFetch } from './fetch'
import type { Context } from './context'

export function embedSvgUse<T extends SVGUseElement>(
  cloned: T,
  context: Context,
): Promise<void>[] {
  const { ownerDocument, svgDefsElement } = context

  const href = cloned.getAttribute('href') // check href first as this is preferred and will be used if both are set
    ?? cloned.getAttribute('xlink:href')

  if (!href) return [] // skip blank hrefs

  const [svgUrl, id] = href.split('#')

  if (id) {
    const query = `#${ id }`
    const definition = ownerDocument?.querySelector(`svg ${ query }`)

    if (svgUrl) {
      // change the href attribute to use a local symbol on this cloned use-node
      cloned.setAttribute('href', query)
      // No need to set xlink:href since this is ignored when href is set
    }

    if (svgDefsElement?.querySelector(query)) return [] // already exists in defs

    if (definition) { // found local embedded definition
      return [
        cloneNode(definition, context)
          .then(clonedChildNode => {
            if (!svgDefsElement?.querySelector(query)) {
              svgDefsElement?.appendChild(clonedChildNode)
            }
          }),
      ]
    } else if (svgUrl) { // no local definition but found an url
      // try to fetch the svg and append it to the svgDefsElement
      return [
        contextFetch(context, {
          url: svgUrl,
          responseType: 'text',
        }).then(svgData => {
          svgDefsElement?.insertAdjacentHTML('beforeend', svgData)
        }),
      ]
    }
  }

  return []
}
