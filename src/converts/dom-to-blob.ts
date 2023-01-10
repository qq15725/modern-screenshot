import { resolveOptions } from '../resolve-options'
import { domToCanvas } from './dom-to-canvas'
import { canvasToblob } from './canvas-to-blob'

import type { ImageOptions, Options } from '../options'

export async function domToBlob<T extends Node>(
  node: T,
  options?: Options & ImageOptions,
): Promise<Blob | null> {
  const resolved = (await resolveOptions(node, options)) as Options & ImageOptions
  const canvas = await domToCanvas(node, resolved)
  return await canvasToblob(canvas, resolved)
}
