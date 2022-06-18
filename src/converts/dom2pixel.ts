import { getImageSize } from '../utils'
import { dom2canvas } from './dom2canvas'

import type { Options } from '../options'

export async function dom2pixel<T extends HTMLElement>(
  node: T,
  options?: Options,
): Promise<Uint8ClampedArray> {
  const { width, height } = getImageSize(node, options)
  const canvas = await dom2canvas(node, options)
  const ctx = canvas.getContext('2d')!
  return ctx.getImageData(0, 0, width, height).data
}
