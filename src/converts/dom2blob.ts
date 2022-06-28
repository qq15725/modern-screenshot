import { dom2canvas } from './dom2canvas'
import { canvas2blob } from './canvas2blob'

import type { Options } from '../options'

export async function dom2blob<T extends Node>(
  node: T,
  options?: Options,
): Promise<Blob | null> {
  return await canvas2blob(
    await dom2canvas(node, options),
    options,
  )
}
