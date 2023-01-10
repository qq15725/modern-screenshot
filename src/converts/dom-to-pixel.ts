import { domToCanvas } from './dom-to-canvas'
import type { Options } from '../options'

export async function domToPixel<T extends Node>(
  node: T,
  options?: Options,
): Promise<Uint8ClampedArray> {
  const canvas = await domToCanvas(node, options)
  return canvas.getContext('2d')!
    .getImageData(0, 0, canvas.width, canvas.height)
    .data
}
