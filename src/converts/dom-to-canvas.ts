import { createStyleElement, orCreateContext } from '../create-context'
import { createImage, svgToDataUrl } from '../utils'
import { imageToCanvas } from '../image-to-canvas'
import { domToForeignObjectSvg } from './dom-to-foreign-object-svg'
import type { Context } from '../context'

import type { Options } from '../options'

export async function domToCanvas<T extends Node>(node: T, options?: Options): Promise<HTMLCanvasElement>
export async function domToCanvas<T extends Node>(context: Context<T>): Promise<HTMLCanvasElement>
export async function domToCanvas(node: any, options?: any) {
  const context = await orCreateContext(node, options)
  const svg = await domToForeignObjectSvg(context)
  const dataUrl = svgToDataUrl(svg)
  if (!context.autodestruct) {
    context.svgStyleElement = createStyleElement(context.ownerDocument)
  }
  const image = createImage(dataUrl, svg.ownerDocument)
  return await imageToCanvas(image, context)
}
