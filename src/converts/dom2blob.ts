import { dom2canvas } from './dom2canvas'

import { canvas2blob } from './canvas2blob'
import type { Options } from '../options'

export async function dom2blob<T extends Node>(
  node: T,
  options?: Options,
): Promise<Blob | null> {
  const canvas = await dom2canvas(node, options)
  return await canvas2blob(canvas, options)
}
