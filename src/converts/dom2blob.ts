import { canvasToBlob } from '../utils'
import { dom2canvas } from './dom2canvas'

import type { Options } from '../options'

export async function dom2blob<T extends HTMLElement>(
  node: T,
  options?: Options,
): Promise<Blob | null> {
  return dom2canvas(node, options).then(canvasToBlob)
}
