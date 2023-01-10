import { resolveOptions } from '../resolve-options'
import { createImage, svgToDataUrl } from '../utils'
import { domToForeignObjectSvg } from './dom-to-foreign-object-svg'
import { imageToCanvas } from './image-to-canvas'

import type { Options } from '../options'

export async function domToCanvas<T extends Node>(
  node: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const resolved = await resolveOptions(node, options)
  const svg = await domToForeignObjectSvg(node, resolved)
  const dataUrl = svgToDataUrl(svg)
  const image = createImage(dataUrl, svg.ownerDocument)
  return await imageToCanvas(image, resolved)
}
