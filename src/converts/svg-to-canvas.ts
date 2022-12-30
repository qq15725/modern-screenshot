import { resolveOptions } from '../options'
import { svgToImage } from './svg-to-image'
import { imageToCanvas } from './image-to-canvas'

import type { Options } from '../options'

export async function svgToCanvas<T extends SVGElement>(
  svg: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const resolved = await resolveOptions(svg, options)
  const image = await svgToImage(svg)
  return await imageToCanvas(image, resolved)
}
