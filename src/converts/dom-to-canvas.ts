import { createContext } from '../create-context'
import { createImage, svgToDataUrl } from '../utils'
import { domToForeignObjectSvg } from './dom-to-foreign-object-svg'
import { imageToCanvas } from './image-to-canvas'

import type { Options } from '../options'

export async function domToCanvas<T extends Node>(
  node: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const context = await createContext(node, options)
  const svg = await domToForeignObjectSvg(node, context as any)
  const dataUrl = svgToDataUrl(svg)
  const image = createImage(dataUrl, svg.ownerDocument)
  return await imageToCanvas(image, context as any)
}
