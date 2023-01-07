import { createImage } from '../utils'
import { resolveOptions } from '../options'
import { domToCanvas } from './dom-to-canvas'

import type { ImageOptions, Options } from '../options'

export async function domToImage<T extends Node>(
  node: T,
  options?: Options & ImageOptions,
): Promise<HTMLImageElement> {
  const resolved = await resolveOptions(node, options)
  const canvas = await domToCanvas(node, resolved)
  const url = canvas.toDataURL(options?.type, options?.quality)
  const image = createImage(url, node.ownerDocument!)
  const { width, height, scale } = resolved
  image.width = Math.floor(width * scale)
  image.height = Math.floor(height * scale)
  image.style.width = `${ width }px`
  image.style.height = `${ height }px`
  return image
}
