import { createContext } from '../create-context'
import { createSvg, svgToDataUrl } from '../utils'
import { domToDataUrl } from './dom-to-data-url'
import type { Options } from '../options'

export async function domToSvg<T extends Node>(
  node: T,
  options?: Options,
): Promise<string> {
  const context = await createContext(node, options)
  const dataUrl = await domToDataUrl(node, context as any)
  const { width, height } = context
  const svg = createSvg(width, height, node.ownerDocument)
  const svgImage = svg.ownerDocument.createElementNS(svg.namespaceURI, 'image')
  svgImage.setAttributeNS(null, 'href', dataUrl)
  svgImage.setAttributeNS(null, 'height', '100%')
  svgImage.setAttributeNS(null, 'width', '100%')
  svg.appendChild(svgImage)
  return svgToDataUrl(svg)
}
