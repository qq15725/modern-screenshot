import type { Context } from './context'
import { contextFetch } from './fetch'

export function embedSvgUse<T extends SVGUseElement>(
  cloned: T,
  context: Context,
): Promise<void>[] {
  const { ownerDocument, svgDefsElement } = context

  const href = cloned.getAttribute('href') // check href first as this is preferred and will be used if both are set
    ?? cloned.getAttribute('xlink:href')

  if (!href)
    return [] // skip blank hrefs

  const [svgUrl, id] = href.split('#')

  if (id) {
    const query = `#${id}`
    const definition = ownerDocument?.querySelector(`svg ${query}`)

    if (svgUrl) {
      // change the href attribute to use a local symbol on this cloned use-node
      cloned.setAttribute('href', query)
      // No need to set xlink:href since this is ignored when href is set
    }

    if (svgDefsElement?.querySelector(query))
      return [] // already exists in defs

    if (definition) { // found local embedded definition
      // If custom cloneNode is used, the element's style will be defined inline, and the use tag cannot override the style.
      // On balance, the probability that external styles will affect defs elements is small, so origin cloneNode is used.
      svgDefsElement?.appendChild(definition.cloneNode(true))
      return []
    }
    else if (svgUrl) { // no local definition but found an url
      // try to fetch the svg and append it to the svgDefsElement
      return [
        contextFetch(context, {
          url: svgUrl,
          responseType: 'text',
        }).then((svgData) => {
          svgDefsElement?.insertAdjacentHTML('beforeend', svgData)
        }),
      ]
    }
  }

  return []
}
