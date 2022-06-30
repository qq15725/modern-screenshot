import { createImage } from '../utils'
import { dom2png } from './dom2png'

import type { Options } from '../options'

export async function dom2image<T extends Node>(
  node: T,
  options?: Options,
): Promise<HTMLImageElement> {
  const png = await dom2png(node, options)

  return createImage(png, node.ownerDocument!)
}
