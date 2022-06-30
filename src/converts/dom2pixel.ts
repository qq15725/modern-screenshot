import { dom2canvas } from './dom2canvas'

import type { Options } from '../options'

export async function dom2pixel<T extends Node>(
  node: T,
  options?: Options,
): Promise<Uint8ClampedArray> {
  const canvas = await dom2canvas(node, options)

  const ctx = canvas.getContext('2d')!

  return ctx.getImageData(0, 0, canvas.width, canvas.height).data
}
