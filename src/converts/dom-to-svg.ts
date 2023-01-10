import { resolveOptions } from '../resolve-options'
import { createSvg, svgToDataUrl } from '../utils'
import { domToDataUrl } from './dom-to-data-url'
import type { Options } from '../options'

export async function domToSvg<T extends Node>(
  node: T,
  options?: Options,
): Promise<string> {
  const resolved = await resolveOptions(node, options)
  const { width, height } = resolved
  const dataUrl = await domToDataUrl(node, resolved)
  const svg = createSvg(width, height, node.ownerDocument)
  const svgImage = svg.ownerDocument.createElementNS(svg.namespaceURI, 'image')
  svgImage.setAttributeNS(null, 'href', dataUrl)
  svgImage.setAttributeNS(null, 'height', String(width))
  svgImage.setAttributeNS(null, 'width', String(height))
  svg.appendChild(svgImage)
  return svgToDataUrl(svg)
}
