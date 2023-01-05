import { resolveOptions } from '../options'
import { domToSvg } from './dom-to-svg'
import { svgToImage } from './svg-to-image'
import { imageToCanvas } from './image-to-canvas'

import type { Options } from '../options'

export async function domToCanvas<T extends Node>(
  node: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const resolved = await resolveOptions(node, options)
  const svg = await domToSvg(node, resolved)
  const image = await svgToImage(svg)
  return await imageToCanvas(image, resolved)
}
