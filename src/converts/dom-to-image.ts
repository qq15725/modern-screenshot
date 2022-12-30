import { createImage } from '../utils'
import { resolveOptions } from '../options'
import { domToPng } from './dom-to-png'

import type { Options } from '../options'

export async function domToImage<T extends Node>(
  node: T,
  options?: Options,
): Promise<HTMLImageElement> {
  const resolved = await resolveOptions(node, options)
  const png = await domToPng(node, resolved)
  const image = createImage(png, node.ownerDocument!)
  const { width, height, scale } = resolved
  image.width = Math.floor(width * scale)
  image.height = Math.floor(height * scale)
  image.style.width = `${ width }px`
  image.style.height = `${ height }px`
  return image
}
