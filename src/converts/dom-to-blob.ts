import { resolveOptions } from '../options'
import { domToCanvas } from './dom-to-canvas'
import { canvasToblob } from './canvas-to-blob'

import type { BlobOptions, Options } from '../options'

export async function domToBlob<T extends Node>(
  node: T,
  options?: Options & BlobOptions,
): Promise<Blob | null> {
  const resolved = (await resolveOptions(node, options)) as Options & BlobOptions
  const canvas = await domToCanvas(node, resolved)
  return await canvasToblob(canvas, resolved)
}
