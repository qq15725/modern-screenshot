import { createImage } from '../utils'
import { dom2png } from './dom2png'

import type { Options } from '../options'

export async function dom2image<T extends HTMLElement>(
  node: T,
  options: Options = {},
): Promise<HTMLImageElement> {
  return createImage(await dom2png(node, options))
}
