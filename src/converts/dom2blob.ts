import { resolveOptions } from '../options'
import { dom2canvas } from './dom2canvas'
import { canvas2blob } from './canvas2blob'

import type { BlobOptions, Options } from '../options'

export async function dom2blob<T extends Node>(
  node: T,
  options?: Options & BlobOptions,
): Promise<Blob | null> {
  const resolved = (await resolveOptions(node, options)) as Options & BlobOptions

  const canvas = await dom2canvas(node, resolved)

  return await canvas2blob(canvas, resolved)
}
