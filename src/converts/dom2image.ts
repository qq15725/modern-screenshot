import { createImage } from '../utils'
import { resolveOptions } from '../options'
import { dom2png } from './dom2png'

import type { Options } from '../options'

export async function dom2image<T extends Node>(
  node: T,
  options?: Options,
): Promise<HTMLImageElement> {
  const resolved = await resolveOptions(node, options)

  const png = await dom2png(node, resolved)

  const image = createImage(png, node.ownerDocument!)

  const { width, height, scale } = resolved

  image.width = Math.floor(width * scale)
  image.height = Math.floor(height * scale)
  image.style.width = `${ width }px`
  image.style.height = `${ height }px`

  return image
}
