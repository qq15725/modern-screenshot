import { orCreateContext } from '../create-context'
import { createSvg, svgToDataUrl } from '../utils'
import { domToDataUrl } from './dom-to-data-url'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToSvg<T extends Node>(node: T, options?: Options): Promise<string>
export async function domToSvg<T extends Node>(context: Context<T>): Promise<string>
export async function domToSvg(node: any, options?: any) {
  const context = await orCreateContext(node, options)
  const { width, height, ownerDocument } = context
  const dataUrl = await domToDataUrl(context)
  const svg = createSvg(width, height, ownerDocument)
  const svgImage = svg.ownerDocument.createElementNS(svg.namespaceURI, 'image')
  svgImage.setAttributeNS(null, 'href', dataUrl)
  svgImage.setAttributeNS(null, 'height', '100%')
  svgImage.setAttributeNS(null, 'width', '100%')
  svg.appendChild(svgImage)
  return svgToDataUrl(svg, context.isEnable('removeControlCharacter'))
}
